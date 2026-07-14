# Elemental Echoes - Validation & Implementation Plan

## Current Execution Status (2026-07-14)

- Simulation file (`js/hexagonmap/simulation.ts`) recently updated.
- Compiler and diagnostics checks are passing.
- Simulation boundary/safety hardening is in progress:
	- deterministic tick behavior
	- safer value propagation limits
- Remaining technical debt:
	- cleanup/reuse of previously spawned world objects (essence/visuals) during updates and resets

## Current Project Validation

### Already Implemented

- Wonderland Engine project configured and running.
- Hex grid data structure (`HexagonGrid`).
- Hex tile model with cube coordinates and neighbor lookup (`HexagonTile`).
- Hex to world-space conversion.
- Basic procedural grid generation.
- Tile prefab spawning.
- Initial tile state storage:
	- moisture
	- temperature
	- fertility
	- elevation
- Foundation for terrain evolution already exists in the tile model.

### Partially Implemented

- Terrain system exists conceptually but currently only contains:
	- Empty
	- Grass
- Tile interaction hooks exist but are disabled.
- Tile values exist but are not simulated.

### Missing Compared To GDD

- Simulation tick system.
- Terrain definitions.
- Terrain evolution rules.
- Terrain influence propagation.
- Essence generation.
- Harvesting gameplay.
- Card system.
- Player resources.
- Objectives.
- Expansion system.
- Run progression.
- Saveable game state.
- VR gameplay interactions.

## Recommended MVP Scope

Keep only:

- Plains
- Forest
- Lake
- Hills
- Mountain
- Volcano

Use only:

- Moisture
- Temperature
- Fertility
- Elevation

This matches the latest GDD and minimizes risk.

---

# Phase 1 - Core Data Model

Goal: create a stable simulation foundation.

## Create Terrain Definitions

Add:

- Plains
- Forest
- Lake
- Hills
- Mountain
- Volcano

Each terrain should define:

- Influence values
- Produced element
- Harvest amount
- Terrain score function

## Refactor Tile Data

Add:

- terrain type
- age
- pending essence

Move terrain logic out of components and into simulation code.

Deliverable:

World can represent all MVP terrain types.

---

# Phase 2 - Simulation System

Goal: make the world evolve.

## Create Simulation Tick Pipeline

Single tick:

1. Diffusion
2. Terrain influence
3. Age update
4. Terrain resolution
5. Essence generation

## Diffusion System

Spread:

- moisture
- temperature
- fertility

between neighboring tiles.

Keep elevation fixed.

## Terrain Influence System

Examples:

- Lake adds moisture.
- Forest adds fertility.
- Mountain increases nearby elevation pressure.
- Volcano adds temperature.

Deliverable:

Simulation can be stepped manually and visible changes occur.

---

# Phase 3 - Terrain Evolution

Goal: terrain emerges naturally.

Create scoring-based resolver.

Example:

- Lake prefers high moisture.
- Forest prefers moisture + fertility.
- Hills prefer medium elevation.
- Mountain prefers high elevation.
- Volcano prefers high elevation + high temperature.

Every tick:

- Evaluate all terrain scores.
- Select highest valid terrain.

Deliverable:

World transforms automatically.

---

# Phase 4 - Essence Economy

Goal: establish gameplay resources.

## Add Elements

- Fire
- Water
- Earth
- Air

## Terrain Production

- Volcano → Fire
- Lake → Water
- Mountain/Hills → Earth
- Forest/Plains → Air

## Essence Spawning

Terrain periodically generates collectable essence.

Deliverable:

World produces resources without cards.

---

# Phase 5 - Harvesting

Goal: first real VR interaction.

Implement:

- floating essence orb prefab
- grab interaction
- inventory storage

Deliverable:

Player can harvest and accumulate resources.

---

# Phase 6 - Card System

Goal: allow player influence.

## Data Driven Card Definition

Card contains:

- name
- cost
- target mode
- effect list

## Initial Cards

- Rain
- Heat Wave
- Fertile Soil
- Strong Winds
- Raise Land

Each card:

1. Apply effect.
2. Advance one simulation tick.

Deliverable:

First complete gameplay loop.

---

# Phase 7 - Objectives

Goal: create win/loss pressure.

Implement objective framework.

Start with:

- Create Forest
- Create Lake
- Create Volcano
- Harvest Element

Deliverable:

Players have goals.

---

# Phase 8 - Expansion System

Goal: enable long-term growth.

Start world:

- 7 tiles

Expansion:

- Add 2-3 connected tiles.
- Consume resources.

Expansion types:

- Fertile
- Highland
- Volcanic

Deliverable:

World reaches 30-50 tiles over a run.

---

# Phase 9 - VR UX

Implement:

- card hand
- tile hover highlight
- area previews
- card drag and release
- essence collection feedback

Deliverable:

Full VR gameplay flow.

---

# Phase 10 - Polish

Add:

- tile transitions
- terrain growth animations
- particles
- sounds
- objective rewards

---

## Cross-Cutting Technical Requirements

### Simulation Safety

- Use stable tick order and avoid read/write conflicts within the same tick.
- Clamp moisture, temperature, and fertility to defined ranges.
- Limit per-tick stat deltas to prevent runaway simulation values.
- Keep elevation immutable unless changed by explicit effects (e.g. Raise Land card).

### Spawn Lifecycle & Cleanup

- Despawn or recycle essence objects after collection.
- Reconcile spawned visuals when terrain changes.
- Clear or recycle all runtime-spawned objects on reset/restart.
- Prefer object pooling for high-frequency spawned prefabs.

---

# Suggested Development Order (Immediate)

1. Terrain definitions.
2. Simulation tick manager.
3. Terrain resolver.
4. Essence generation.
5. Harvesting.
6. Card framework.
7. Rain card.
8. Heat Wave card.
9. Objective system.
10. Expansion system.
11. VR interaction pass.
12. Polish.

## First Milestone

Success criteria:

- 7-tile world.
- Moisture, temperature, fertility, elevation simulation.
- Plains, Forest, Lake, Hills, Mountain, Volcano.
- Manual tick button.
- Terrain evolves automatically.

Once this milestone works, the rest of the game becomes content creation rather than new engine work.
