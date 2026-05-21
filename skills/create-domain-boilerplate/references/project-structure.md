# Project Structure Reference

Current domain/application layout:

```text
src/domain/
  Book/Book.ts
  Error/errors.ts

src/application/
  Book/dtos/BookDto.ts
  Book/repositories/IBookRepository.ts
  Book/repositories/index.ts
  Book/Usecase/RegisterBookUsecase.ts
  Event/EventPublisher.ts
  Event/Events.ts
  Shared/Id.ts
  Shared/Usecase.ts
```

Observed conventions:

- Domain folder and domain class use PascalCase: `Book/Book.ts`.
- Application folder uses the same domain name: `src/application/Book`.
- Use case folder is named `Usecase`, and use case classes end in `Usecase`.
- Repository folder is named `repositories`.
- Repository interfaces use `I<Domain>Repository`.
- Repository barrels export the interface type from `index.ts`.
- `BookDTO` lives under `src/application/Book/dtos/BookDto.ts` because it is also an event/API contract.
- DTO keys used by persistence/event contracts are PascalCase.
- Domain fields should be camelCase and should not use underscore-prefixed backing fields.
- Domain-local type aliases should live inside exported namespaces such as `BookDomain`.

When creating a new module, inspect whether partial folders already exist. Keep the project small unless the requested domain behavior needs more application orchestration.
