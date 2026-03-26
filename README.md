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

## 🧩 Architecture Overview

![Architecture Diagram](https://mermaid.ink/img/pako:eNq9VV1v2jAU_SuRnyEODp95mJp1XYVEV9pUm7RlDya5gKfYjhwHxoD_PidZC1EqwdQxP9nWuefa595jb1EkY0AemidyHS2p0tbkMRShsMzI8tlC0XRp3asYVPYtRNXE-mjAIfpeoYoRMwWRZlKU0c-7fudqazG-8KwQLbVOMw_jKBb2jyyGhK2ULUBjkXK8BCVZJEV2RWzH7gwx6WKZ64QJwHkGys5WixBZ-yPq6e0r5AWHzSJIqYDEZhL7XwJsYrGfpu2x0GCuU5wS-9Nx-5ZqWNNNk3vi_w31teRprgFPKJ_FtMl28_npLSe9WYHQ7xWLF9DkDh6Ct3AHjKcJtB9yyKEdgFqZoEOS4zpa7fY7aze9D54sLMse2JUlqBekQl0rMMqWnVJpsisUrclbAUtIhY53pU511ZqoKd1wI8euvPgp8FgU0km1OQ_-SWo2Z1GpzHkRvqDJRrMoO4aDiBv2eYQVg3Xhnz-zsw1ELmkgcjkDkX9rIHJBA5H_YSBybCBVNUHpIFKvSAUL8hlnuuqVg4VITeAKWWGOPUTqwr0CuzMPvjq0-emAhjNOh9StQV6sgVpoYUqBPK1yaCEOitNiibYFJER6CRxCVBQjhjnNEx2iUOxNmKnFVyn5c6SS-WKJvDlNMrPK09hk_cCoKQx_2VUmoTGrzIVGnut0BiUL8rboJ_I6w449IqQ36jlu3x0Mhy20MbtOzyZ9Z0i6brfXI12nv2-hX2Vexx4QMhi5I7c_IKOu2yEtBDEzD8xd9YOWH-n-N686TM0?type=png)

---

## 🔹 Event: Order Created  
Triggered when a new order is created by a client via the API Gateway.

The **entry Lambda** receives the HTTP request (`POST /orders`) from the client, creates the order, and publishes the `order.created` event to an SNS topic. This topic fans out messages to multiple SQS queues, each consumed by an independent service responsible for a specific domain.

| Action            | SQS Queue                  | Description                          |
|------------------|----------------------------|--------------------------------------|
| ProcessPayment   | order.created.payment      | Charge customer and update status    |
| ReserveStock     | order.created.inventory    | Validate and reserve items           |
| NotifyCustomer   | order.created.notification | Send order confirmation              |
| TrackOrder       | order.created.analytics    | Store metrics and tracking data      |

---

## 🔹 Event: Review Created
Triggered when a client submits a product review via API Gateway.

The entry Lambda receives the HTTP request (`POST /reviews`) from the client, stores the review, and publishes the `review.created` event to an SNS topic. The topic fans out messages to multiple SQS queues for downstream services.

| Action            | SQS Queue                 | Description                          |
|------------------|---------------------------|--------------------------------------|
| ModerateReview    | review.created.moderation | Check for inappropriate content      |
| NotifySeller      | review.created.notification | Notify product seller of new review |
| TrackAnalytics    | review.created.analytics  | Store review metrics and trends      |

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