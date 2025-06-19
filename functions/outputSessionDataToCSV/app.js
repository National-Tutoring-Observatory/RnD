import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { json2csv } from 'json-2-csv';
import map from 'lodash/map.js';

export const handler = async (event) => {
  try {
    const { body } = event;
    const { inputFolder, outputFolder, keys } = body;

    await fse.ensureDir(outputFolder);

    const jsonsInDir = fs.readdirSync(inputFolder).filter(file => path.extname(file) === '.json');

    let utterances = [];

    for (const file of jsonsInDir) {
      const json = await fse.readJSON(`${inputFolder}/${file}`);
      const transcript = map(json.transcript, (utterance) => {
        const annotationFields = {};
        for (const annotation of utterance.annotations || []) {
          if (annotation.identifiedBy === "HUMAN") {
            annotationFields.humanTeacherMove = annotation.teacherMove;
            annotationFields.humanReasoning = annotation.reasoning;
          } else {
            annotationFields.aiTeacherMove = annotation.teacherMove;
            annotationFields.aiReasoning = annotation.reasoning;
            annotationFields.aiStrategy = annotation.strategy;
            annotationFields.aiIntention = annotation.intention;
          }
        }
        return {
          ...utterance,
          sessionId: file.replace('.json', ''),
          ...annotationFields,
        };
      });

      utterances = utterances.concat(transcript);

    }

    const csv = json2csv(utterances, {
      keys,
      emptyFieldValue: ''
    });

    await fse.outputFile(`${outputFolder}/output-${new Date().toDateString()}.csv`, csv);

    return {
      statusCode: 200,
    };

  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err
      }),
    };
  }
};
