# RnD

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.

## Setup

### Prerequisites

- Install node.js

- Install Python

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
```