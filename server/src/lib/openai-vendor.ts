// import OpenAI from "openai";
// import type { ChatCompletionMessageParam } from "openai/resources/chat";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY,
// });

// export interface ChatParams {
//   messages: ChatCompletionMessageParam[];
//   temperature?: number;
//   max_tokens?: number;
// }

// export const createChatStream = async (params: ChatParams) => {
//   return openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: params.messages,
//     temperature: params.temperature ?? 0.7,
//     max_tokens: params.max_tokens,
//     stream: true,
//   });
// };
