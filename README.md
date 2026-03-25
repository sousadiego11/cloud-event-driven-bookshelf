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

## 🔹 Event: order.created  
Triggered when a new order is created.

The entry Lambda publishes the `order.created` event to an SNS topic, which fans out messages to multiple SQS queues. Each queue is consumed by an independent service responsible for a specific domain.

| Action            | SQS Queue                  | Description                          |
|------------------|----------------------------|--------------------------------------|
| ProcessPayment   | order.created.payment      | Charge customer and update status    |
| ReserveStock     | order.created.inventory    | Validate and reserve items           |
| NotifyCustomer   | order.created.notification | Send order confirmation              |
| TrackOrder       | order.created.analytics    | Store metrics and tracking data      |

---

## 🔹 Event: payment.completed  
Triggered when a payment is successfully processed.

After payment confirmation, a new event is published to SNS, triggering downstream processes via SQS queues.

| Action            | SQS Queue                     | Description                          |
|------------------|-------------------------------|--------------------------------------|
| GenerateInvoice  | payment.completed.billing     | Create and persist invoice           |
| NotifyCustomer   | payment.completed.notification| Notify payment approval              |
| TrackPayment     | payment.completed.analytics   | Update financial metrics             |

---

## 🔁 Flow
1. Client sends request → API Gateway
2. Lambda creates order → emits `order.created` event
3. EventBridge routes event to multiple SQS queues:
   - payment
   - inventory
   - notification
   - analytics
4. Consumers process messages asynchronously with **idempotency**
5. Payment service emits `payment.completed`
6. New event triggers billing, notification, and analytics with **DLQ** handling for failures

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
- https://docs.aws.amazon.com/dynamodb/latest/developerguide/Introduction.html  

### Observability (CloudWatch)
- https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html  