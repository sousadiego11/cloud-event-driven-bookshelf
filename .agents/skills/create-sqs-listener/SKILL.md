---
name: create-sqs-listener
description: Create or update SQS queue listeners in this virtual bookshelf repository following the existing project pattern. Use when Codex needs to add a new SQS consumer, wire a new queue to a Lambda, create or update the related use case and DynamoDB repository, adjust Terraform in aws_sqs.tf/aws_lambdas.tf/aws_dynamodb.tf/aws_eventbridge.tf, or keep Events.ts as the source of truth for event and queue names. Always confirm whether the DTO or its validation schema should change before editing DTO-related files.
---

# Create SQS Listener

Use the repository pattern already established by `notify_library_book_registered`.

Read `references/project-patterns.md` before editing when the request involves a new queue, a new Lambda consumer, or Terraform wiring.

## Required confirmation

Before changing any DTO, schema, or payload contract, explicitly confirm whether the user wants to modify it.

Ask a short direct question such as:

`Vou reutilizar o DTO/schema atual ou você quer alterar o contrato da mensagem?`

Treat these as DTO-contract files:

- `src/application/**/dtos/*.ts`
- any Zod schema used to parse the message body, including schemas currently declared in handlers
- `src/application/Event/Events.ts` mappings when the payload type changes

If the user does not ask for a DTO change, preserve the existing contract and only wire the new listener around it.

## Workflow

1. Inspect `src/application/Event/Events.ts`.
2. Confirm whether the listener consumes an existing event/DTO or requires a new contract.
3. Identify the domain use case that should orchestrate the message handling.
4. Identify whether a DynamoDB table/repository already exists or whether a new one is required.
5. Implement the application and infrastructure files.
6. Wire the queue, EventBridge target, Lambda, IAM permissions, and event source mapping in Terraform.
7. Verify names stay consistent across `Events.ts`, Lambda handler path, queue name, and Terraform resources.

## Implementation rules

- Keep `src/application/Event/Events.ts` as the source of truth for queue names and event names.
- Follow the current separation:
  - `Usecase` orchestrates the domain action.
  - repository class handles DynamoDB access.
  - `src/presentation/aws-sqs/*.ts` parses the SQS record, instantiates dependencies, handles expected errors, and logs.
- Reuse `parseSqsRecord` for EventBridge-style envelopes delivered through SQS.
- Prefer existing DTOs and schemas when compatible.
- If a new schema is needed, place it where the repository already keeps related validation logic, or extract it to a reusable module if the same schema is consumed by more than one handler.
- Keep DTO property names aligned with the project contract style. For repository-facing/domain DTOs in this codebase, prefer PascalCase keys such as `Id`, `Title`, `Author`, `RegisteredAt`.
- When rebuilding an aggregate from persistence, prefer a single factory such as `create(...)` that already accepts the persisted fields the aggregate needs. Do not introduce a separate `restore(...)` unless the user explicitly asks for it.
- When a use case needs a domain-specific failure branch, create a custom domain error class in `src/domain/Error/errors.ts` instead of throwing `DomainError` directly from the use case.
- Keep naming aligned with the existing convention:
  - queue name in kebab-case in `Events.Queues`
  - Lambda handler file in `src/presentation/aws-sqs/`
  - Terraform resource names in snake_case
  - use case class name in PascalCase ending with `Usecase`
  - Dynamo repository class name in PascalCase starting with `Dynamo`

## Files to touch

Usually update a subset of these files:

- `src/application/Event/Events.ts`
- `src/application/<Domain>/Usecase/*.ts`
- `src/application/<Domain>/repositories/*.ts`
- `src/infrastructure/aws-dynamodb-repositories/*.ts`
- `src/presentation/aws-sqs/*.ts`
- `terraform/aws_sqs.tf`
- `terraform/aws_eventbridge.tf`
- `terraform/aws_lambdas.tf`
- `terraform/aws_dynamodb.tf`

Also inspect related shared utilities before introducing new ones.

## Terraform checklist

- Create or update the SQS queue in `terraform/aws_sqs.tf`.
- Reuse the shared SQS policy document for EventBridge producers instead of creating a dedicated policy document per queue, unless the access pattern is actually different.
- Create or update the EventBridge rule and target in `terraform/aws_eventbridge.tf` when the event is not yet mapped to the queue.
- Add the Lambda function in `terraform/aws_lambdas.tf`.
- Add or extend the Lambda IAM policy for DynamoDB tables and SQS queue ARNs.
- Add the `aws_lambda_event_source_mapping`.
- If persistence requires a new table or index, update `terraform/aws_dynamodb.tf`.
- Follow the existing DynamoDB GSI style: declare `attribute` blocks and use `key_schema` inside `global_secondary_index` instead of relying on shorter one-off forms.

## Handler checklist

- Parse each SQS record with the correct schema.
- Instantiate the repository with `dynamodbDocumentClient`.
- Instantiate the use case and call `handle`.
- Log success with identifiers useful for tracing.
- Swallow only domain errors that are intentionally idempotent.
- Re-throw unexpected errors so the message can be retried.

## Usecase checklist

- Keep orchestration in the use case and persistence in the repository.
- Rebuild aggregates from persisted DTOs using the repository result and the aggregate factory method.
- Introduce a custom error class when a missing entity or business failure needs a named domain error.
- Return DTOs in the repository/domain contract style already used by the surrounding module.

## Done criteria

Consider the work complete only when all naming and wiring are consistent across:

- `Events.ts`
- DTO/schema usage
- Lambda handler implementation
- DynamoDB repository/table usage
- `aws_sqs.tf`
- `aws_eventbridge.tf`
- `aws_lambdas.tf`
- `aws_dynamodb.tf`
