---
description: Copilot instructions for Wonderland Engine projects
applyTo: '**/*.{ts,tsx,js,jsx,md,json}'
---

# Wonderland Engine Game Copilot Instructions

Use these guidelines when generating code, reviewing changes, or answering questions in this repository.

Follow the Wonderland Engine style guide in spirit and in detail. When there is any conflict between convenience and consistency, choose consistency.

## Game

Elemental Echoes is a cozy VR world-builder where you guide the growth of a living landscape using the four classical elements. Harvest elemental essence, play powerful cards, and watch forests, lakes, mountains, and volcanoes emerge from your choices.

## Core Design Principles

- Keep domain logic independent from Wonderland Engine specifics whenever possible.
- Separate state, game flow, UI state, and rendering concerns.
- Favor small services with single responsibilities over large manager classes.
- Prefer dependency injection through constructors, service locators, or explicit wiring at bootstrap over hidden globals.
- Keep data flow one-directional where practical.
- Make transitions explicit: state changes should happen in one place and be observable through events or signals.
- Avoid coupling UI interactions directly to low-level game mutation logic.
- Prefer reusable abstractions only when they reduce coupling or clarify ownership.
- Do not introduce architectural layers just to make the code look sophisticated.

## Architectural Priorities

- Model the game as a domain with entities, state, and rules.
- Put rule validation and state transitions in services or models, not in UI components.
- Keep rendering and input handling as adapters around the domain layer.
- Prefer event-driven coordination between systems over direct cross-calls when that improves decoupling.
- Preserve the ability to replace the renderer, input layer, or game source without rewriting core logic.
- Treat Wonderland Engine components as integration points, not as the home for core game logic.
- Keep engine-facing glue thin and deterministic.

## Coding Guidelines

- Keep functions short and intention-revealing.
- Use descriptive names that communicate domain meaning.
- Prefer explicit types and narrow interfaces.
- Avoid premature abstraction, but extract when a responsibility is clearly repeated or mixed.
- Preserve existing style and patterns in the repository unless a refactor is clearly improving the architecture.
- Add comments only when they explain non-obvious intent or an architectural constraint.
- Avoid cleverness, hidden branching, and implicit state.

## When Writing TypeScript

- Prefer small, focused modules over large files.
- Avoid adding new dependencies unless they materially improve clarity or correctness.
- Use interfaces and types to define boundaries between layers.
- Keep Wonderland-specific code in integration or presentation layers.
- Make asynchronous behavior explicit and isolate side effects.
- Use 4 spaces for indentation.
- Use PascalCase for classes, components, types, and file-scoped Wonderland concepts when the surrounding codebase expects that style.
- Use lowerCamelCase for variables, functions, and properties.
- Prefix private members with `_`.
- Always include explicit access modifiers on class members.
- Avoid `any` unless there is no safer alternative and the reason is documented.
- Prefer `const` over `let` when reassignment is not required.
- Prefer template strings over concatenation.
- Use `===` and `!==` only.
- Never omit braces.
- Keep lines short and readable.

## When Reviewing or Suggesting Changes

- Evaluate whether a change improves or weakens separation of concerns.
- Call out any logic that leaks engine details into domain code.
- Look for hidden coupling, duplicated state, and unclear ownership of mutations.
- Prefer changes that improve long-term reuse even if they add a small amount of upfront structure.
- If a change is purely game-specific and makes reuse harder, say so clearly.
- Be strict about architectural regressions, especially if they blur boundaries or make the domain harder to reuse.

## Good Default Behaviors

- Before editing, identify the smallest layer that should own the change.
- Prefer fixing architecture at the boundary rather than spreading special cases across the codebase.
- If a feature request can be implemented in multiple ways, choose the one that best preserves SOLID boundaries.
- If the request is ambiguous, assume the user wants the most maintainable solution, not the shortest patch.
- If a proposed shortcut weakens the architecture, push back and explain the tradeoff.

## Commit Messages

- Keep Git commit messages short, imperative, and focused.
- Use a capitalized subject line without a trailing period.
- Prefer a concise subject that describes the change without extra explanation.
- If more detail is needed, put it in the body, not the subject.

## Repository Context

- `js/` contains the TypeScript source for the game and supporting services.
- `deploy/` contains generated runtime output and should generally not be treated as the source of truth.
- `ui/` and `js/ui/` cover presentation concerns, while `js/services/` and `js/models/` should carry more of the reusable game logic.
- Keep architectural experiments readable and incremental so they can later be applied to other games.

## Generated Files

- Files in `cache/` are generated artifacts.
- Do not treat `cache/` files as hand-edited source.
- When reviewing changes, skip `cache/` files unless the task is specifically about generated output, build artifacts, or a bug that clearly originates there.
- Do not spend review effort on `cache/` diffs by default.

## Priority Reminder

If there is a tradeoff between shipping a quick Elemental Echoes-specific shortcut and building a reusable game architecture, prefer the reusable architecture unless the user explicitly asks for the shortcut.
