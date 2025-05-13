import json

def lambda_handler(event, context):
    """
    A simple Python Lambda function.
    """
    print("Python function invoked!")
    print(f"Received event: {event}")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello world from your Python function!",
            "received_event": event # Echoing back the event
        }),
    }