import fs from 'fs';
import fse from 'fs-extra';
import readline from 'readline';
import path from 'path';
import get from 'lodash/get.js';

export const handler = async (event) => {
  try {
    const { body } = event;
    const { inputFolderHuman, inputFolderAI, outputFolder } = body;

    const jsonsInDir = fs.readdirSync(inputFolderAI).filter(file => path.extname(file) === '.json');

    await fse.ensureDir(outputFolder);

    jsonsInDir.forEach(async file => {
      const jsonAnnotatedByAI = await fse.readJSON(`${inputFolderAI}/${file}`);
      let jsonAnnotatedByHuman;
      try {
        jsonAnnotatedByHuman = await fse.readJSON(`${inputFolderHuman}/${file}`);
      } catch (error) {
        console.log(`${file} is missing from a human annotation`);
      }
      if (!jsonAnnotatedByHuman) return;
      let utteranceIndex = 0;
      if (jsonAnnotatedByAI.transcript.length === jsonAnnotatedByHuman.transcript.length) {
        for (const AIUtterance of jsonAnnotatedByAI.transcript) {
          const humanUtterance = jsonAnnotatedByHuman.transcript[utteranceIndex];

          if (humanUtterance.annotations && humanUtterance.annotations.length > 0) {
            AIUtterance.annotations = [...AIUtterance.annotations, ...humanUtterance.annotations];
          }

          utteranceIndex++;
        }
      }
      await fse.writeJSON(`${outputFolder}/${file}`, jsonAnnotatedByAI);
    });

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
