import './providers/openAI.js'
import './providers/aiGateway.js'
import getLLM from './helpers/getLLM.js';

const DEFAULTS = { quality: 'medium', stream: false, format: 'json', retries: 3 };

class LLM {
  constructor(options = {}) {
    this.options = { ...DEFAULTS, ...options };
    this.messages = [];
    this.orchestratorMessage;
    const { methods } = getLLM(this.options.provider);
    this.methods = methods;
    this.retries = 0;
    this.llm = methods.init();
  }

  createChat = async () => {
    if (this.orchestratorMessage) {

      const response = await this.methods.createChat(this);

      const scoreResponse = await this.methods.createChat({
        llm: this.llm,
        options: this.options,
        messages: [this.orchestratorMessage, {
          "role": 'assistant',
          'content': `Output: ${JSON.stringify(response)}`
        }]
      });

      if (scoreResponse.score > 0.8) {
        return response;
      } else {
        console.warn(`Score: ${scoreResponse.score}, Reasoning: ${scoreResponse.reasoning}`);
        if (this.retries < this.options.retries) {
          this.retries++;
          console.warn(`Retrying ${this.retries} out of ${this.options.retries}`);
          this.addUserMessage(`This is not correct. Please try again with the following reason why this is not correct. Reasoning: ${scoreResponse.reasoning}`);
          await this.createChat();
        } else {
          throw { message: 'Too many retries' };
        }
      }

    } else {
      return this.methods.createChat(this);
    }

  };

  setOrchestratorMessage = (message) => {
    this.orchestratorMessage = {
      'role': 'assistant',
      'content': message.trim()
    };
  }

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