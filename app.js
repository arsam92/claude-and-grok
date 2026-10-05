const form=document.getElementById("council-form");
const promptBox=document.getElementById("prompt");
const run=document.getElementById("run");
const results=document.getElementById("results");
const latency=document.getElementById("latency");
const timing=document.getElementById("timing");

form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  const prompt=promptBox.value.trim();
  if(!prompt)return;

  run.disabled=true;
  run.textContent="CONVENING…";
  latency.textContent="RUNNING";
  results.classList.remove("hidden");
  document.getElementById("chatgpt-out").textContent="Waiting…";
  document.getElementById("claude-out").textContent="Waiting…";
  document.getElementById("grok-out").textContent="Waiting…";
  document.getElementById("verdict-out").textContent="Waiting for the council…";

  const start=performance.now();
  try{
    const response=await fetch("/api/council",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt})
    });
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||"Council request failed");

    document.getElementById("chatgpt-out").textContent=data.responses.chatgpt;
    document.getElementById("claude-out").textContent=data.responses.claude;
    document.getElementById("grok-out").textContent=data.responses.grok;
    document.getElementById("verdict-out").textContent=data.verdict;
    const ms=Math.round(performance.now()-start);
    latency.textContent="COMPLETE";
    timing.textContent=ms+" ms";
    results.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(error){
    latency.textContent="ERROR";
    document.getElementById("verdict-out").textContent="Error: "+error.message;
  }finally{
    run.disabled=false;
    run.textContent="CONVENE THE COUNCIL →";
  }
});
