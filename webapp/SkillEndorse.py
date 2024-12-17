import json
import boto3
import uuid


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Endorsements')

def lambda_handler(event, context):
    if event['httpMethod'] == 'POST':

        body = json.loads(event['body'])
        endorsement_text = body.get('endorsement')
        
        if not endorsement_text:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Endorsement text is required'})
            }
        
        endorsement_id = str(uuid.uuid4())
        table.put_item(Item={
            'endorsementId': endorsement_id,
            'text': endorsement_text
        })
        
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'Endorsement saved', 'id': endorsement_id})
        }
    
    elif event['httpMethod'] == 'GET':

        response = table.scan()
        endorsements = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'body': json.dumps(endorsements)
        }

    return {
        'statusCode': 405,
        'body': json.dumps({'message': 'Method not allowed'})
    }
