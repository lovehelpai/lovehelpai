import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  personName: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  interestLevel: z.number().min(0).max(100).optional(),
  notes: z.string().max(2000).optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string(),
  lastInteraction: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const profiles = await prisma.relationshipProfile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ profiles });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const json = await request.json();
    const parsed = createSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const profile = await prisma.relationshipProfile.create({
      data: {
        userId: user.id,
        personName: parsed.data.personName,
        description: parsed.data.description ?? null,
        interestLevel: parsed.data.interestLevel ?? 50,
        notes: parsed.data.notes ?? null,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(request);
    const json = await request.json();
    const parsed = updateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.relationshipProfile.findFirst({
      where: { id: parsed.data.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = await prisma.relationshipProfile.update({
      where: { id: parsed.data.id },
      data: {
        personName: parsed.data.personName,
        description: parsed.data.description,
        interestLevel: parsed.data.interestLevel,
        notes: parsed.data.notes,
        lastInteraction: parsed.data.lastInteraction
          ? new Date(parsed.data.lastInteraction)
          : undefined,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await prisma.relationshipProfile.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
