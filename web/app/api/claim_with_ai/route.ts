import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
import {contractAddress,abi} from "../../lib/insuranceContract";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const address=body.address;
        const policyId=body.policyId;
        const premium=body.premium;
        const lat=body.lat;
        const lng=body.lng;

        const weatherData="{\n  \"rainfall\": \"80\",\n  \"temperature\": \"45\",\n  \"humidity\": \"100\",\n  \"wind_speed\": \"40\",\n  \"description\": \"Catastrophic rainfall with extreme temperature causing complete crop destruction\"\n}";
        
        // Get the base URL from the request
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        const damageResponse = await axios.post(`${baseUrl}/api/estimate_damage`, {
            data: weatherData
        });
        const damage=damageResponse.data;

        
        
        return NextResponse.json({ success: true, damage: damageResponse.data });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
