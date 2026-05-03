import { NextResponse } from "next/server";

async function callOpenRouter(system: string, user: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://cheersindia.app",
      "X-Title": "Cheers India",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: Request) {
  try {
    const { task, payload } = await req.json();

    let system = "";
    let user = "";

    if (task === "party-planner") {
      system = `You are an expert Indian party planning assistant. Help plan parties for Indian audiences. 
Use Indian alcohol brands like Old Monk, Royal Stag, McDowell's, Kingfisher, Bira, Sula Wines, etc.
Use Indian food like chakna, biryani, tandoori, snacks, etc.
Use Indian Rupee (₹) for all prices. 
Encourage responsible drinking. Return ONLY valid JSON.`;

      user = `Create an Indian party plan:
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
  "budgetBreakdown": {"drinks": 0, "food": 0, "extras": 0}
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
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("AI Error:", err);
    return NextResponse.json({ error: err.message || "AI failed" }, { status: 500 });
  }
}