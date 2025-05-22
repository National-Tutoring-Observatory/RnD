import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fse from 'fs-extra';
import OpenAI from "openai";
import find from 'lodash/find.js';
import annotationSchema from "./annotationSchema.json" with { type: "json" };
import prompts from "./prompts.json" with {type: "json"};
import LLM from '../../shared/llm/llm.js';

export const lambdaHandler = async (event) => {
  try {
    const { body } = event;
    const { inputFile, outputFolder, promptId } = body;

    if (!await fs.existsSync(inputFile)) throw { message: 'This input file does not exist' };

    const data = await fse.readFile(inputFile, { encoding: 'utf8' });

    const inputFileSplit = inputFile.split('/');
    const outputFileName = inputFileSplit[inputFileSplit.length - 1].replace('.json', '');

    const prompt = find(prompts, { _id: promptId });
    const originalJSON = JSON.parse(data);

    const llm = new LLM({ provider: 'OPEN_AI' })

    llm.addSystemMessage(`You are an expert analyst of conversations between a teacher and student/s. You will be given a conversation where you will need to fill out the following JSON: 
          Schema: ${JSON.stringify(annotationSchema)}

          - The "score" is how well you think you have identified the certain moment in the conversation. 0 being the lowest with 1 being the highest.
          - The "reasoning" is why you chose this moment to highlight.
          - The "_id" is the _id found in the original "conversation" JSON. This needs to be tracked.
          - Make sure you only highlight the moment described by the user in their "prompt".
          - You are not limited to one annotation.
          - Only return the annotations array.`);

    llm.addUserMessage(`
          # teacherMove: ${prompt.teacherMove}
          # prompt: ${prompt.prompt}
          # conversation: ${data}
          `)

    const response = await llm.createChat();

    const annotations = response.annotations;

    for (const annotation of annotations) {
      const currentUtterance = find(originalJSON.transcript, { _id: annotation._id });
      currentUtterance.annotations = [...currentUtterance.annotations, annotation];
    }


    fse.outputJSON(`${outputFolder}/${outputFileName}.json`, originalJSON, (error) => {
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
