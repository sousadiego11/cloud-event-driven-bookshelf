# Domain and Persistence Project Structure

Use this reference before creating or normalizing a domain module.

## Source layout

- Domain entity: `src/domain/<Domain>/<Domain>.ts`
- Application DTOs: `src/application/<Domain>/dtos/*.ts`
- Repository interface: `src/application/<Domain>/repositories/I<Domain>Repository.ts`
- Repository barrel: `src/application/<Domain>/repositories/index.ts`
- Use cases: `src/application/<Domain>/Usecase/*Usecase.ts`
- DynamoDB repository: `src/infrastructure/aws-dynamodb-repositories/dynamodb-<domains>-repository.ts`

## Domain and DTO rules

- Keep DTOs out of `src/domain`.
- Use PascalCase DTO keys, for example `Id`, `BookId`, `Quantity`, `RegisteredAt`, `UpdatedAt`.
- Keep domain internals in camelCase and private by default.
- Put domain type aliases in `export namespace <Domain>Domain`.
- Use `toDto()` to translate domain fields into DTO fields.
- Rebuild persisted aggregates with a factory method when existing use cases need persisted state.

## DynamoDB repository pattern

- Use `DynamoDBDocumentClient` from `src/infrastructure/aws-dynamodb-client/dynamodb-client.ts`.
- Use `PutCommand` for `save`.
- Use `DeleteCommand` for `delete`.
- Use `QueryCommand` for GSI lookups.
- Return `DTO | null` for find methods.
- Keep table names as private class fields matching Terraform table names.

## Terraform DynamoDB pattern

- Add tables in `terraform/aws_dynamodb.tf`.
- Use `billing_mode = "PAY_PER_REQUEST"`.
- Use `hash_key = "Id"` unless the user explicitly chooses another primary key.
- Declare all attributes used by the table key or GSIs.
- Declare GSIs with `global_secondary_index` and nested `key_schema` blocks.
- Keep Terraform resource names in snake_case.

## Lambda IAM table permission

`terraform/aws_lambdas.tf` centralizes the shared Lambda IAM policy.

When adding a persisted domain table, add only the table ARN to the DynamoDB statement `resources` list:

```hcl
resources = [
  aws_dynamodb_table.books.arn,
  aws_dynamodb_table.loans.arn,
  aws_dynamodb_table.inventory.arn
]
```

Do not add GSI/index ARNs to this list under the current project convention.
