import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { openai, MODEL } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getMemoryContext } from "@/lib/memory";
import { extractJson } from "@/lib/ai-json";
import { COACH_SYSTEM_PROMPT, buildCoachUserPrompt } from "@/prompts/coach";

const bodySchema = z.object({
  scenario: z.string().min(1).max(200),
  context: z.string().min(1).max(4000),
});

interface CoachResult {
  situation: string;
  advice: string;
  thingsToAvoid: string[];
  suggestedMessages: string[];
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { scenario, context } = parsed.data;
    const memoryContext = await getMemoryContext(user.id);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: COACH_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildCoachUserPrompt(scenario, context, memoryContext),
        },
      ],
      max_tokens: 2000,
      temperature: 0.75,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "No AI response" }, { status: 502 });
    }

    const result = extractJson<CoachResult>(raw);

    await prisma.scenario.create({
      data: {
        userId: user.id,
        type: scenario,
        context,
        result: JSON.stringify(result),
      },
    });

    return NextResponse.json({
      situation: result.situation,
      advice: result.advice,
      thingsToAvoid: result.thingsToAvoid ?? [],
      suggestedMessages: result.suggestedMessages ?? [],
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[coach]", error);
    return NextResponse.json({ error: "Coach request failed" }, { status: 500 });
  }
}
