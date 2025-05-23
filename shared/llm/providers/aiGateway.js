import { OpenAI } from 'openai';
import registerLLM from "../helpers/registerLLM.js";

registerLLM('AI_GATEWAY', {
  init: () => {
    const openai = new OpenAI({
      apiKey: process.env.AI_GATEWAY_KEY,
      baseURL: process.env.AI_GATEWAY_BASE_URL
    });
    return openai;
  },
  createChat: async ({ llm, options, messages }) => {

    const { quality } = options;

    const chatCompletion = await llm.chat.completions.create({
      model: quality === 'medium' ? "openai.gpt-4.1-mini" : "openai.gpt-4.1",
      messages: messages,
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);

  }
});