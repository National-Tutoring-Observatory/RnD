import { OpenAI } from 'openai';

export default async ({ models, llm }) => {
  if (llm === 'OPENAI') {
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
    return openai;
  }
};