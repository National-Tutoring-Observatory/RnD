import json

from app import lambda_handler

def run_local():
    try:

        result = lambda_handler({}, {})
        print(json.dumps(result, indent=2))
    except Exception as e:
        import traceback
        traceback.print_exc()

# Execute the local invocation
if __name__ == "__main__":
    run_local()