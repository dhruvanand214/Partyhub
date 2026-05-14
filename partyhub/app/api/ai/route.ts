import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import PartyPlan from "@/models/PartyPlan";
import { pricingData } from "@/lib/pricingData";

async function callOpenRouter(system: string, user: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://cheersindia.app",
        "X-Title": "Cheers India",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        // Removed response_format: { type: "json_object" } because it causes free models to return blank responses
      }),
    });

    if (!res.ok) {
      if (i === retries) throw new Error(await res.text());
      continue;
    }
    
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    
    if (content.trim() !== "") {
      return content;
    }
    
    console.log(`DEBUG: AI returned blank response. Retrying... (${i+1}/${retries})`);
  }
  return "";
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { task, payload } = await req.json();

    let userRecord = null;
    
    // We only track limits and save plans for actual generation tasks
    const isPlanTask = ["party-planner", "solo-mode", "hangover-recovery"].includes(task);

    if (isPlanTask) {
      await connectToDatabase();
      userRecord = await User.findOne({ clerkId });
      
      if (!userRecord) {
        // Failsafe in case webhook was delayed or failed
        userRecord = new User({ clerkId, email: "unknown@user.com", planType: "FREE" });
        await userRecord.save();
      }

      if (userRecord.planType === "FREE" && userRecord.monthlyGenerations >= 3) {
        return NextResponse.json(
          { error: "Monthly limit reached", code: "PAYMENT_REQUIRED" },
          { status: 402 }
        );
      }
    }

    let system = "";
    let user = "";

    if (task === "party-planner") {
      system = `You are an expert Indian party planning assistant. Help plan parties for Indian audiences. 
Use Indian alcohol brands from the provided Pricing Data.
Use specific Indian food names for chakna/snacks (e.g., Masala Peanuts, Kurkure, Paneer Tikka) instead of generic terms.

CRITICAL PRICING & CALCULATION RULES:
1. The user will provide their "state". You must lookup the state multiplier in the Pricing Data. 
   - Example: finalPrice = basePrice * stateMultiplier
2. Handle Dry States: If the user's state is in the 'dry_states' list (like bihar or gujarat), return a plan but set the drink prices to 0 and add a note that alcohol is restricted.
3. Calculate bottles required using the consumption data:
   - totalML = people * ml_per_person
   - bottles = Math.ceil(totalML / bottle_size_ml)
4. NEVER price any item at ₹0 unless it's a dry state. Soft drinks, mixers, and extras must have realistic costs.
5. MATH RULE: The sum of drinks, food, and extras in budgetBreakdown MUST EXACTLY equal totalEstimatedCost.
6. The user payload includes a "drinkSegment" (budget, mid, premium, luxury). Strictly suggest brands from the pricing data that match this segment.
7. SIZING ADJUSTMENTS: If the budget is tight, suggest Quarters (180ml) or Halves (375ml) for spirits instead of Full (750ml) bottles, and estimate their prices proportionally (~25% or ~50% of 750ml price). For beer, suggest Pints (330ml) or Cans (500ml) instead of 650ml bottles.
8. COCKTAILS: Generate 2-3 simple cocktail recipes using EXACTLY the alcohol brands and mixers you suggested in the drinkPlan and extras. Do not suggest cocktails that require alcohol not in your plan.

PRICING DATA:
${JSON.stringify(pricingData)}

Encourage responsible drinking. Return ONLY valid JSON matching this exact structure:`;

      user = `Create an Indian party plan for this payload:
${JSON.stringify(payload, null, 2)}

Return this exact JSON:
{
  "summary": "Brief party summary",
  "totalEstimatedCost": 0,
  "drinkPlan": [
    {"name": "", "brand": "", "quantity": "", "estimatedCost": 0, "reason": ""}
  ],
  "foodPlan": [
    {"name": "", "quantity": "", "estimatedCost": 0}
  ],
  "extras": [
    {"name": "", "quantity": "", "estimatedCost": 0}
  ],
  "safetyTips": ["tip1", "tip2"],
  "budgetBreakdown": {"drinks": 0, "food": 0, "extras": 0},
  "cocktails": [
    {"name": "", "base": "", "desc": ""}
  ]
}`;
    }

    if (task === "solo-mode") {
      system = `You are an Indian drink recommendation assistant. Suggest Indian brands and cocktails.
Use rupee pricing. Consider local availability.
Always suggest responsible drinking, water, and food pairing.
Return ONLY valid JSON.`;

      user = `Recommend drinks for this Indian user:
${JSON.stringify(payload, null, 2)}

Return this JSON:
{
  "mood": "",
  "recommendations": [
    {
      "drinkName": "",
      "indianBrand": "",
      "type": "",
      "flavorProfile": "",
      "whyItFits": "",
      "estimatedPrice": "₹XXX",
      "foodPairing": "",
      "howToServe": "",
      "nonAlcoholicAlternative": ""
    }
  ],
  "quickTip": "",
  "responsibleDrinkingTips": ["tip1", "tip2"]
}`;
    }

    if (task === "hangover-recovery") {
      system = `You are a wellness assistant for hangover recovery, specialized for India.
Suggest Indian home remedies (nimbu pani, coconut water, ORS, etc.) along with general recovery tips.
NOT a substitute for medical advice. Return ONLY valid JSON.`;

      user = `Recovery plan for:
${JSON.stringify(payload, null, 2)}

Return this JSON:
{
  "severity": "",
  "immediateActions": ["action1"],
  "indianHomeRemedies": ["remedy1"],
  "foods": ["food1"],
  "drinks": ["drink1"],
  "avoid": ["avoid1"],
  "recoveryTimeline": "",
  "whenToSeekHelp": ["situation1"]
}`;
    }

    if (task === "dry-day") {
      system = `You are an Indian alcohol regulation assistant. Know Indian dry day rules.
Common dry days: Election days, Republic Day (26 Jan), Independence Day (15 Aug), Gandhi Jayanti (2 Oct).
Dry states: Gujarat, Bihar, Nagaland, Mizoram (partially), Manipur (partially).
Return ONLY valid JSON.`;

      user = `Is this a dry day?
${JSON.stringify(payload, null, 2)}

Return this JSON:
{
  "state": "",
  "date": "",
  "isDryDay": false,
  "reason": "",
  "confidence": "high",
  "note": "Always verify with local excise department"
}`;
    }

    if (!system) {
      return NextResponse.json({ error: "Invalid task" }, { status: 400 });
    }

    const result = await callOpenRouter(system, user);
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      // If AI fails to return valid JSON, don't count it against the limit
      return NextResponse.json({ error: "AI returned malformed data. Please try again." }, { status: 500 });
    }

    if (isPlanTask && userRecord) {
      try {
        // Save the plan to the database
        const newPlan = new PartyPlan({
          userId: userRecord._id,
          clerkId: userRecord.clerkId,
          type: task === "party-planner" ? "PARTY" : task === "solo-mode" ? "SOLO" : "RECOVERY",
          data: parsedResult,
        });
        await newPlan.save();

        // Increment usage limits
        userRecord.monthlyGenerations += 1;
        userRecord.lastGenerationDate = new Date();
        userRecord.savedPlans.push(newPlan._id);
        await userRecord.save();
      } catch (dbError) {
        console.error("Error saving plan to DB:", dbError);
        // We still return the plan to the user even if DB save fails
      }
    }

    return NextResponse.json({ result: JSON.stringify(parsedResult) });
  } catch (err: any) {
    console.error("AI Error:", err);
    return NextResponse.json({ error: err.message || "AI failed" }, { status: 500 });
  }
}