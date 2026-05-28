---
name: create-apigateway-route
description: Create or update API Gateway HTTP route transport in this virtual bookshelf repository. Use when Codex needs to add or modify a Lambda handler under src/presentation/aws-apigateway, HTTP request/response Zod schema, dependency wiring to an existing application use case, Lambda Terraform resource, API Gateway resource/method/integration/invoke permission/deployment trigger entries, SAM local route, or samples.http example. Do not create domain models, use cases, repositories, DynamoDB tables, or DynamoDB IAM permissions here; use create-domain-boilerplate first when new domain persistence is required.
---

# Create API Gateway Route

Use this skill when creating or modifying an API Gateway route in this repository.

Read `references/project-patterns.md` before editing. It captures the current API Gateway transport pattern and Terraform wiring.

## Responsibility Boundary

- Own HTTP transport, handler parsing, response mapping, API Gateway Terraform, Lambda function resources, API Gateway invoke permissions, SAM route entries, and request examples.
- Wire handlers to existing application use cases and existing infrastructure dependencies.
- Do not create or modify domain entities, application use cases, repository interfaces, DynamoDB repository implementations, DynamoDB tables, or DynamoDB table IAM permissions.
- If the route needs domain/application/persistence that does not exist, use `$create-domain-boilerplate` first.
- Keep business rules inside domain/application, not in the handler.

## Core Rules

- Put API Gateway handlers in `src/presentation/aws-apigateway/*.ts`.
- Put Zod schemas in `src/presentation/zod/*.ts` and import them from handlers/listeners.
- Keep handlers thin:
  - import Zod schemas
  - parse input with `parseBody`
  - instantiate existing infrastructure dependencies
  - instantiate the existing application use case
  - return through `ApiResponse`
  - log expected steps and errors with `Logger`
- Use DTOs from `src/application/<Domain>/dtos/*.ts` when the route input/output is also an event or API contract.
- Use PascalCase request/DTO keys when the route follows repository/domain contract style.
- If the route publishes an event, keep `src/application/Event/Events.ts` aligned with the existing use case and downstream consumers.
- Do not change an existing route payload contract unless the user explicitly asks for that contract change.

## Workflow

1. Inspect the closest existing route, currently `src/presentation/aws-apigateway/register_book.ts`.
2. Verify the target domain use case, repository interfaces, repository implementations, and DynamoDB tables already exist.
3. If any domain persistence is missing, stop route work and use `$create-domain-boilerplate` first.
4. Create or update the handler in `src/presentation/aws-apigateway/`.
5. Add or update request/response Zod schemas in `src/presentation/zod/` when the HTTP contract changes.
6. Add or update the Lambda function in `terraform/aws_lambdas.tf`.
7. Add or update API Gateway resources in `terraform/aws_apigateway.tf`:
   - `aws_api_gateway_resource`
   - `aws_api_gateway_method`
   - `aws_api_gateway_integration`
   - `aws_lambda_permission`
   - `aws_api_gateway_deployment.triggers.redeployment`
8. Add the SAM route in `sam/template.yml` if local testing should support it.
9. Add or update `src/presentation/aws-apigateway/samples.http`.
10. Run TypeScript validation and build when possible.

## Handler Pattern

Use the current route as the baseline:

- A schema from `src/presentation/zod` validates the incoming request.
- The handler creates already-defined infrastructure repositories and publishers.
- The handler creates the already-defined use case.
- The handler returns `ApiResponse.created(result)` for successful creation.
- The handler catches errors and returns `ApiResponse.error(error)`.

For non-create routes, choose the response helper that matches behavior:

- `ApiResponse.created` for newly created resources.
- `ApiResponse.ok` for reads, updates, commands that do not create a new resource, or idempotent actions.

## Terraform Pattern

When adding a route, keep the deployment trigger up to date:

```hcl
triggers = {
  redeployment = sha1(jsonencode([
    aws_api_gateway_resource.books.id,
    aws_api_gateway_method.post_books.id,
    aws_api_gateway_integration.register_book.id,
  ]))
}
```

Add new route resources, methods, and integrations to that list so API changes create a new deployment.

Use Lambda proxy integration:

```hcl
type                    = "AWS_PROXY"
integration_http_method = "POST"
uri                     = aws_lambda_function.<lambda_resource>.invoke_arn
```

Create a matching API Gateway invoke permission:

```hcl
resource "aws_lambda_permission" "allow_books_api_<route_name>" {
  statement_id  = "AllowExecutionFromBooksApiGateway<RouteName>"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.<lambda_resource>.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}
```

## Done Criteria

- Handler path and Terraform Lambda handler match exactly.
- API Gateway method, integration, Lambda invoke permission, and deployment trigger are all wired.
- SAM route is updated when local testing is expected.
- Request schema and DTO names follow the current PascalCase contract style.
- Handler owns parsing and response mapping.
- Domain, use case, repository, DynamoDB table, and DynamoDB IAM changes are not introduced by this skill.
- `tsc --noEmit` passes when available.
- `bun run build:lambdas` passes when available.
