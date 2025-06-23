import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.data) {
      return NextResponse.json({ error: "Missing transaction data" }, { status: 400 });
    }

    const user_prompt = body.data; // Extract transaction value from request body
    console.log(user_prompt);
    
    type Message = {
      role: string;
      content: string;
    };
    
    type Result = {
      messages: Message[];
    };
    function extractAssistantReply(result: Result): string | null {
      const assistantMessage = result.messages.find(msg => msg.role === "assistant");
      return assistantMessage ? assistantMessage.content : null;
    }
    

    const agent = new Agent({
        name: "Crop Damage Assessment Agent",
        model: {
          provider: "OPEN_AI",
          name: "gpt-4o-mini",
        },
        description: `You are a crop damage calculator. You receive weather data and must return ONLY a single number between 0 and 100 representing the percentage of crop damage.

        CRITICAL: You must return ONLY a number, no text, no JSON, no explanation.
        
        Examples of correct responses:
        80
        45
        100
        0
        
        Examples of WRONG responses:
        {"damage": "80"}
        "80% damage"
        "Complete crop destruction due to extreme temperature and excessive rainfall leads to 100% damage."
        
        Return ONLY the number.`,
        
        instructions: [
            "You are a damage calculator that returns ONLY a number between 0-100",
            "Do NOT return JSON format",
            "Do NOT return descriptive text",
            "Do NOT return explanations",
            "Return ONLY a single number",
            "The number represents damage percentage",
            "Example correct response: 80",
            "Example wrong response: '80% damage' or 'Complete crop destruction...'",
            "If you see any text in your response, you are wrong",
            "Only numbers are allowed in your response"
          ]
      });
      

    const state = StateFn.root(agent.description);
    state.messages.push(user(user_prompt)); 

    const result = await agent.run(state);
    //@ts-expect-error correct type
    const res=extractAssistantReply(result)
    return NextResponse.json({ res });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}