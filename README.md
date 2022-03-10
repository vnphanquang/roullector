<div align="center">

# roulletor: **rou**te co**llector**

[![npm.badge]][npm] [![codecov.badge]][codecov] [![actions.ci.badge]][actions.ci] [![actions.release.badge]][actions.release] [![semantic-release.badge]][semantic-release] [![MIT][license.badge]][license]

[![][tweet]][tweet.url]

</div>

Collect and generate route data from a file-based router such as [svelte-kit's][svelte.kit.routing]

## Table of Contents

<details open>
  <summary>Show / hide</summary>

- [roulletor: **rou**te co**llector**](#roulletor-route-collector)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Example](#example)
    - [Options](#options)
    - [Library Usage](#library-usage)

</details>

## Installation

```bash
npm install -D roullector
yarn add --dev roullector
pnpm install -D roullector
```

## Usage

This package was initially built and tested for [svelte-kit][svelte.kit]. But I expect it to work in other cases using the [configurable options](#options). Examples used in this docs will use [svelte-kit][svelte.kit] common route setup.

### Example

If you have a directory that contains some routes like below...

<details open>
  <summary>directory: show / hide</summary>

  ```log
  src/routes/
    ├── __components/
    |       ├── Navbar.svelte
    |       └── Footer.svelte
    ├── __layout.svelte
    ├── __error.svelte
    ├── me.svelte
    ├── sign-in.svelte
    ├── sign-up.svelte
    ├── index.svelte
    └── admin/
        ├── __components/
        |     ├── Admin.layout.svelte
        |     ├── types.ts
        └── users/
            ├── [id]/
            |     ├── __layout.svelte
            |     ├── index.svelte
            |     ├── types.ts
            |     └── posts/
            |           ├── [post_id].svelte
            |           ├── s-[slug].svelte
            |           └── l-[short-link].svelte
            └── index.svelte
  ```

</details>
<br />

...and a npm script that run `roullector` with [default options](#options),...

<details open>
  <summary>package.json: show/hide</summary>

```jsonc
// package.json
{
  "scripts": {
    "codegen:routing": "roullector collect"
  }
}
```

</details>
<br />

...the following files will be generated:

<details open>
  <summary>Generated: show / hide</summary>

```jsonc
// src/generated/routing/routes.json
{
  "admin": {
    "users": {
      "id": {
        "index": "/admin/users/[id]",
        "posts": {
          "postId": "/admin/users/[id]/posts/[post_id]",
          "lShortLink": "/admin/users/[id]/posts/l-[short-link]",
          "sSlug": "/admin/users/[id]/posts/s-[slug]",
          "__dir": "/admin/users/[id]/posts"
        }
      },
      "index": "/admin/users"
    },
    "__dir": "/admin"
  },
  "index": "/",
  "me": "/me",
  "signIn": "/sign-in",
  "signUp": "/sign-up"
}
```

```typescript
// src/generated/routing/index.ts
export { default as AppRoutes } from './routes.json';
/**
 * build a complete path with injected arguments
 * @param path {string} based path
 * @param args {string[]} arguments to inject
 */
export function route(path: string, ...args: string[]): string {
  const params = path.match(/\[[a-zA-Z_-]+\]/g) ?? [];
  for (const i in params) {
    path = path.replace(params[i], args[i]);
  }
  return path;
}
```

</details>
<br />

Notice that `index.ts` will import json, you need to configure your `tsconfig.json` to enable `resolveJsonModule`:

<details open>
  <summary>tsconfig.json: show / hide</summary>

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

</details>
<br />

You can then use the `route` helper to construct a complete path with typescript support built-in. For example:

<details open>
  <summary>path contruct: show / hide</summary>

```typescript
import { AppRoutes } from '$generated/routing'; // or use relative path

const path = route(AppRoutes.admin.users.id.posts.sSlug, 'user-id-123', 'slug');
// path = '/admin/users/user-id-123/posts/s-slug'

// ... later
// navigate(path);
```

</details>

### Options

Run `npx roullector collect help` to for [configurable options](#options) in command-line mode

<details open>
  <summary>Table of Options</summary>
  <br />

  | name | default | description | cli equivalent |
  | --- | --- | --- | --- |
  | `inDir`           | `'src/routes'`            | input directory path to collect route data from | -i, --inDir |
  | `extensions`      | `['.svelte']`             | file extensions to accept | -e, --extensions (comma-separated) |
  | `ignorePatterns`  | `[/^_/]`                  | patterns to ignore filenames | -x, --ignorePatterns (comma-separated) |
  | `output`          | `true`                    | write generated files to disk?, if false will print to console | --no-output |
  | `outDir`          | `'src/generated/routing'` | output directory | -o, --outDir |
  | `depth`           | `Infinity`                | depth of directory traversal | -d, --depth |
  | `dirkey`          | `__dir`                   | key to save path for directories with no index file | -k, --dirkey |
  | `keyTransform`    | `camelCasify`             | how to transform route key in mapping | -t, --keyTransform |
  | `utils`           | `true`                    | generate utils for building path? | --no-utils |
  | `typescript`      | `true`                    | generate files in typescript? | --no-typescript |
  | `verbose`         | `false`                   | print more info during operation (for cli only) | --verbose |

</details>
<br />

Notes:

- in command-line mode, `keyTransform` only accepts one of `camelCase | none`. See [implementation for more details][roullector.collect.constants].
- for boolean options (default to `true`), the cli equivalent is `--no-<option>`, meaning only add the flag if you want to negate the option.

### Library Usage

<details open>
  <summary>show / hide</summary>

  ```typescript
  import { collect, defaultCollectOptions } from `roullector`;

  console.log('These are default options:', defaultCollectOptions);

  let { json, route } = collect(); // use default options
  // json = './src/generated/routing/routes.json'
  // route = './src/generated/routing/index.ts'

  ({ json, route } = collect({ output: false; }); // helpful for testing
  // json = generated route mapping content
  // route = generated index source
  ```
</details>

## Contributing

[Read Contribution Guide][roullector.contributing]

<br />
<div align="center">

[![][tweet]][tweet.url]

</div>


<p align="center">
  <a href="https://www.buymeacoffee.com/vnphanquang" target="_blank">
    <img
      src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
      height="60"
      width="217"
      alt="buy vnphanquang a coffee"
    />
  </a>
</p>

[codecov.badge]: https://codecov.io/github/vnphanquang/roullector/coverage.svg?branch=main
[codecov]: https://codecov.io/github/vnphanquang/roullector?branch=main

[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE

[actions.ci.badge]: https://github.com/vnphanquang/roullector/actions/workflows/ci.yaml/badge.svg
[actions.ci]: https://github.com/vnphanquang/roullector/actions/workflows/ci.yaml

[npm.badge]: https://img.shields.io/npm/v/roullector
[npm]: https://www.npmjs.com/package/roullector

[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release.badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[actions.release.badge]: https://github.com/vnphanquang/roullector/actions/workflows/release.yaml/badge.svg
[actions.release]: https://github.com/vnphanquang/roullector/actions/workflows/release.yaml

[roullector.contributing]: ./CONTRIBUTING.md
[roullector.collect.constants]: ./src/commands/collect/collect.constants.ts
[roullector.collect.types]: roullector/commands/collect/collect.types.ts

[svelte.kit]: https://kit.svelte.dev/
[svelte.kit.routing]: https://kit.svelte.dev/docs/routing

[tweet]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2vnphanquang%2Froullector
[tweet.url]: https://twitter.com/intent/tweet?text=roullector%3A%20route%20mapping%20genration%20for%20file-based%20router%20like%20svelte-kit%20and%20more%0A%0Ahttps%3A%2F%2Fgithub.com%2Fvnphanquang%2Froullector
