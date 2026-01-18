import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const setTitle = async (prompt: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that can help users set titles for their prompts. Make sure that title is short and sweet. Not more than 3 words. ",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const title = response.choices[0]?.message?.content || "New Chat";

        return title;
    } catch (error) {
        console.error("setTitle error:", error);
        return "New Chat";
    }
}