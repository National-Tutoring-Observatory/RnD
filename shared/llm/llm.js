import getLLM from './helpers/getLLM.js';
import map from 'lodash/map.js';

const DEFAULTS = { quality: 'medium', stream: false, format: 'json' };

class LLM {
  constructor(options = {}, context) {
    this.options = { ...DEFAULTS, ...options };
    this.messages = [];
    this.context = context;
    this.llm = null;
  }

  // createSpeech = async (textToConvert) => {
  //   if (!this.llm) {
  //     this.llm = await getLLM(this.context);
  //   }

  //   if (this.llm.provider === 'OPEN_AI') {
  //     const audio = await this.llm.api.audio.speech.create({
  //       model: "tts-1",
  //       voice: this.options.voice,
  //       input: textToConvert
  //     });

  //     const buffer = Buffer.from(await audio.arrayBuffer());
  //     return buffer;
  //   }

  // }

  run = async () => {
    if (!this.llm) {
      this.llm = await getLLM(this.context);
    }

    if (this.llm.provider === 'OPEN_AI') {
      const { stream, format, quality } = this.options;
      const createObject = {
        stream,
        messages: this.messages,
        model: quality === 'medium' ? "gpt-3.5-turbo" : "gpt-4o",
      };

      if (format === 'json') {
        createObject.response_format = { type: "json_object" };
      }

      try {
        const completion = await this.llm.api.chat.completions.create(createObject);

        this.messages.push(completion.choices[0].message);

        if (format === 'json') {
          return JSON.parse(completion.choices[0].message.content);
        } else {
          return completion.choices[0].message.content;
        }

      } catch (error) {
        console.log(error);
      }
    }

    if (this.llm.provider === 'GEMINI') {
      const { format, quality } = this.options;
      const createObject = {
        contents: map(this.messages, (message) => {
          return {
            role: "user",
            parts: [{ text: message.content }]
          }
        }),
        model: quality === 'medium' ? "gemini-2.0-flash-lite" : "gemini-2.5-flash-preview-04-17",
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a helpful assistant that always responds with valid JSON. Never respond with markdown.",
        },
      };

      try {

        const completion = await this.llm.api.models.generateContent(createObject);

        if (completion.candidates && completion.candidates.length > 0 && completion.candidates[0].content.parts && completion.candidates[0].content.parts.length > 0) {
          const jsonString = completion.candidates[0].content.parts[0].text;
          try {
            const jsonOutput = JSON.parse(jsonString);
            return jsonOutput;
          } catch (error) {
            console.error("Failed to parse JSON:", error);
          }
        } else {
          console.warn('No valid response found.');
        }
      } catch (error) {
        console.log(error);
      }
    }

  };

  addSystemMessage = (message) => {
    this.messages.push({
      'role': 'system',
      'content': message.trim()
    });
  };

  addAssistantMessage = (message) => {
    this.messages.push({
      'role': 'assistant',
      'content': message.trim()
    });
  };

  addUserMessage = (message) => {
    this.messages.push({
      'role': 'user',
      'content': message.trim()
    });
  };

  getLastMessage = () => {
    return this.messages[this.messages.length - 1];
  };

  getMessages = () => {
    return this.messages;
  };

}

export default LLM;