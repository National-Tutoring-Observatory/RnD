import { handler as splitDataToSessions } from '../../functions/splitDataToSessions/app.js';
import { handler as convertSessionDataToJSON } from '../../functions/convertSessionDataToJSON/app.js';
import { handler as annotateSessionDataWithTeacherMoves } from '../../functions/annotateSessionDataWithTeacherMoves/app.js';

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
      case 'annotateSessionDataWithTeacherMoves':
        await annotateSessionDataWithTeacherMoves(task);
        break;
    }
    console.log('Finised:', task.name);
  }
}