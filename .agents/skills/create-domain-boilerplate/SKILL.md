---
name: create-domain-boilerplate
description: Create or update domain, application, repository, DynamoDB persistence, DynamoDB table, and Lambda IAM table permission boilerplate in this virtual bookshelf repository. Use when Codex needs to add or normalize a domain aggregate/entity, DTO contract, repository interface, DynamoDB repository implementation, application use case, DynamoDB table or GSI, or the table and index ARNs in terraform/aws_lambdas.tf. API Gateway and SQS skills must rely on this skill for new domain persistence instead of creating repositories or tables themselves.
---

# Create Domain Boilerplate

Use this skill when creating or normalizing a domain/application module and its persistence in this repository.

Read `references/project-structure.md` before editing. It captures the current layout, DynamoDB patterns, IAM policy pattern, and naming rules.

## Responsibility Boundary

- Own domain, application, persistence, DynamoDB table, and DynamoDB table IAM permission changes.
- Create repository interfaces and DynamoDB repository implementations for new domain persistence.
- Create or update tables and GSIs in `terraform/aws_dynamodb.tf`.
- Add the table ARN and any required GSI index ARNs to the DynamoDB `resources` list in `terraform/aws_lambdas.tf`.
- Keep the ARN pattern aligned with Terraform, including `${aws_dynamodb_table.<table>.arn}/index/*` for index access.
- Let `$create-apigateway-route` handle HTTP transport after the domain/use case/repository/table exist.
- Let `$create-sqs-listener` handle queue/listener transport after the domain/use case/repository/table exist.

## Core Rules

- Keep domain files in `src/domain/<Domain>/<Domain>.ts`.
- Keep application files in `src/application/<Domain>/`.
- Put repository interfaces in `src/application/<Domain>/repositories/I<Domain>Repository.ts`.
- Export repository interfaces from `src/application/<Domain>/repositories/index.ts`.
- Put DynamoDB implementations in `src/infrastructure/aws-dynamodb-repositories/dynamodb-<domains>-repository.ts`.
- Put DTO types with the application contract, not inside the domain folder.
- Prefer declaring repository-facing DTOs in the repository interface file when the DTO only exists for persistence/repository use.
- Use `src/application/<Domain>/dtos/*.ts` only when the DTO is a broader application/input/output contract reused beyond one repository.
- Use PascalCase keys in DTOs: `Id`, `Title`, `Author`, `RegisteredAt`, `UpdatedAt`.
- Put domain-local type aliases inside `export namespace <Domain>Domain`; do not leave aliases such as `type BookId = string` loose at module top level.
- Do not create domain properties starting with `_`.
- Keep domain state private.
- Prefer ECMAScript private fields such as `#status` and `#updatedAt`.
- If another class needs to read domain state, expose a focused `get` instead of making the property public.
- Keep domain internals in idiomatic TypeScript camelCase; only DTOs use PascalCase.
- Keep `toDto()` responsible for translating domain names to DTO names.

## Workflow

1. Inspect existing related files before creating new ones:
   - `src/domain/<Domain>/`
   - `src/application/<Domain>/`
   - `src/infrastructure/aws-dynamodb-repositories/`
   - `terraform/aws_dynamodb.tf`
   - `terraform/aws_lambdas.tf`
2. Decide whether the domain needs:
   - a domain class/entity
   - an application DTO
   - a repository interface
   - a DynamoDB repository implementation
   - one or more use cases under `Usecase/`
   - a table or GSI
3. Create folders and files using the current capitalization:
   - domain folder and class: PascalCase
   - repository interface: `I<Domain>Repository`
   - use case class: PascalCase ending in `Usecase`
   - Dynamo repository class: `Dynamo<Domain>Repository`
4. Keep domain validation and state transitions inside the domain object.
5. Keep orchestration inside use cases.
6. Keep persistence details inside infrastructure repository files.
7. Update `terraform/aws_dynamodb.tf` for the table and any GSIs.
8. Update the DynamoDB `resources` list in `terraform/aws_lambdas.tf` with the table ARN and any required `${aws_dynamodb_table.<table>.arn}/index/*` entries for GSIs.
9. Verify imports are type-only where possible.

## Domain Pattern

Use private constructors when creation requires validation or factory methods.

Prefer:

```ts
export namespace ExampleDomain {
    export type Id = string;
    export type Status = "created" | "done";
}

export class Example {
    readonly #id: ExampleDomain.Id;
    #status: ExampleDomain.Status;
    readonly #createdAt: Date;
    #updatedAt: Date;

    get id(): ExampleDomain.Id {
        return this.#id;
    }

    toDto(): ExampleDTO {
        return {
            Id: this.#id,
            Status: this.#status,
            CreatedAt: this.#createdAt.toISOString(),
            UpdatedAt: this.#updatedAt.toISOString(),
        };
    }
}
```

Avoid:

```ts
private _status: string;
_updatedAt: Date;
```

## Repository Pattern

For repository-local DTOs, place the DTO in `I<Domain>Repository.ts`:

```ts
export interface ExampleDTO {
    Id: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface IExampleRepository {
    save(exampleDto: ExampleDTO): Promise<void>;
    findById(id: string): Promise<ExampleDTO | null>;
    delete(id: string): Promise<void>;
}
```

Then export only the interface from `index.ts` unless callers need the DTO through the barrel:

```ts
export type { IExampleRepository } from "./IExampleRepository";
```

## Done Criteria

- DTO definitions are outside `src/domain`.
- DTO property names are PascalCase.
- Domain-local type aliases live in `export namespace <Domain>Domain`.
- Domain properties do not start with `_`.
- Domain state is private by default.
- `toDto()` maps camelCase domain properties into PascalCase DTO keys.
- Repository folder has `I<Domain>Repository.ts` and `index.ts`.
- DynamoDB repository implementation exists when the domain persists data.
- `terraform/aws_dynamodb.tf` has the table and required GSIs.
- `terraform/aws_lambdas.tf` includes the table ARN and required index ARNs in the DynamoDB policy `resources` list.
- Use cases return application DTOs, not domain entities, unless the existing module already does otherwise.
