# Zettel: Public API Client

API helper tools for client-side.

## Installation

```bash
$ npm install @zettelooo/api-client
```

## Development

Clone the repository locally:


```bash
$ git clone git@github.com:zettelooo/api-client.git
```

Install the dependencies:

```bash
$ cd api-client
$ npm install
```

It's recommended to use **VS Code** to develop this project.
You need to have **Prettier** and **ESLint** extensions to be installed on your IDE.

> Linting will be called _automatically_ before committing. Any linting error will abort the process. Therefore, you possibly need to lint the staged changes manualy before trying to commit them yourself and fix all the errors and as much as possible of warnings first.

Lint check before commit:

```bash
$ npm run bt -- lint-staged   # Alternatively:   $ npm run l
```

## Publication

Publish a new version of the NPM package:

- Push all the changes. The workspace needs to be cleaned.
- Make sure you're on `master` branch.

```bash
$ npm version patch   # / minor / major / any other valid semantic version
```

## Misc

You can use the following NPM script to access [Zettel Build Tools](https://github.com/zettelooo/build-tools#usage):

```bash
$ npm run bt -- <command>   # e.g.: npm run bt - update
```

------------------

Copyright: **Zettel, 2020-23**
