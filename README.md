# About

I started this project to create calendar of our family events, since we had troubles to remember all the dates. However, instead of creating another calendar app I decided to create people directory and derive calendar events out of the directory. That was the functional goal. The other one, was to familiarize with tools, frameworks and systems I had little to do before.

# Neo4j

For my storage I decided to use graph database. After considerations I went for [Neo4j](https://neo4j.com).

* Labels used **Person**, **Woman** and **Man**,
* Relationships types: ***IS_CHILD_OF*** and ***IS_MARRIED_TO***

# React and Next.js framework

The app is full-stack [React](https://react.dev) application built with [Next.js](https://nextjs.org) framework using Server Components and Server Actions.

# Nix

I’m using [Nix](https://nix.dev) package manager and nix-shell to create development environment.

Provided Nix is installed:
* run nix-shell in project’s root directory and you get all dependencies set,
* use bin scripts to create/start/stop Neo4j database.

# Tests

For tests I use:
* [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com) for component tests,
* [Playwright](https://playwright.dev) for API tests,
* [Cypress](https://www.cypress.io) for end to end UI tests.

# Continues integration

I use [Github Actions](https://docs.github.com/en/actions) for basic validation.

