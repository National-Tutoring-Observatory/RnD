# RnD

This projects contains Research & Development code snippets and functions for us to run code locally.

## Setup

### Prerequisites

- Install Node.js 22.x
```
https://nodejs.org/en/download
```

- Install Yarn
```
npm install --global yarn
```

### Install dependencies

Navigate to the root of the repo and run:

```
yarn
```

### Setup environment variables

Open the .env file in the root of the repo and include the following environment variables with their values:

```
OPEN_AI_KEY='Your Open AI API key'
AI_GATEWAY_KEY='Cornell AI Gateway API key'
AI_GATEWAY_BASE_URL='Cornell AI Gateway base url'
AI_GATEWAY_PROVIDER='Cornell AI Gateway LLM provider' // GEMINI or OPEN_AI
LLM_PROVIDER='Your chosen LLM provider' // 'OPEN_AI', 'AI_GATEWAY'
```

### Source data

This repo requires you to have data in the form of a transcript structure. Like a Teacher and Student conversation. Place this data in the `localData/input` folder. This folder has a .gitignore and will ignore all files placed in this folder.

If you have a JSONL file, you can place your data in the `localData/raw` folder and run the `splitDataToSessions` function.

### Data folders

We have predefined data folders for running your data through. These are listed below:

`raw` - Used for raw data before being converted into session data.

`input` - Used for input data. Currently we only support text files.

`preAnalysis` - Used for when the input data has been modified into our standard JSON format and analysis is ready to be run over the file.

`analysis` - Used for when you are running analysis over your files.

`output` - Used for when all the functions are run and data has finished being analysed. [We do not use this yet]


### Running a function

Running a function in this repo is as simple as calling `yarn {{functionName}}`. The current available functions can be found in the `functions` folder. These are loosely based upon Serverless Functions but for the purpose of running them locally they are missing most config files to run in the cloud for now.

Each function folder has an example `event.json` which is used to pass in the functions event arguments. You should copy this file within the folder, rename it `event.local.json` and then update it with the "Source data" details.

#### splitDataToSessions

This is a simple function to split large files that contain multiple sessions into individual files. Currently only JSONL files are supported.

```
yarn splitDataToSessions
```

#### convertSessionDataToJSON

This will take any text file and attempt to convert it into our JSON structure ready for further analysis. If the file is missing start and end times, we will try to add them.

```
yarn convertSessionDataToJSON
```

#### annotatePerUtterance

This will start an analysis of over your session data and fill out the annotations array per utterance.

```
yarn annotatePerUtterance
```

#### annotatePerSession

This will start an analysis of over your session data and fill out the annotations schema for the whole session. Use this to aggregate an annotation to the top level

```
yarn annotatePerSession
```

#### mergeHumanAndAISessionData

This will merge two sets of data from a human annotated session to an AI annotated session into one file. This runs across a whole folder rather than individual files.

```
yarn mergeHumanAndAISessionData
```

#### outputSessionDataToCSV

This will output a set of JSON files to CSV.

```
yarn outputSessionDataToCSV
```

### Running the pipeline

The pipeline is a way of running multiple functions in a single run. The pipeline can also use the `*` as a file input to select anything in that folder to help run functions across multiple files. Running the pipeline in this repo is as simple as calling `yarn pipeline`. The current available tasks can be found in the `functions` folder. 

The pipeline has an example `tasks.json` which is used to pass in the tasks and their function and event arguments. You should copy this file within the folder `shared/pipeline`, rename it `tasks.local.json` and then update it with the details found in the `event.json` files inside each function folder. 

When filling out the `inputFile` value with an `*` will go over every file found in that folder. This is useful if you want to run the pipeline over multiple files. For example, `"inputFile": "localData/preAnalysis/*"` will go over all the files in the `localData/preAnalysis folder` and run the function over each file it finds.

```
yarn pipeline
```

### Providers

Our LLM setup is flexible and you can add your own LLM providers easily. If you are using the Cornell AI Gateway then you need to adjust the `shared/llm/providers/aiGateway.js` and add your own `AI_GATEWAY_PROVIDERS` settings. Then in your .env, change the `AI_GATEWAY_PROVIDER` variable to be your new provider.

If you want to add another LLM that is not available, create a new provider file in the `shared/llm/providers` folder. We suggest copying the `openAI.js` file as an example.