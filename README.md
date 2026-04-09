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

## 🔹 Event: Order Created `v1`
Triggered when a user creates an order via the API Gateway.

The **entry Lambda** receives the HTTP request (`POST /orders`) from the client and publishes the `order.created.v1` event to an SNS topic.  
This topic fans out messages to multiple SQS queues, each executing a real asynchronous effect.

| Action            | SQS Queue                              | Description                                         |
|------------------|----------------------------------------|-----------------------------------------------------|
| ReserveInventory  | `order.created.v1.reserve_inventory`   | Reserve products in stock for this order.          |
| NotifyUser        | `order.created.v1.notify_user`         | Notify the user that the order was created.        |
| NotifyWarehouse   | `order.created.v1.notify_warehouse`    | Inform the warehouse about the new order.          |

---

## 🔹 Event: Order Paid `v1`
Triggered when an order payment is confirmed via the API Gateway.

The client sends an HTTP request (`POST /orders/{id}/pay`) and publishes the `order.paid.v1` event to an SNS topic.

| Action            | SQS Queue                            | Description                                           |
|------------------|--------------------------------------|-------------------------------------------------------|
| CapturePayment    | `order.paid.v1.capture_payment`      | Process and confirm the payment.                     |
| ConfirmShipment   | `order.paid.v1.confirm_shipment`     | Prepare the order for shipment.                      |
| NotifyUser        | `order.paid.v1.notify_user`          | Inform the user that the payment was confirmed.     |

---

## 🔹 Event: Order Canceled `v1`
Triggered when an order is canceled by the user or system via the API Gateway.

The client sends an HTTP request (`POST /orders/{id}/cancel`) and publishes the `order.canceled.v1` event to an SNS topic.

| Action            | SQS Queue                             | Description                                           |
|------------------|---------------------------------------|-------------------------------------------------------|
| ReleaseInventory  | `order.canceled.v1.release_inventory` | Release reserved products back to stock.            |
| RefundPayment     | `order.canceled.v1.refund_payment`    | Refund payment if it was already processed.         |
| NotifyUser        | `order.canceled.v1.notify_user`       | Inform the user about the order cancellation.       |
| NotifyWarehouse   | `order.canceled.v1.notify_warehouse`  | Inform the warehouse that the order was canceled.   |

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