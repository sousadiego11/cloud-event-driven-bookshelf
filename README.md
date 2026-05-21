## Cloud Event-driven Bookshelf

Serverless backend for a virtual bookshelf using an event-driven architecture.

Current simplified flow:

- `POST /books` registers a book.
- The register book use case persists the book in DynamoDB.
- The use case publishes `BookRegistered` to EventBridge.
- EventBridge routes the event to SQS.
- The SQS listener notifies the library by logging the new registered book.

---

## Infrastructure

- AWS API Gateway
- AWS Lambda
- Amazon EventBridge
- Amazon SQS
- Amazon DynamoDB
- Terraform
- AWS SAM for local testing

## Local Commands

```bash
bun run build:lambdas
bun run start:gateway
bun run invoke:notify
```

## Current Domain

- `Book`

Main files:

- `src/domain/Book/Book.ts`
- `src/application/Book/Usecase/RegisterBookUsecase.ts`
- `src/presentation/aws-apigateway/register_book.ts`
- `src/presentation/aws-sqs/notify_library_book_registered.ts`
