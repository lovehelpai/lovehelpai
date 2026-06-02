import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth";
import { openai, MODEL } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getMemoryContext } from "@/lib/memory";
import { extractJson } from "@/lib/ai-json";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisUserPrompt,
} from "@/prompts/analysis";

interface AnalysisResult {
  summary: string;
  interestScore: number;
  flirtScore: number;
  relationshipPotential: number;
  redFlags: string[];
  greenFlags: string[];
  recommendation: string;
  nextMessages: string[];
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { error: "Image file required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString("base64");

    const mime =
      image.type && image.type.startsWith("image/")
        ? image.type
        : "image/jpeg";

    const dataUrl = `data:${mime};base64,${base64}`;

    const memoryContext = await getMemoryContext(user.id);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: buildAnalysisUserPrompt(memoryContext),
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "No AI response" },
        { status: 502 }
      );
    }

    const result = extractJson<AnalysisResult>(raw);

    const saved = await prisma.conversationAnalysis.create({
      data: {
        userId: user.id,
        imageUrl: null,
        summary: result.summary,
        interestScore: Math.min(
          100,
          Math.max(0, Math.round(result.interestScore))
        ),
        flirtScore: Math.min(
          100,
          Math.max(0, Math.round(result.flirtScore))
        ),
        relationshipPotential: Math.min(
          100,
          Math.max(0, Math.round(result.relationshipPotential))
        ),
        redFlags: result.redFlags ?? [],
        greenFlags: result.greenFlags ?? [],
        recommendation: result.recommendation,
        nextMessages: result.nextMessages ?? [],
      },
    });

    return NextResponse.json({
      id: saved.id,
      summary: result.summary,
      interestScore: saved.interestScore,
      flirtScore: saved.flirtScore,
      relationshipPotential: saved.relationshipPotential,
      redFlags: saved.redFlags,
      greenFlags: saved.greenFlags,
      recommendation: result.recommendation,
      nextMessages: saved.nextMessages,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("[analyze]", error);

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}