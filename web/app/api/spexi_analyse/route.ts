import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Read the spexi image file
    const imagePath = path.join(process.cwd(), "public", "spexi_farm.jpg");
    
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ 
        error: "Image file spexi_farm.jpg not found" 
      }, { status: 404 });
    }

   
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Analyze image with OpenAI Vision
    const analysis = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this farmland image and provide a detailed assessment:
              
              1. **Damage Assessment**: Determine if the farmland has been destroyed or damaged
              2. **Damage Level**: Rate the damage level (0-100%):
                 - 0-20%: Minimal damage
                 - 21-40%: Light damage
                 - 41-60%: Moderate damage
                 - 61-80%: Severe damage
                 - 81-100%: Complete destruction
              3. **Damage Type**: Identify the type of damage (drought, flood, storm, fire, etc.)
              4. **Crop Status**: Assess the condition of crops
              5. **Infrastructure**: Check if farming infrastructure is affected
              6. **Recovery Potential**: Estimate recovery time and possibility
              
              Provide your analysis in JSON format with these fields:
              {
                "damage_detected": boolean,
                "damage_percentage": number,
                "damage_type": string,
                "crop_condition": string,
                "infrastructure_affected": boolean,
                "recovery_estimate": string,
                "detailed_analysis": string
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const analysisResult = analysis.choices[0]?.message?.content;
    
   
    let parsedAnalysis;
    try {
     
      const jsonMatch = analysisResult?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        parsedAnalysis = { raw_analysis: analysisResult };
      }
    } catch (parseError) {
      parsedAnalysis = { raw_analysis: analysisResult };
    }

    return NextResponse.json({
      success: true,
      image_analyzed: "spexi_farm.jpg",
      analysis: parsedAnalysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ 
      error: "Failed to analyze image",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

//testing endpoint
export async function GET() {
  return NextResponse.json({
    message: "SPEXI Image Analysis API",
    description: "POST an image to analyze farm damage using OpenAI Vision",
    usage: "POST /api/spexi_analyse with spexi_farm.jpg in public folder",
    required_env: "OPENAI_API_KEY"
  });
} 