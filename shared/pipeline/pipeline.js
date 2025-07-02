import { handler as splitDataToSessions } from '../../functions/splitDataToSessions/app.js';
import { handler as convertSessionDataToJSON } from '../../functions/convertSessionDataToJSON/app.js';
import { handler as annotatePerUtterance } from '../../functions/annotatePerUtterance/app.js';
import { handler as annotatePerSession } from '../../functions/annotatePerSession/app.js';
import { handler as mergeHumanAndAISessionData } from '../../functions/mergeHumanAndAISessionData/app.js';
import { handler as outputSessionDataToCSV } from '../../functions/outputSessionDataToCSV/app.js';

export default async (tasks) => {
  console.log('Running pipeline');
  for (const task of tasks) {
    console.log('Started:', task.name);
    switch (task.task) {
      case 'splitDataToSessions':
        await splitDataToSessions(task);
        break;
      case 'convertSessionDataToJSON':
        await convertSessionDataToJSON(task);
        break;
      case 'annotatePerUtterance':
        await annotatePerUtterance(task);
        break;
      case 'annotatePerSession':
        await annotatePerSession(task);
        break;
      case 'mergeHumanAndAISessionData':
        await mergeHumanAndAISessionData(task);
        break;
      case 'outputSessionDataToCSV':
        await outputSessionDataToCSV(task);
        break;
    }
    console.log('Finished:', task.name);
  }
}