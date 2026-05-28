---
name: create-apigateway-route
description: Create or update API Gateway routes in this virtual bookshelf repository. Use when Codex needs to add a new HTTP route, Lambda handler under src/presentation/aws-apigateway, request/response schema, use case wiring, Lambda Terraform resource, API Gateway method/integration/permission/deployment trigger entries, SAM local route, or a test.http example while following the existing register_book pattern.
---

# Create API Gateway Route

Use this skill when creating or modifying an API Gateway route in this repository.

Read `references/project-patterns.md` before editing. It captures the current `register_book` pattern and Terraform wiring.

## Core Rules

- Put API Gateway handlers in `src/presentation/aws-apigateway/*.ts`.
- Put Zod schemas in `src/presentation/zod/*.ts` and import them from handlers/listeners.
- Keep handlers thin:
  - import Zod schemas
  - parse input with `parseBody`
  - instantiate infrastructure dependencies
  - instantiate the application use case
  - return through `ApiResponse`
  - log expected steps and errors with `Logger`
- Keep business rules inside domain/application, not in the handler.
- Use application use cases under `src/application/<Domain>/Usecase/*Usecase.ts`.
- Use DTOs from `src/application/<Domain>/dtos/*.ts` when the route input/output is also an event or API contract.
- Use PascalCase request/DTO keys when the route follows repository/domain contract style.
- If the route publishes an event, keep `src/application/Event/Events.ts` aligned with the use case and downstream consumers.
- Do not change an existing route payload contract unless the user explicitly asks for that contract change.

## Workflow

1. Inspect the closest existing route, currently `src/presentation/aws-apigateway/register_book.ts`.
2. Decide whether the route needs a new domain action, a new use case, or only a handler around an existing use case.
3. Create or update the application/domain pieces first when needed.
4. Create the handler in `src/presentation/aws-apigateway/`.
5. Add or update the Lambda function in `terraform/aws_lambdas.tf`.
6. Add or update API Gateway resources in `terraform/aws_apigateway.tf`:
   - `aws_api_gateway_resource`
   - `aws_api_gateway_method`
   - `aws_api_gateway_integration`
   - `aws_lambda_permission`
   - `aws_api_gateway_deployment.triggers.redeployment`
7. Add the SAM route in `sam/template.yml` if local testing should support it.
8. Add or update `src/presentation/aws-apigateway/util/test.http`.
9. Run TypeScript validation and build when possible.

## Handler Pattern

Use the current route as the baseline:

- `RegisterBookSchema` validates the incoming request from `src/presentation/zod/BookSchemas.ts`.
- `BookDTOSchema` validates the published event detail reused by the SQS listener.
- The handler creates `DynamoBookRepository`, `AWSEventBridgePublisher`, and `RegisterBookUsecase`.
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

Create a matching permission:

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
- API Gateway method, integration, Lambda permission, and deployment trigger are all wired.
- SAM route is updated when local testing is expected.
- Request schema and DTO names follow the current PascalCase contract style.
- Use case owns orchestration; handler owns parsing and response mapping.
- `tsc --noEmit` passes when available.
- `bun run build:lambdas` passes when available.
