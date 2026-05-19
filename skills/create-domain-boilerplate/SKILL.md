---
name: create-domain-boilerplate
description: Create or update domain and application boilerplate in this ecommerce repository. Use when Codex needs to add a new domain aggregate/entity, define repository interfaces, DTO contracts, use cases, indexes, or application folders under src/domain and src/application while following this repo's conventions: DTOs live in application/repository or application/dtos folders, DTO properties are PascalCase, domain types live inside exported <Domain>Domain namespaces, and domain properties must not use underscore-prefixed names.
---

# Create Domain Boilerplate

Use this skill when creating or normalizing a domain/application module in this repository.

Read `references/project-structure.md` before editing. It captures the current layout and naming rules.

## Core Rules

- Keep domain files in `src/domain/<Domain>/<Domain>.ts`.
- Keep application files in `src/application/<Domain>/`.
- Put repository interfaces in `src/application/<Domain>/repositories/I<Domain>Repository.ts`.
- Export repository interfaces from `src/application/<Domain>/repositories/index.ts`.
- Put DTO types with the application contract, not inside the domain folder.
- Prefer declaring repository-facing DTOs in the repository interface file when the DTO only exists for persistence/repository use.
- Use `src/application/<Domain>/dtos/*.ts` only when the DTO is a broader application/input/output contract reused beyond one repository.
- Use PascalCase keys in DTOs: `Id`, `UserId`, `ProductId`, `CreatedAt`, `UpdatedAt`, `SentAt`.
- Put domain-local type aliases inside `export namespace <Domain>Domain`; do not leave aliases such as `type OrderId = string` loose at module top level.
- Do not create domain properties starting with `_`. Use names such as `status`, `updatedAt`, `currentStatus`, or private `statusValue` instead.
- Keep domain internals in idiomatic TypeScript camelCase; only DTOs use PascalCase.
- Keep `toDto()` responsible for translating domain names to DTO names.

## Workflow

1. Inspect existing related files before creating new ones:
   - `src/domain/<Domain>/`
   - `src/application/<Domain>/`
   - repository interfaces and `index.ts`
   - nearby use cases and DTOs
2. Decide whether the domain needs:
   - a domain class/entity
   - a repository interface
   - a DTO in `repositories/I<Domain>Repository.ts`
   - a separate DTO file under `dtos/`
   - one or more use cases under `Usecase/`
3. Create folders and files using the current capitalization:
   - domain folder and class: PascalCase
   - repository interface: `I<Domain>Repository`
   - use case class: PascalCase ending in `Usecase`
4. Keep domain validation and state transitions inside the domain object.
5. Keep orchestration inside use cases.
6. Keep persistence details out of domain and use case files.
7. Verify imports point from domain to application types only when needed for DTO translation; do not put DTO declarations in `src/domain`.

## Domain Pattern

Use private constructors when creation requires validation or factory methods.

Prefer:

```ts
export class Example {
    readonly id: ExampleDomain.Id;
    private currentStatus: ExampleDomain.Status;
    readonly createdAt: Date;
    private updatedAtValue: Date;

    toDto(): ExampleDTO {
        return {
            Id: this.id,
            Status: this.currentStatus,
            CreatedAt: this.createdAt.toISOString(),
            UpdatedAt: this.updatedAtValue.toISOString(),
        };
    }
}
```

Put domain type aliases above the class:

```ts
export namespace ExampleDomain {
    export type Id = string;
    export type UserId = string;
    export type Status = "created" | "done";
}
```

Avoid:

```ts
private _status: string;
_updatedAt: Date;
```

## Repository DTO Pattern

For repository-local DTOs, place the DTO in `I<Domain>Repository.ts`:

```ts
export interface ExampleDTO {
    Id: string;
    UserId: string;
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
- `toDto()` maps camelCase domain properties into PascalCase DTO keys.
- Repository folder has `I<Domain>Repository.ts` and `index.ts`.
- Use cases return application DTOs, not domain entities, unless the existing module already does otherwise.
- Imports are type-only where possible.
