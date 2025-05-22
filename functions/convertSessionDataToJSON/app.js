import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fse from 'fs-extra';
import OpenAI from "openai";
import schema from "./schema.json" with { type: "json" };

export const lambdaHandler = async (event) => {
  try {
    const { body } = event;
    const { inputFile, outputFolder } = body;

    if (!await fs.existsSync(inputFile)) throw { message: 'This input file does not exist' };

    const data = await fse.readFile(inputFile, { encoding: 'utf8' });

    const inputFileSplit = inputFile.split('/');
    const outputFileName = inputFileSplit[inputFileSplit.length - 1].replace('.json', '').replace('.vtt', '');

    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "You are an expert at reading unstructured data and putting it into a structure format. You will be given different types of data and will be expected to put it into the given JSON structure.",
        },
        {
          role: "user",
          content: `
          Schema: ${JSON.stringify(schema)}
    
          Please look at the following and merge into the schema: ${data}`
        },
      ],
      response_format: { type: "json_object" }
    });

    fse.outputJSON(`${outputFolder}/${outputFileName}.json`, JSON.parse(chatCompletion.choices[0].message.content), (error) => {
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
