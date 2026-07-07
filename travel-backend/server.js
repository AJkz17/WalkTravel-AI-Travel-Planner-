require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // 👈 Correct SDK package import
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Initialize the Gemini client instance safely
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.send('🚀 AI Travel Planner Backend API is running smoothly!');
});

// 🔐 USER REGISTRATION
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields (Username, Email, Password) are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryText = `
            INSERT INTO users (username, email, password, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            RETURNING id, username, email;
        `;
        const values = [username, email, hashedPassword];
        const result = await pool.query(queryText, values);
        
        console.log('🟢 New user registered successfully in database: ID', result.rows[0].id);
        res.status(201).json({
            success: true,
            message: 'Account created successfully! You can now log in.',
            user: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        console.error('❌ Registration Error:', error);
        res.status(500).json({ error: 'Internal server database error.' });
    }
});

// TRIP CREATION & AI ITINERARY GENERATION
app.post('/api/trips', async (req, res) => {
    const { 
        destination, 
        startDate, 
        endDate, 
        budget, 
        travelers, 
        accommodation, 
        travelStyle, 
        interests 
    } = req.body;

    if (!destination || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing destination or dates.' });
    }

    try {
        // SQL INSERT 
        const queryText = `
            INSERT INTO trips (
                user_id, 
                trip_name, 
                destination, 
                start_date, 
                end_date, 
                budget, 
                currency, 
                travellers, 
                status, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
            RETURNING id;
        `;
        
        // Map the parameters
        const values = [
            1,                                   
            `Trip to ${destination}`,              
            destination,                          
            startDate,                             
            endDate,                               
            budget,                                 
            'USD',                                  
            parseInt(travelers) || 1,               
            'Draft'                                 
        ];

        const dbResult = await pool.query(queryText, values);
        const savedTripId = dbResult.rows[0].id;
        const prompt = `
            You are an expert travel planner. Create a summarized, high-impact daily itinerary for a trip to ${destination}.
            
            Parameters:
            - Duration: ${startDate} to ${endDate} | Style: ${travelStyle} | Budget: ${budget}

            Requirements:
            - Provide a quick bulleted summary for each day (Morning, Afternoon, Evening).
            - CRITICAL: For EVERY landmark, attraction, or unique neighborhood you mention, add a search token on a COMPLETELY NEW standalone line separated by blank lines before and after. Use this exact syntax:
            
            [Image Search: Clean Attraction Name, ${destination}]
            
            Example:
            [Image Search: Cheong Fatt Tze Mansion, Penang]
            
            Do not include text descriptors inside parentheses like "(Blue Mansion)" in the tag because it ruins the Pexels search accuracy. Keep the search terms precise and clean.
            - Keep descriptions punchy and brief. Avoid long paragraphs.
        `;

        console.log(`Consulting for an image-rich schedule to ${destination}...`);
        
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const aiResult = await model.generateContent(prompt);
        const itineraryMarkdown = aiResult.response.text(); 
        const fileUpload = require('express-fileupload');

        // Return valid JSON payload structure back to frontend layout
        res.status(201).json({
            success: true,
            message: 'Trip saved and AI itinerary generated successfully!',
            tripId: savedTripId,
            itinerary: itineraryMarkdown
        });
    } catch (error) {
        console.error('❌ AI Integration or DB failure:', error);
        res.status(500).json({ error: 'Something went wrong while processing your travel details.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Structural input confirmation
    if (!email || !password) {
        return res.status(400).json({ error: 'Both email and password are required.' });
    }

    try {
        // Query database to find the user by their email string
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        // If no matching email row exists in the users table database
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email credentials or password.' });
        }

        const user = result.rows[0];

        // 3. Compare password with database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid email credentials or password.' });
        }

        // 4. Successful match! Send user information back to the frontend
        console.log(`🔓 User authenticated successfully: ${user.username} (ID: ${user.id})`);
        
        res.status(200).json({
            success: true,
            message: '🟢 Login successful! Welcome back.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('❌ Login authentication error:', error);
        res.status(500).json({ error: 'Internal backend validation crash.' });
    }
});

app.get('/api/images', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        
        if (!accessKey) {
            console.error("❌ Backend error: UNSPLASH_ACCESS_KEY is missing from .env");
            return res.status(500).json({ error: 'Server image configuration missing' });
        }

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
            {
                headers: {
                    Authorization: `Client-ID ${accessKey}`
                }
            }
        );

        if (!response.ok) throw new Error(`Unsplash status error: ${response.status}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const urls = data.results.map(img => img.urls.regular);
            return res.json({ success: true, images: urls });
        } else {
            return res.json({ success: true, images: [] });
        }
    } catch (error) {
        console.error("❌ Proxy Image route failed:", error);
        return res.status(500).json({ error: 'Failed to complete image request' });
    }
});

const pdfParse = require('pdf-parse');

app.post('/api/upload-document', async (req, res) => {
    try {
        if (!req.files || !req.files.document) {
            return res.status(400).json({ error: "No document file detected." });
        }

        const pdfFile = req.files.document;

        // Run Text Extraction (OCR/Character Parsing)
        const parsedData = await pdfParse(pdfFile.data);
        const rawText = parsedData.text; 

        if (!rawText.trim()) {
            return res.status(400).json({ error: "Could not extract any text from this PDF." });
        }

        // Text Chunking
        const chunks = [];
        const words = rawText.split(/\s+/);
        let currentChunk = [];

        for (const word of words) {
            currentChunk.push(word);
            if (currentChunk.join(' ').length >= 500) {
                chunks.push(currentChunk.join(' '));
                currentChunk = [];
            }
        }
        if (currentChunk.length > 0) chunks.push(currentChunk.join(' '));

        // For now, we will return the chunks to confirm it works
        return res.status(200).json({
            message: "Document successfully parsed!",
            totalChunks: chunks.length,
            preview: chunks.slice(0, 2) 
        });

    } catch (error) {
        console.error("❌ Document ingestion failed:", error);
        res.status(500).json({ error: "Internal server processing failure." });
    }
});



app.listen(PORT, () => {
    console.log(`🚀 Backend server live at http://localhost:${PORT}`);
});