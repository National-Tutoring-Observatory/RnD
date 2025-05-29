import fs from 'fs';
import fse from 'fs-extra';
import readline from 'readline';
import path from 'path';
import get from 'lodash/get.js';

export const handler = async (event) => {
  try {
    const { body } = event;
    const { contentType, inputFile, outputFolder, outputFileKey, sessionLimit } = body;

    if (!await fs.existsSync(inputFile)) throw { message: 'This input file does not exist' };

    if (contentType === 'JSONL') {
      return new Promise(async (resolve, reject) => {

        const fileStream = fs.createReadStream(inputFile, { encoding: 'utf-8' });
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity // To handle all instances of CR LF ('\r\n') as a single line break.
        });

        rl.on('close', () => {
          console.log('Finished processing the JSONL file.');
        });

        rl.on('error', (err) => {
          console.error('An error occurred while reading the file:', err);
          reject();
        });

        let lineNumber = 0;

        for await (const line of rl) {
          lineNumber++;
          if (lineNumber > sessionLimit) continue;
          const trimmedLine = line.trim();
          if (trimmedLine === '') continue;// Skip empty lines

          try {
            const jsonObject = JSON.parse(trimmedLine);
            const outputFileName = get(jsonObject, outputFileKey, `record_${lineNumber}`)
            const outputFilePath = path.join(outputFolder, `${outputFileName}.json`);

            await fse.outputJSON(outputFilePath, JSON.stringify(jsonObject));

          } catch (parseError) {
            console.error(`Skipping line ${lineNumber} due to JSON parsing error:`, parseError.message);
          }
        }

        resolve();

      });
    }

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
