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
LLM_PROVIDER='Your chosen LLM provider' // 'OPEN_AI', 'AI_GATEWAY'
```

### Source data

This repo requires you to have data in the form of a transcript structure. Like a Teacher and Student conversation. Place this data in the `localData/input` folder. This folder has a .gitignore and will ignore all files placed in this folder.

If you have a JSONL file, you can place your data in the `localData/raw` folder and run the `splitDataToSessions` function.

### Data folders

We have predefined data folders for running your data through. These are listed below:

`raw` - Used for raw data before being converted into session data.
`input` - Used for input data. Currently we only support text files.
`analysis` - Used for when the input data has been modified into our standard JSON format and analysis is being run over the file.
`output` - Used for when all the functions are run and data has finished being analysed. [We do not use this yet]

### Running a function

Running a function in this repo is as simple as calling `yarn {{functionName}}`. The current available functions can be found in the `functions` folder. These are loosely based upon Serverless Functions but for the purpose of running them locally they are missing most config files to run in the cloud for now.

Each function folder has an `event.local.json` which is used to pass in the functions event arguments. You should update this file with the "Source data" details.

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

#### annotateSessionDataWithTeacherMoves

This will start an analysis of teacher moves over your data and fill out the annotations array with where we think a teacher move has occured.

```
yarn annotateSessionDataWithTeacherMoves
```



<!-- This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.

## Setup

### Prerequisites

- Install Node.js 22.x

- Install Python 3.12

### Setup AWS SAM CLI

```
brew tap aws/tap
``` 

```
brew install aws-sam-cli
```

Then test SAM CLI is installed

```
sam --version
```

## Build

To build all functions make sure Docker Desktop is open and run:
```
sam build --use-container
```

## Run

To run the individual functions use the following template:
```
sam local invoke {{FunctionName}} --event functions/{{functionDirectory}}/event.json
``` -->