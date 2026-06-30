import Image from "next/image";
import Landing from "./Components/Landing";
import { query } from './lib/db';

export default async function LandingPage() {

  let dbTime = "Connecting...";
  let connectionStatus = "🔴 Connection Failed";

  try {
    // Run the native postgres test query
    const result = await query('SELECT NOW()');
    if (result.rows.length > 0) {
      dbTime = result.rows[0].now.toString();
      connectionStatus = "🟢 Successfully Connected to TravelProject!";
    }
  } catch (err) {
    console.error(err);
  }


  return (
    <Landing />
  );
};


