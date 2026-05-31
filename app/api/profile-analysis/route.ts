import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth";
import { openai, MODEL } from "@/lib/openai";
import { getMemoryContext } from "@/lib/memory";
import { extractJson } from "@/lib/ai-json";
import {
  PROFILE_SYSTEM_PROMPT,
  buildProfileUserPrompt,
} from "@/prompts/profile";

interface ProfileResult {
  personalityType: string;
  interests: string[];
  conversationStarters: string[];
  topicsToAvoid: string[];
  datingStrategy: string;
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: "Image file required" }, { status: 400 });
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
        { role: "system", content: PROFILE_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: buildProfileUserPrompt(memoryContext) },
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "No AI response" }, { status: 502 });
    }

    const result = extractJson<ProfileResult>(raw);

    return NextResponse.json({
      personalityType: result.personalityType,
      interests: result.interests ?? [],
      conversationStarters: result.conversationStarters ?? [],
      topicsToAvoid: result.topicsToAvoid ?? [],
      datingStrategy: result.datingStrategy,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[profile-analysis]", error);
    return NextResponse.json(
      { error: "Profile analysis failed" },
      { status: 500 }
    );
  }
}
