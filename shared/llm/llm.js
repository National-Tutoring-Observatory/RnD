import './providers/openAI.js'
import getLLM from './helpers/getLLM.js';

const DEFAULTS = { quality: 'medium', stream: false, format: 'json' };

class LLM {
  constructor(options = {}) {
    this.options = { ...DEFAULTS, ...options };
    this.messages = [];
    const { methods } = getLLM(this.options.provider);
    this.methods = methods;
    this.llm = methods.init();
  }

  createChat = async () => {
    const { stream, format, quality, provider } = this.options;

    return this.methods.createChat(this);

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