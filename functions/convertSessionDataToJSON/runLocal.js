import { lambdaHandler } from './app.js';
import event from './event.json' with { type: "json" };

async function runLocal() {
  try {
    const response = await lambdaHandler(event);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

runLocal();
