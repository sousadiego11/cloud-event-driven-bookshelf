# API Gateway Route Patterns

Use this reference when adding or modifying HTTP transport in this repository.

## Current route examples

- Book handler: `src/presentation/aws-apigateway/register_book.ts`
- Loan handler: `src/presentation/aws-apigateway/register_loan.ts`
- Zod schemas: `src/presentation/zod/*Schemas.ts`
- Lambda Terraform: `terraform/aws_lambdas.tf`
- API Gateway Terraform: `terraform/aws_apigateway.tf`
- SAM local route: `sam/template.yml`
- Manual request examples: `src/presentation/aws-apigateway/samples.http`

## Current flow

1. API Gateway receives the HTTP request.
2. Lambda handler parses `evt.body` with `parseBody` and a Zod schema from `src/presentation/zod`.
3. Handler instantiates existing infrastructure dependencies.
4. Handler instantiates an existing application use case.
5. Use case owns business orchestration and persistence.
6. Handler returns through `ApiResponse`.

## Boundary with domain skill

Do not create or modify these from this skill:

- `src/domain/**`
- `src/application/<Domain>/Usecase/**`
- `src/application/<Domain>/repositories/**`
- `src/infrastructure/aws-dynamodb-repositories/**`
- `terraform/aws_dynamodb.tf`
- DynamoDB table ARNs in `terraform/aws_lambdas.tf`

If any of those are needed, use `$create-domain-boilerplate` first.

## Terraform checklist

For each new route, check whether to update:

- `terraform/aws_lambdas.tf`
  - Add `aws_lambda_function`.
  - Do not add DynamoDB table IAM permissions here for route work.
- `terraform/aws_apigateway.tf`
  - Add `aws_api_gateway_resource` when the path is new.
  - Add `aws_api_gateway_method`.
  - Add `aws_api_gateway_integration`.
  - Add `aws_lambda_permission` for API Gateway invoke access.
  - Add the new resource/method/integration IDs to `aws_api_gateway_deployment.books_api.triggers.redeployment`.
- `sam/template.yml`
  - Add an `AWS::Serverless::Function` event for local API testing.

## Naming conventions

- Handler file: snake_case, for example `register_book.ts`.
- Lambda Terraform resource: snake_case, for example `register_book`.
- AWS Lambda function name: kebab-case, for example `bookshelf-register-book`.
- API Gateway Terraform method: include HTTP verb and resource, for example `post_books`.
- Integration resource: use the route action name, for example `register_book`.
- Permission resource: `allow_books_api_<route_name>`.

## Validation

Run when possible:

```powershell
.\node_modules\.bin\tsc.exe --noEmit
bun run build:lambdas
```

If Terraform is available:

```powershell
terraform -chdir=terraform fmt -check
terraform -chdir=terraform validate
```
