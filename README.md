## Cloud Event-driven e-commerce

Build a serverless backend that processes orders using an event-driven architecture.

This project demonstrates:

- Event-driven architecture
- Serverless design
- Asynchronous processing
- Decoupled systems
- Infrastructure as code
- **Idempotent message processing**
- **Dead Letter Queues (DLQ) for failed events**

---

## Infrastructure

- AWS (Serverless-first architecture)
- API Gateway (entry point)
- Lambda (compute)
- EventBridge (event bus)
- SQS (message queues with DLQ)
- DynamoDB (persistence)
- Terraform (Infrastructure as Code)

## 📚 References / Documentation

### AWS Lambda
- https://docs.aws.amazon.com/lambda/latest/dg/welcome.html  
- https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html  
- https://docs.aws.amazon.com/lambda/latest/dg/lambda-golang.html
- https://catalog.workshops.aws/complete-aws-sam/en-US/module-1-sam-setup

### Amazon API Gateway
- https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html  
- https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html  

### Amazon EventBridge
- https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html  
- https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html  
- https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-putevents.html  

### Amazon SQS (Simple Queue Service)
- https://docs.aws.amazon.com/sqs/latest/dg/welcome.html  
- https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html  
- https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html  

### AWS Step Functions (optional / orchestration)
- https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html  

### Amazon DynamoDB
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/#example-scenarios
- https://docs.aws.amazon.com/code-library/latest/ug/dynamodb_example_dynamodb_Scenario_GettingStartedMovies_section.html

### Observability (CloudWatch)
- https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html  

### AWS Cognito
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/#example-scenarios