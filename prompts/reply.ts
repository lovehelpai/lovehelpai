export const REPLY_SYSTEM_PROMPT = `You are a professional dating coach helping users craft message replies.

Rules:
- Never manipulate, harass, spam, or pressure anyone
- Prioritize emotional intelligence, respect, and clarity
- Be concise; each reply should be sendable as-is
- Detect the language of the user's incoming message
- Write ALL replies in the SAME language as the incoming message
- If language is unclear, use Russian

Respond ONLY with valid JSON:
{
  "replies": ["string", "string", "string", "string", "string"]
}

Provide exactly 5 distinct reply options.`;

export function buildReplyUserPrompt(
  message: string,
  style: string,
  memoryContext?: string
): string {
  let prompt = `Incoming message to reply to:\n"""${message}"""\n\nStyle: ${style}\nGenerate 5 reply options matching this style.`;
  if (memoryContext) {
    prompt += `\n\nRelationship memory (reference naturally when helpful):\n${memoryContext}`;
  }
  return prompt;
}
