# TypeScript Monorepo Template

This repository is a small `pnpm` workspace for TypeScript monorepos.

- `packages/*` contains reusable internal libraries.
- `services/*` contains runnable applications that can depend on workspace packages.
- `scripts/*` contains workspace tooling.

The workspace uses:

- `pnpm` workspaces for dependency management.
- TypeScript project references for build order and type-safe package boundaries.
- `vitest` for tests.
- `biome` for linting and formatting.

## Getting started

Install dependencies from the repository root:

```sh
pnpm install
```

Useful root commands:

```sh
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm format
```

## Installing external dependencies

Run dependency commands from the repository root and target the workspace package or service with `--filter`.

Add a runtime dependency to a package:

```sh
pnpm --filter @workspace/example-lib add zod
```

Add a runtime dependency to a service:

```sh
pnpm --filter @workspace/example-service add fastify
```

Add a dev dependency to a specific workspace project:

```sh
pnpm --filter @workspace/example-service add -D tsx
```

If a tool is meant for the whole workspace, add it at the root:

```sh
pnpm add -D -w some-tool
```

## Using internal workspace packages in services

The example service already depends on the example library:

```json
{
  "dependencies": {
    "@workspace/example-lib": "workspace:*"
  }
}
```

To use your own internal package in a service:

1. Add the package as a dependency in the service `package.json` with the `workspace:*` protocol.
2. Add a TypeScript project reference in the service `tsconfig.json`.
3. Import it by package name.

Example service dependency:

```json
{
  "dependencies": {
    "@workspace/my-lib": "workspace:*"
  }
}
```

Example service TypeScript reference:

```json
{
  "references": [
    {
      "path": "../../packages/my-lib"
    }
  ]
}
```

Example import:

```ts
import { something } from "@workspace/my-lib";
```

This keeps package resolution aligned across the workspace and lets `tsc -b` build projects in the right order.

## Creating a new package

Create the package under `packages/`. You do not need to change `pnpm-workspace.yaml` as long as the package stays under `packages/*`.

Recommended structure:

```text
packages/
  my-lib/
    package.json
    tsconfig.json
    src/
      index.ts
    test/
      index.spec.ts
```

Use `packages/example-lib` as the template.

Example `package.json`:

```json
{
  "name": "@workspace/my-lib",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "development": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b",
    "typecheck": "tsc --pretty false --noEmit -p tsconfig.json"
  }
}
```

Example `tsconfig.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"]
}
```

Then:

1. Add the new package to the root `tsconfig.json` `references` array.
2. Add tests if the package has behavior worth locking down.
3. Add `workspace:*` dependencies and TypeScript references from any service that consumes it.

## Why the `development` export condition matters

The package `exports` block uses a `development` condition:

```json
{
  "exports": {
    ".": {
      "development": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./dist/index.js"
    }
  }
}
```

This gives you two useful behaviors:

- Development tools can load TypeScript source directly from `src/`.
- Production builds and runtime code still use the compiled output in `dist/`.

In this repository, `vitest` is already configured with development-time resolve conditions, so tests can consume workspace packages without forcing a full build first.

If you add other development-time tooling later, make sure that tool also resolves the `development` condition, for example with `--conditions=development` or the tool's equivalent resolver setting.