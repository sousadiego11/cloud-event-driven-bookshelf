# API Gateway Route Patterns

Use this reference when adding an HTTP route in this repository.

## Current route

Main example:

- Handler: `src/presentation/aws-apigateway/register_book.ts`
- Zod schemas: `src/presentation/zod/BookSchemas.ts`
- Use case: `src/application/Book/Usecase/RegisterBookUsecase.ts`
- DTO: `src/application/Book/dtos/BookDto.ts`
- Repository implementation: `src/infrastructure/aws-dynamodb-repositories/dynamodb-books-repository.ts`
- Lambda Terraform: `terraform/aws_lambdas.tf`
- API Gateway Terraform: `terraform/aws_apigateway.tf`
- SAM local route: `sam/template.yml`
- Manual request example: `src/presentation/aws-apigateway/util/test.http`

## Current flow

1. API Gateway receives `POST /books`.
2. Lambda handler parses `evt.body` with `parseBody` and a Zod schema from `src/presentation/zod`.
3. Handler creates infrastructure dependencies.
4. Handler creates the use case.
5. Use case creates/updates domain state.
6. Use case persists through the repository.
7. Use case publishes an EventBridge event when the route starts an async flow.
8. Handler returns through `ApiResponse`.

## Current `register_book` contract

Request schema:

```ts
export const RegisterBookSchema = z.object({
    Title: z.string().min(1),
    Author: z.string().min(1),
    Isbn: z.string().min(1).optional(),
});
```

Response and event detail use `BookDTO` and `BookDTOSchema`:

```ts
export interface BookDTO {
    Id: string;
    Title: string;
    Author: string;
    Isbn?: string;
    RegisteredAt: string;
    UpdatedAt: string;
}
```

Keep schemas in `src/presentation/zod/*.ts` so API Gateway handlers and SQS listeners do not import from each other.

## Terraform checklist

For each new route, check whether to update:

- `terraform/aws_lambdas.tf`
  - Add `aws_lambda_function`.
  - Add IAM permissions only when the route needs new AWS actions/resources.
- `terraform/aws_apigateway.tf`
  - Add `aws_api_gateway_resource` when the path is new.
  - Add `aws_api_gateway_method`.
  - Add `aws_api_gateway_integration`.
  - Add `aws_lambda_permission`.
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
- Use case class: PascalCase ending in `Usecase`, for example `RegisterBookUsecase`.

## Validation

Run when possible:

```powershell
.\node_modules\.bin\tsc.exe --noEmit
bun run build:lambdas
```

If Terraform is available:

```powershell
terraform -chdir=terraform fmt
terraform -chdir=terraform validate
```
