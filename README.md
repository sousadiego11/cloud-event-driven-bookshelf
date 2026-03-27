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

## 🔹 Event: Reservation Created `v1`
Triggered when a user creates a reservation via the API Gateway.

The **entry Lambda** receives the HTTP request (`POST /reservations`) from the client and publishes the `reservation.created.v1` event to an SNS topic.  
This topic fans out messages to multiple SQS queues, each executing a real asynchronous effect.

| Action          | SQS Queue                              | Description                                         |
|-----------------|----------------------------------------|-----------------------------------------------------|
| NotifyStaff     | `reservation.created.v1.notify_staff`  | Notify staff or provider about the new reservation. |


## 🔹 Event: Reservation Confirmed `v1`
Triggered when a reservation is confirmed by the user or system **using the API Gateway**.

The client sends an HTTP request (`POST /reservations/{id}/confirm`) and publishes the `reservation.confirmed.v1` event to an SNS topic.

| Action          | SQS Queue                                | Description                                                |
|-----------------|------------------------------------------|------------------------------------------------------------|
| NotifyStaff     | `reservation.confirmed.v1.notify_staff`  | Inform staff/provider that the reservation is confirmed.   |
| NotifyUser      | `reservation.confirmed.v1.notify_user`   | Inform the user that the reservation is confirmed.         |


## 🔹 Event: Reservation Canceled `v1`
Triggered when a reservation is canceled by the user or system **using the API Gateway**.

The client sends an HTTP request (`POST /reservations/{id}/cancel`) and publishes the `reservation.canceled.v1` event to an SNS topic.

| Action          | SQS Queue                               | Description                                             |
|-----------------|-----------------------------------------|---------------------------------------------------------|
| NotifyStaff     | `reservation.canceled.v1.notify_staff`  | Inform staff/provider about the cancellation.           |
| NotifyUser      | `reservation.canceled.v1.notify_user`   | Inform the user about the cancellation.                 |

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