import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const lambdaHandler = async (event) => {
  try {
    const { body } = event;
    const { inputFile, outputFolder } = body;

    console.log(process.env);

    if (!await fs.existsSync(inputFile)) throw { message: 'This input file does not exist' };

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
