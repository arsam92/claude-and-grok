function json(status,body){
  return {status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"},body:JSON.stringify(body)};
}

async function askOpenAI(prompt,system){
  const r=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+process.env.OPENAI_API_KEY
    },
    body:JSON.stringify({
      model:process.env.OPENAI_MODEL || "gpt-5.6",
      instructions:system,
      input:prompt
    })
  });
  const data=await r.json();
  if(!r.ok) throw new Error("OpenAI: "+(data.error?.message || "request failed"));
  return data.output_text || "";
}

async function askClaude(prompt,system){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key":process.env.ANTHROPIC_API_KEY,
      "anthropic-version":"2023-06-01"
    },
    body:JSON.stringify({
      model:process.env.CLAUDE_MODEL || "claude-sonnet-5",
      max_tokens:5000,
      system,
      messages:[{role:"user",content:prompt}]
    })
  });
  const data=await r.json();
  if(!r.ok) throw new Error("Claude: "+(data.error?.message || "request failed"));
  return (data.content||[]).map(x=>x.text||"").join("\n").trim();
}

async function askGrok(prompt,system){
  const r=await fetch("https://api.x.ai/v1/responses",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+process.env.XAI_API_KEY
    },
    body:JSON.stringify({
      model:process.env.GROK_MODEL || "grok-4.7",
      input:[
        {role:"system",content:system},
        {role:"user",content:prompt}
      ]
    })
  });
  const data=await r.json();
  if(!r.ok) throw new Error("Grok: "+(data.error?.message || "request failed"));
  return data.output_text || "";
}

export default async function handler(req){
  if(req.method!=="POST") return json(405,{error:"Method not allowed"});
  if(!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY || !process.env.XAI_API_KEY){
    return json(500,{error:"Missing OPENAI_API_KEY, ANTHROPIC_API_KEY or XAI_API_KEY"});
  }

  const prompt=String(req.body?.prompt||"").trim();
  if(!prompt) return json(400,{error:"Prompt is required"});
  if(prompt.length>12000) return json(413,{error:"Prompt is too long"});

  const base=String(prompt);

  const [chatgpt,claude,grok]=await Promise.all([
    askOpenAI(base,
      "You are the ARCHITECT in an AI council. Produce a practical, technically strong answer. State assumptions, propose a clear plan, and avoid unnecessary hype. Do not mention hidden chain-of-thought."),
    askClaude(base,
      "You are the CRITIC in an AI council. Independently analyze the problem. Look for failure modes, edge cases, weak assumptions, trade-offs, and ways to improve the proposed direction. Do not mention hidden chain-of-thought."),
    askGrok(base,
      "You are the CHALLENGER in an AI council. Try to break the obvious solution. Offer unconventional but useful alternatives, counterexamples, and implementation ideas. Do not mention hidden chain-of-thought.")
  ]);

  const judgePrompt=[
    "USER PROBLEM:",
    base,
    "",
    "CHATGPT / ARCHITECT:",
    chatgpt,
    "",
    "CLAUDE / CRITIC:",
    claude,
    "",
    "GROK / CHALLENGER:",
    grok,
    "",
    "Act as the final JUDGE. Compare the three answers. Identify where they agree, where they disagree, which ideas are strongest, and what should actually be built. Return a concise but detailed final verdict with: BEST PLAN, KEY RISKS, WHAT TO REJECT, and NEXT STEP. Do not mention hidden chain-of-thought."
  ].join("\n");

  const verdict=await askOpenAI(judgePrompt,
    "You are the JUDGE of a multi-model council. Synthesize competing answers into one actionable result. Reward correctness, practicality, and clear reasoning. Do not blindly choose a model.");

  return json(200,{
    responses:{chatgpt,claude,grok},
    verdict
  });
}
