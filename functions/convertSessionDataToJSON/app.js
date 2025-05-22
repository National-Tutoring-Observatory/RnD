import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fse from 'fs-extra';
import schema from "./schema.json" with { type: "json" };
import LLM from '../../shared/llm/llm.js';

export const lambdaHandler = async (event) => {
  try {
    const { body } = event;
    const { inputFile, outputFolder } = body;

    if (!await fs.existsSync(inputFile)) throw { message: 'This input file does not exist' };

    const data = await fse.readFile(inputFile, { encoding: 'utf8' });

    const inputFileSplit = inputFile.split('/');
    const outputFileName = inputFileSplit[inputFileSplit.length - 1].replace('.json', '').replace('.vtt', '');

    const llm = new LLM({ provider: 'OPEN_AI' })

    llm.addSystemMessage("You are an expert at reading unstructured data and putting it into a structure format. You will be given different types of data and will be expected to put it into the given JSON structure.");

    llm.addUserMessage(`
          Schema: ${JSON.stringify(schema)}
    
          Please look at the following and merge into the schema: ${data}`)

    const response = await llm.createChat();

    fse.outputJSON(`${outputFolder}/${outputFileName}.json`, response, (error) => {
      if (error) console.log(error);
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
