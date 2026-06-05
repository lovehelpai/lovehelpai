export const MODEL = "openai/gpt-4o-mini";

export const openai = {
  chat: {
    completions: {
      create: async (params: any) => {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: params.messages,
            temperature: params.temperature ?? 0.7,
            max_tokens: params.max_tokens ?? 2000,
          }),
        });

        const data = await res.json();

        return {
          choices: [
            {
              message: {
                content: data.choices?.[0]?.message?.content || "",
              },
            },
          ],
        };
      },
    },
  },
};
