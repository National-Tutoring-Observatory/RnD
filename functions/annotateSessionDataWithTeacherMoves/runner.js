import { lambdaHandler } from './app.js';
import fs from 'fs';
import path from 'path';


async function runner() {

  const jsonsInDir = fs.readdirSync('../../localData/analysis').filter(file => path.extname(file) === '.json');

  const events = [];

  jsonsInDir.forEach(file => {
    events.push({
      body: {
        "inputFile": `../../localData/analysis/${file}`,
        "outputFolder": "../../localData/analysis",
        "promptId": "0"
      }
    });
  });

  await lambdaHandler(events[0]);

  // for (const event of events) {
  //   await lambdaHandler(event);
  // }
}



runner();