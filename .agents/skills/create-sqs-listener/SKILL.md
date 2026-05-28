---
name: create-sqs-listener
description: Create or update SQS queue listener transport in this virtual bookshelf repository. Use when Codex needs to add or modify an SQS consumer handler under src/presentation/aws-sqs, queue definitions, EventBridge rule/target wiring, Lambda function and event source mapping, SQS IAM permissions, SQS queue policy, or Events.ts queue/event mappings. Do not create domain models, use cases, repositories, DynamoDB tables, or DynamoDB table IAM permissions here; use create-domain-boilerplate first when new domain persistence is required. Always confirm whether the DTO or validation schema should change before editing DTO-related files.
---

# Create SQS Listener

Use this skill when creating or modifying SQS listener transport in this repository.

Read `references/project-patterns.md` before editing when the request involves a new queue, a new Lambda consumer, EventBridge-to-SQS wiring, or Terraform listener wiring.

## Responsibility Boundary

- Own SQS handler files, queue definitions, EventBridge rule/target wiring, Lambda function resources, event source mappings, SQS IAM permissions, queue policies, and event/queue mappings.
- Wire listeners to existing application use cases and existing infrastructure dependencies.
- Do not create or modify domain entities, application use cases, repository interfaces, DynamoDB repository implementations, DynamoDB tables, or DynamoDB table IAM permissions.
- If the listener needs domain/application/persistence that does not exist, use `$create-domain-boilerplate` first.
- Keep business rules inside domain/application, not in the SQS handler.

## Required Confirmation

Before changing any DTO, schema, or payload contract, explicitly confirm whether the user wants to modify it.

Ask a short direct question such as:

`Vou reutilizar o DTO/schema atual ou voce quer alterar o contrato da mensagem?`

Treat these as DTO-contract files:

- `src/application/**/dtos/*.ts`
- any Zod schema used to parse the message body, including schemas currently declared in handlers
- `src/application/Event/Events.ts` mappings when the payload type changes

If the user does not ask for a DTO change, preserve the existing contract and only wire the new listener around it.

## Workflow

1. Inspect `src/application/Event/Events.ts`.
2. Confirm whether the listener consumes an existing event/DTO or requires a contract change.
3. Verify the target domain use case, repository interfaces, repository implementations, and DynamoDB tables already exist.
4. If any domain persistence is missing, stop listener work and use `$create-domain-boilerplate` first.
5. Create or update the handler in `src/presentation/aws-sqs/`.
6. Wire the queue, EventBridge target, Lambda, SQS IAM permissions, queue policy, and event source mapping in Terraform.
7. Verify names stay consistent across `Events.ts`, Lambda handler path, queue name, and Terraform resources.

## Implementation Rules

- Keep `src/application/Event/Events.ts` as the source of truth for queue names and event names.
- Follow the current separation:
  - existing `Usecase` orchestrates the domain action
  - existing repository class handles DynamoDB access
  - `src/presentation/aws-sqs/*.ts` parses the SQS record, instantiates dependencies, handles expected errors, and logs
- Reuse `parseSqsRecord` for EventBridge-style envelopes delivered through SQS.
- Prefer existing DTOs and schemas when compatible.
- If a new schema is needed, place it where related validation already lives, or extract it to a reusable module if more than one handler consumes it.
- Keep DTO property names aligned with the project contract style.
- Keep naming aligned with the existing convention:
  - queue name in kebab-case in `Events.Queues`
  - Lambda handler file in `src/presentation/aws-sqs/`
  - Terraform resource names in snake_case
  - Lambda function name in kebab-case

## Files to Touch

Usually update a subset of these files:

- `src/application/Event/Events.ts`
- `src/presentation/aws-sqs/*.ts`
- `terraform/aws_sqs.tf`
- `terraform/aws_eventbridge.tf`
- `terraform/aws_lambdas.tf`

Do not update these for SQS listener transport work:

- `src/domain/**`
- `src/application/<Domain>/Usecase/**`
- `src/application/<Domain>/repositories/**`
- `src/infrastructure/aws-dynamodb-repositories/**`
- `terraform/aws_dynamodb.tf`
- DynamoDB table ARNs in `terraform/aws_lambdas.tf`

Use `$create-domain-boilerplate` first if those changes are required.

## Terraform Checklist

- Create or update the SQS queue in `terraform/aws_sqs.tf`.
- Reuse the shared SQS policy document for EventBridge producers instead of creating a dedicated policy document per queue, unless the access pattern is actually different.
- Create or update the EventBridge rule and target in `terraform/aws_eventbridge.tf` when the event is not yet mapped to the queue.
- Add the Lambda function in `terraform/aws_lambdas.tf`.
- Add or extend the Lambda IAM policy for SQS queue ARNs.
- Do not add DynamoDB table permissions from this skill.
- Add the `aws_lambda_event_source_mapping`.

## Handler Checklist

- Parse each SQS record with the correct schema.
- Instantiate existing dependencies with `dynamodbDocumentClient` when the existing use case needs repositories.
- Instantiate the existing use case and call `handle`.
- Log success with identifiers useful for tracing.
- Swallow only domain errors that are intentionally idempotent.
- Re-throw unexpected errors so the message can be retried.

## Done Criteria

Consider the work complete only when all listener transport naming and wiring are consistent across:

- `Events.ts`
- DTO/schema usage
- Lambda handler implementation
- `aws_sqs.tf`
- `aws_eventbridge.tf`
- `aws_lambdas.tf`
