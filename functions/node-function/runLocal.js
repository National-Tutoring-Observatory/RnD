import { lambdaHandler } from './app.js';

async function runLocal() {
  try {
    const response = await lambdaHandler({});
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

runLocal();
