export const lambdaHandler = async (event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello world from node.js',
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
};
