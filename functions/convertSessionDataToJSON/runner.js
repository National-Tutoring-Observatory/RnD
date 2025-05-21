import { lambdaHandler } from './app.js';
import fs from 'fs';
import path from 'path';


async function runner() {

  const jsonsInDir = fs.readdirSync('../../localData/input').filter(file => path.extname(file) === '.json');

  const events = [];

  jsonsInDir.forEach(file => {
    events.push({
      body: {
        "inputFile": `../../localData/input/${file}`,
        "outputFolder": "../../localData/analysis"
      }
    });
  });

  for (const event of events) {
    await lambdaHandler(event);
  }
}



runner();