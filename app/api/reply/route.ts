import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { openai, MODEL } from "@/lib/openai";
import { getMemoryContext } from "@/lib/memory";
import { extractJson } from "@/lib/ai-json";
import { REPLY_SYSTEM_PROMPT, buildReplyUserPrompt } from "@/prompts/reply";

const bodySchema = z.object({
  message: z.string().min(1).max(4000),
  style: z.enum(["friendly", "confident", "flirty", "funny", "romantic"]),
  personName: z.string().optional(),
});

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

    const { message, style } = parsed.data;
    const memoryContext = await getMemoryContext(user.id);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: REPLY_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildReplyUserPrompt(message, style, memoryContext),
        },
      ],
      max_tokens: 1500,
      temperature: 0.85,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "No AI response" }, { status: 502 });
    }

    const result = extractJson<{ replies: string[] }>(raw);

    return NextResponse.json({
      replies: (result.replies ?? []).slice(0, 5),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[reply]", error);
    return NextResponse.json({ error: "Reply generation failed" }, { status: 500 });
  }
}
