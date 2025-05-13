import json

def lambda_handler(event, context):
    
    print("Python function invoked!")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello world from python"
        }),
    }