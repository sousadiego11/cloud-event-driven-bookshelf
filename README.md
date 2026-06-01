# 🚀 Cloud Event-Driven Bookshelf

## 🛠️ Technologies & Tools
[![My Skills](https://skillicons.dev/icons?i=aws,terraform,docker,typescript,dynamodb,githubactions,nodejs,bun,github&theme=dark&perline=15)](https://skillicons.dev)

## ☁️ AWS Services
<div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
<img src="https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg" width="50" alt="AWS API Gateway"/>
<img src="https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg" width="50" alt="AWS Lambda"/>
<img src="https://icon.icepanel.io/AWS/svg/App-Integration/EventBridge.svg" width="50" alt="AWS EventBridge"/>
<img src="https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg" width="50" alt="AWS SQS"/>
<img src="https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg" width="50" alt="AWS DynamoDB"/>
<img src="https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg" width="50" alt="AWS Lambda"/>
<img src="https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Identity-and-Access-Management.svg" width="50" alt="AWS IAM"/>
</div>

---

Backend for a portfolio-ready virtual bookshelf built around an **event-driven serverless architecture**.

The system exposes a small but complete library workflow:

- `POST /books` registers a new book
- `POST /loans` creates a loan when inventory is available
- `POST /loans/return` returns a borrowed book

Each command runs through a clean flow:

1. API Gateway receives the request
2. Lambda validates input and calls the use case
3. The use case persists data in DynamoDB
4. Domain events are published to EventBridge
5. EventBridge routes events to SQS queues
6. SQS listeners handle notifications and follow-up processing

This project is designed to show:

- Event-driven architecture in AWS
- Clean separation between domain, application, infrastructure, and transport
- Type-safe backend development with TypeScript
- Infrastructure as Code with Terraform
- Local testing with AWS SAM

---

## ✨ Main Features

- Book registration with DynamoDB persistence
- Loan registration with inventory validation
- Loan return flow with event publication
- EventBridge-based asynchronous messaging
- SQS consumers for notification and demand-analysis workflows
- Serverless transport layer using API Gateway and Lambda
- Terraform-managed infrastructure
- SAM local execution for API testing

---

## 🧩 Architecture

### HTTP Routes

- `POST /books`
- `POST /loans`
- `POST /loans/return`

### Event Flow

- `BookRegistered` from `bookshelf.books`
- `LoanRegistered` from `bookshelf.loans`
- `LoanReturned` from `bookshelf.loans`

### Queues

- `bookshelf-notify-library-book-registered`
- `bookshelf-notify-library-loan-registered`
- `bookshelf-notify-library-loan-returned`
- `bookshelf-analyze-demand-loan-registered`

---

## ▶️ Run Locally

> ⚠️ This project uses real AWS-oriented infrastructure. Make sure you have the proper credentials and permissions before running Terraform.

### 1. Install dependencies

```bash
bun install
```

### 2. Configure AWS credentials

Set your AWS credentials in environment variables:

```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=your_region
```

### 3. Provision infrastructure

Use Terraform to create or update the required resources:

```bash
terraform init
terraform plan
terraform apply
```

### 4. Build Lambda bundles

```bash
bun run build:lambdas
```

### 5. Start local API Gateway

```bash
bun run start:gateway
```

### 6. Invoke the SQS notifications locally

```bash
bun run invoke:sqs:book-registered
bun run invoke:sqs:loan-registered
bun run invoke:sqs:loan-returned
bun run invoke:sqs:analyze-demand
```

---

## 🧪 Sample Requests

You can use [`src/presentation/aws-apigateway/samples.http`](src/presentation/aws-apigateway/samples.http) to test the main routes.

### Register Book

```http
POST http://127.0.0.1:3000/books
Content-Type: application/json

{
  "Title": "Clean Architecture",
  "Author": "Robert C. Martin",
  "Isbn": "9780134494166",
  "Stock": 3
}
```

### Register Loan

```http
POST http://127.0.0.1:3000/loans
Content-Type: application/json

{
  "BookId": "f5b0da38-59b8-4c1a-b90d-f2be36797620",
  "Cpf": "05079313943"
}
```

### Return Loan

```http
POST http://127.0.0.1:3000/loans/return
Content-Type: application/json

{
  "BookId": "f5b0da38-59b8-4c1a-b90d-f2be36797620",
  "Cpf": "05079313943"
}
```

---

## 📁 Project Structure

- `src/domain/` - core business objects and domain errors
- `src/application/` - use cases, DTOs, repositories, and event definitions
- `src/infrastructure/` - AWS implementations for DynamoDB and EventBridge
- `src/presentation/` - API Gateway and SQS Lambda handlers
- `terraform/` - infrastructure as code
- `sam/` - local SAM template for testing

---

## 📌 Notes

- Project name in code: `cloud-event-driven-bookshelf`
- Main stack: TypeScript, AWS Lambda, API Gateway, EventBridge, SQS, DynamoDB, Terraform, AWS SAM
- This repository is intended as a portfolio piece focused on backend architecture, cloud integration, and event-driven design
