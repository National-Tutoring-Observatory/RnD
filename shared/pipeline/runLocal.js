import tasks from './tasks.local.json' with { type: "json" };
import pipeline from './pipeline.js';
import cloneDeep from 'lodash/cloneDeep.js';
import fs from 'fs';
import path from 'path';

async function runner() {
  try {
    for (const task of tasks.tasks) {
      const eventTasks = [];
      if (task.isActive) {

        if (task.body.inputFile.includes('/*')) {
          const inputDirectory = task.body.inputFile.replace('/*', '');
          const jsonsInDir = fs.readdirSync(inputDirectory).filter(file => path.extname(file) === '.json' || path.extname(file) === '.vtt');

          jsonsInDir.forEach(file => {
            const clonedTask = cloneDeep(task);
            clonedTask.body.inputFile = `${inputDirectory}/${file}`;
            eventTasks.push(clonedTask);
          });

        } else {
          eventTasks.push(task);
        }
      }
      await pipeline(eventTasks);
    }

  } catch (error) {
    console.log(error);
  }
}

runner();
