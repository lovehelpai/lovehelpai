import { prisma } from "@/lib/prisma";

export async function getMemoryContext(userId: string): Promise<string> {
  const profiles = await prisma.relationshipProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (profiles.length === 0) return "";

  return profiles
    .map((p) => {
      const parts = [
        `Person: ${p.personName}`,
        p.description ? `Description: ${p.description}` : null,
        `Interest level: ${p.interestLevel}/100`,
        p.notes ? `Notes: ${p.notes}` : null,
        p.lastInteraction
          ? `Last interaction: ${p.lastInteraction.toISOString().split("T")[0]}`
          : null,
      ].filter(Boolean);
      return parts.join("\n");
    })
    .join("\n---\n");
}
