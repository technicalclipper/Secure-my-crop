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
        const damage = damageResponse.data.res;
        
        // Parse damage percentage from the AI response
        const damagePercent = parseInt(damage);
        
        // Check if damage is greater than 20%
        if (damagePercent > 20) {
            // Setup ethers wallet with private key
            const privateKey = process.env.AGENT_PRIVATE_KEY;
            if (!privateKey) {
                throw new Error("AGENT_PRIVATE_KEY not found in environment variables");
            }
            
            // Create provider and wallet
            const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
            const wallet = new ethers.Wallet(privateKey, provider);
            
            // Create contract instance with wallet
            const contract = new ethers.Contract(contractAddress, abi, wallet);
            
            // Call issuePayout function
            console.log(`Issuing payout for policy ${policyId} with damage ${damagePercent}%`);
            const tx = await contract.issuePayout(policyId, damagePercent);
            
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            
            return NextResponse.json({ 
                success: true, 
                damage: damageResponse.data,
                payoutIssued: true,
                transactionHash: receipt.hash,
                damagePercent: damagePercent
            });
        } else {
            return NextResponse.json({ 
                success: true, 
                damage: damageResponse.data,
                payoutIssued: false,
                damagePercent: damagePercent,
                message: "Damage is not sufficient for payout (must be > 20%)"
            });
        }
        
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
