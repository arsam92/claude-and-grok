# TRIAD ⚡

**Three AI minds. One problem. One verdict.**

TRIAD is a browser-first multi-model AI council that sends the same task to **ChatGPT, Claude, and Grok**, then asks ChatGPT to compare the three answers and produce a final verdict.

## What makes it different

Instead of asking one model and blindly trusting the result, TRIAD creates a small debate:

**ChatGPT — Architect**  
Builds a practical solution and thinks about implementation.

**Claude — Critic**  
Looks for hidden problems, edge cases, weak assumptions, and better alternatives.

**Grok — Challenger**  
Tries to break the idea, challenge the assumptions, and suggest unconventional directions.

**ChatGPT — Judge**  
Reads all three responses and produces the final synthesis.

## Flow

```text
                 ┌──────────────┐
                 │   YOUR IDEA  │
                 └──────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
     ┌─────────┐   ┌─────────┐   ┌─────────┐
     │ ChatGPT │   │ Claude  │   │  Grok   │
     │ Architect│  │ Critic  │   │Challenger│
     └────┬────┘   └────┬────┘   └────┬────┘
          │             │             │
          └─────────────┼─────────────┘
                        ↓
                 ┌─────────────┐
                 │   ChatGPT   │
                 │    Judge    │
                 └──────┬──────┘
                        ↓
                 ┌─────────────┐
                 │ FINAL VERDICT│
                 └─────────────┘
```

## Security

API keys are **never placed in the browser**. The UI talks only to `/api/council`, and the serverless function reads secrets from environment variables.

Required environment variables:

```text
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
XAI_API_KEY=...
```

Optional:

```text
OPENAI_MODEL=...
CLAUDE_MODEL=claude-sonnet-5
GROK_MODEL=grok-4.7
```

The project is intentionally dependency-free on the client and can be deployed from GitHub to a serverless host such as Vercel.

## Current model integration

The Grok adapter uses xAI's Responses API at `https://api.x.ai/v1/responses`. xAI currently documents `grok-4.7` as a current frontier model and recommends the Responses API for new integrations. citeturn267262search0turn267262search2

The Claude adapter uses Anthropic's Messages API. Anthropic's current documentation lists Claude Sonnet 5 and the model identifier `claude-sonnet-5`. citeturn715290search1

OpenAI's API platform currently exposes the Responses API and agent workflows. citeturn981221search7

## Run

1. Import this repository into your serverless host.
2. Add the three API keys as environment variables.
3. Deploy.
4. Open the site and send a problem.

No API key is needed in the front-end.

## Why I built it

I like AI systems that do more than generate a single answer.

TRIAD is an experiment in **multi-agent disagreement, critique, comparison, and synthesis**.

---

Built by **Arsam**.

Contact: habibifinance@gmail.com
