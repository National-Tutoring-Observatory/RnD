import fs from 'fs';
import readline from 'readline';
import path from 'path';
import get from 'lodash/get.js';

export const lambdaHandler = async (event) => {
  try {
    const { body } = event;
    const { contentType, inputFile, outputFolder, outputFileKey, sessionLimit } = body;

    console.log(inputFile);

    if (!await fs.existsSync(inputFile)) throw { message: 'This input file does not exist' };

    if (contentType === 'JSONL') {
      const fileStream = fs.createReadStream(inputFile, { encoding: 'utf-8' });
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity // To handle all instances of CR LF ('\r\n') as a single line break.
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

          fs.writeFile(outputFilePath, JSON.stringify(jsonObject), 'utf-8', (err) => {
            if (err) {
              console.error(`Error writing file ${outputFilePath}:`, err);
            } else {
              console.log(`Successfully created ${outputFilePath}`);
            }
          });

        } catch (parseError) {
          console.error(`Skipping line ${lineNumber} due to JSON parsing error:`, parseError.message);
        }
      }

      rl.on('close', () => {
        console.log('Finished processing the JSONL file.');
      });

      rl.on('error', (err) => {
        console.error('An error occurred while reading the file:', err);
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
