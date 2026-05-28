# AI Repo Context

## Purpose
- Fast reference for AI agents working in this repository.
- Reduce token usage by centralizing project conventions and current boundaries.
- Read this before broad code changes or when deciding which skill applies.

## Project Summary
- Event-driven virtual bookshelf backend.
- Project name: `cloud-event-driven-bookshelf`.
- Main stack: TypeScript, AWS Lambda, API Gateway, SQS, EventBridge, DynamoDB, Terraform.
- Source code lives in `src/`.
- Infra code lives in `terraform/`.

## Current Flow
- API Gateway receives `POST /books` and `POST /loans`.
- `register_book` creates a book and initializes inventory.
- `register_loan` validates inventory availability before creating a loan.
- `register_book` publishes `BookRegistered` to EventBridge.
- EventBridge routes `BookRegistered` to SQS.
- SQS listener handles the book registration notification flow.

## Current Structure
- `src/domain/`
  - Core business objects and domain errors.
- `src/application/`
  - Use cases, DTOs, repository interfaces, shared app utilities, event definitions.
- `src/infrastructure/`
  - AWS/EventBridge/DynamoDB implementations.
- `src/presentation/`
  - Lambda handlers for API Gateway and SQS.
- `.agents/skills/`
  - Local Codex skills documenting repo-specific workflows and boundaries.

## Local Skills
- For new or normalized domain/application/persistence work, consult:
  - `.agents/skills/create-domain-boilerplate/SKILL.md`
- For new API Gateway routes, consult:
  - `.agents/skills/create-apigateway-route/SKILL.md`
- For new SQS consumers, consult:
  - `.agents/skills/create-sqs-listener/SKILL.md`

## Skill Boundaries
- `create-domain-boilerplate`
  - Owns domain, application, repository interface, DynamoDB repository implementation, DynamoDB table, GSIs, and the table ARN entry in the Lambda IAM policy.
  - If a new domain persistence layer is needed, use this skill first.
- `create-apigateway-route`
  - Owns HTTP transport: handler, request/response schema, Lambda resource, API Gateway method/integration, invoke permission, deployment trigger, SAM route, and samples.
  - Do not create domain models, use cases, repositories, or DynamoDB tables here.
- `create-sqs-listener`
  - Owns SQS transport: handler, queue, EventBridge target/rule, Lambda resource, event source mapping, queue policy, and queue IAM wiring.
  - Do not create domain models, use cases, repositories, or DynamoDB tables here.

## Current Practical Structure Snapshot
- `src/domain/`
  - `Book/Book.ts`
  - `Inventory/Inventory.ts`
  - `Loan/Loan.ts`
  - `Loan/Cpf.ts`
  - `Error/errors.ts`
- `src/application/`
  - `Book/dtos/BookDto.ts`
  - `Book/repositories/IBookRepository.ts`
  - `Book/repositories/index.ts`
  - `Book/Usecase/RegisterBookUsecase.ts`
  - `Inventory/dtos/InventoryDto.ts`
  - `Inventory/repositories/IInventoryRepository.ts`
  - `Inventory/repositories/index.ts`
  - `Loan/dtos/LoanDto.ts`
  - `Loan/repositories/ILoanRepository.ts`
  - `Loan/repositories/index.ts`
  - `Loan/Usecase/RegisterLoanUsecase.ts`
  - `Event/EventPublisher.ts`
  - `Event/Events.ts`
  - `Shared/Id.ts`
  - `Shared/Usecase.ts`
- `src/infrastructure/`
  - `aws-dynamodb-client/dynamodb-client.ts`
  - `aws-dynamodb-repositories/dynamodb-books-repository.ts`
  - `aws-dynamodb-repositories/dynamodb-inventory-repository.ts`
  - `aws-dynamodb-repositories/dynamodb-loans-repository.ts`
  - `aws-eventbridge/eventbridge-publisher.ts`
  - `http/ApiResponse.ts`
- `src/presentation/`
  - `aws-apigateway/register_book.ts`
  - `aws-apigateway/register_loan.ts`
  - `aws-sqs/notify_library_book_registered.ts`
  - `zod/BookSchemas.ts`
  - `zod/LoanSchemas.ts`

## Important Conventions
- Domain file path pattern:
  - `src/domain/<Domain>/<Domain>.ts`
- Application file path pattern:
  - `src/application/<Domain>/`
- Repository interfaces:
  - `src/application/<Domain>/repositories/I<Domain>Repository.ts`
- Repository barrel:
  - `src/application/<Domain>/repositories/index.ts`
- Use case folder name:
  - `Usecase`
- Domain DTOs live outside `src/domain`.
- DTO property names must be PascalCase.
- Domain internal properties must be private by default.
- Prefer ECMAScript private fields such as `#id`, `#title`, `#registeredAt`.
- If outside code needs a domain value, expose a getter instead of making the field public.
- Domain-local type aliases must live inside `export namespace <Domain>Domain`.
- `toDto()` maps domain names to DTO keys explicitly.

## Current Event and Queue Notes
- `src/application/Event/Events.ts` is the source of truth.
- Current event source:
  - `bookshelf.books`
- Current event names:
  - `BookRegistered`
  - `LoanRegistered`
- Current queue:
  - `bookshelf-notify-library-book-registered`
- Event and queue naming must stay aligned across:
  - `src/application/Event/Events.ts`
  - handlers in `src/presentation/aws-sqs/`
  - Terraform resources

## Terraform Attention Points
- DynamoDB table names currently used by the app:
  - `bookshelf-books`
  - `bookshelf-loans`
  - `bookshelf-inventory`
- In `terraform/aws_lambdas.tf`, the shared DynamoDB policy should list only table ARNs in `resources`, for example:

```hcl
resources = [
  aws_dynamodb_table.books.arn,
  aws_dynamodb_table.loans.arn,
  aws_dynamodb_table.inventory.arn
]
```

- Follow existing Terraform style for DynamoDB GSIs:
  - explicit `attribute` blocks
  - `key_schema` inside `global_secondary_index`

## Before Editing a Module
- Check whether a DTO already exists and where it belongs.
- Check whether the module uses a repository-local DTO or a shared DTO file.
- Check whether the domain already has a namespace for local types.
- Check whether any property name violates the no-underscore rule.
- Check whether `toDto()` returns PascalCase keys.
- Check whether the repository `index.ts` export matches current project style.
- Check whether the change belongs in domain/persistence, API Gateway transport, or SQS transport.

## Validation Notes
- `bun` and local `tsc` availability may vary by session.
- If a validation command fails because the tool is unavailable, inspect command availability before assuming the code is broken.

## Editing Safety
- Do not revert unrelated user changes.
- Expect dirty git state.
- If a file already changed outside your task, work with it carefully.

## Definition Of Done For Most Changes
- DTO location follows repo convention.
- DTO keys are PascalCase.
- Domain has no underscore-prefixed properties.
- Domain-local type aliases are inside `<Domain>Domain`.
- `toDto()` mapping is explicit and correct.
- Layer boundaries remain intact.
