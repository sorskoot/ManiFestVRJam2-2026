# Elemental Echoes (Working Title)

## High Concept

A cozy, roguelike hex-grid world builder for VR where the player does
not directly place biomes, but manipulates elemental forces that allow
landscapes to emerge naturally.

**Theme:** Elemental

**Genre:** Cozy simulation / strategy / roguelike

**Platform:** VR (Wonderland Engine)

**Target Session:** 15--30 minutes

------------------------------------------------------------------------

# Core Fantasy

> You are an ancient spirit guiding the growth of a living world.

The player influences nature through elemental cards instead of placing
forests, rivers or mountains directly. Small actions cascade into large
ecological changes.

------------------------------------------------------------------------

# Pillars

-   Cozy and relaxing
-   Emergent gameplay
-   Simple rules, surprising outcomes
-   Highly replayable
-   Minimal art scope

------------------------------------------------------------------------

# Gameplay Loop

1.  Draw a hand of elemental cards.
2.  Place a card on the hex map.
3.  Immediate elemental effects are applied.
4.  Run several world simulation ticks.
5.  Watch the world evolve.
6.  Complete objectives.
7.  Earn new cards.
8.  Continue until the deck is exhausted or the run ends.

------------------------------------------------------------------------

# World Model

Each hex stores simulation values instead of only a terrain type.

``` csharp
Cell
{
    float Heat;
    float Moisture;
    float Life;
    float Stone;
    float Wind;

    int Age;
    TerrainType Terrain;
}
```

Terrain is derived from the underlying values.

------------------------------------------------------------------------

# Element Values

-   Heat
-   Moisture
-   Life
-   Stone
-   Wind

Optional later: - Energy - Cold

------------------------------------------------------------------------

# Terrain Types (Initial)

-   Ocean
-   Lake
-   River
-   Beach
-   Grassland
-   Forest
-   Ancient Forest
-   Desert
-   Mountain
-   Volcano
-   Swamp
-   Snow
-   Ice
-   Hills
-   Plains

------------------------------------------------------------------------

# Simulation

Each simulation tick consists of:

1.  Diffuse elemental values to neighboring cells.
2.  Apply terrain emissions.
3.  Age terrain.
4.  Recalculate terrain from current values.
5.  Check objectives and scoring.

Example emissions:

  Terrain    Emits
  ---------- -----------------
  Mountain   Stone
  Lake       Moisture
  Forest     Life + Moisture
  Volcano    Heat + Stone
  Desert     Heat

------------------------------------------------------------------------

# Example Terrain Rules

Forest: - High Life - Medium Moisture - Low Heat

Desert: - High Heat - Low Moisture

Mountain: - Very High Stone

Swamp: - High Moisture - Medium Life

Volcano: - High Heat - High Stone

------------------------------------------------------------------------

# Cards

Cards nudge the simulation rather than placing terrain.

Examples:

## Spring Rain

-   Moisture in radius

## Heat Wave

-   Heat

## Fertile Soil

-   Life

## Earthquake

Increase Stone, lower Life

## Strong Winds

Move elemental values downwind

## Meteor Strike

Large Heat and Stone burst

------------------------------------------------------------------------

# Objectives

Each run generates objectives such as:

-   Grow 5 Forest tiles
-   Create the longest river
-   Form 2 Volcanoes
-   Reach 10 Ancient Forests
-   Maintain a balanced ecosystem
-   Connect mountains to the sea

Completing objectives awards new cards or score.

------------------------------------------------------------------------

# Roguelike Progression

Runs feature:

-   Random starting map
-   Random objective set
-   Random card rewards
-   Increasingly difficult objectives

Potential meta progression:

-   Unlock new cards
-   New terrain types
-   New world modifiers

------------------------------------------------------------------------

# VR Interaction

-   Grab a card from the hand.
-   Hover above the board.
-   Preview affected cells.
-   Release to play.
-   Watch the world animate for several simulation ticks.

The player mainly interacts with a tabletop world.

------------------------------------------------------------------------

# Art Direction

Low-poly, colorful, cozy.

Inspirations: - Preserve - Dorfromantik - TerraCards

Use simple hex tiles with lightweight animations and color transitions.

------------------------------------------------------------------------

# Technical Architecture

Systems:

-   Card System
-   Diffusion System
-   Terrain Emission System
-   Biome Resolver
-   Growth System
-   Objective System
-   Rendering System

Simulation and rendering should remain separated.

------------------------------------------------------------------------

# Stretch Goals

-   Seasons
-   Animals
-   Villages
-   Dynamic weather
-   Spirit companions
-   Endless mode

------------------------------------------------------------------------

# Out of Scope (Game Jam)

-   Multiplayer
-   Complex resource economy
-   NPC AI
-   Story campaign
-   Hundreds of cards

------------------------------------------------------------------------

# MVP

Must Have:

-   Hex grid
-   5 elemental values
-   10 cards
-   12 terrain types
-   Simulation loop
-   Objectives
-   End-of-run score

If the MVP is complete and enjoyable, polish visuals and add additional
cards rather than expanding the simulation.

# Core Gameplay Loop

The game is built around a simple but satisfying loop:

> **Shape the world → Watch it evolve → Harvest elemental essence → Spend essence on cards → Repeat**

Unlike traditional tile placement games, the player does not directly build forests, rivers or mountains. Instead, they influence the underlying elemental forces of the world. The landscape evolves naturally over time as a result of those influences.

The game is fully turn-based. Every action advances the world by exactly one simulation tick, allowing players to carefully observe the consequences of every decision.

## Turn Structure

Each turn consists of the following steps:

1. Player is shown 4 random cards from their deck.
2. Collect generated elements.
3. Player selects a card to play.
4. Player selects a tile to apply the card's effects to.
5. Changes are applied to the tile.
6. When the player is done, they end their turn
7. The world advances by applying the new simulation values to the terrain.
8. Played cards are removed from the deck.
9. Non-played cards are placed aside.
10. If there are more cards in the deck, the player starts again at step 1.
11. When all cards are played and there cards not played yet, the played cards return to the deck and are dealt again.
12. When the deck is empty or if the player is not about to play any more cards, the player is shown 2 special cards to choose from.
13. The chosen card is added to the deck and the rest of the deck is randomized and dealt again.
14. If the player has not completed the objective, the run ends.


This slow pace encourages experimentation and creates a relaxing, "gardening" style of gameplay.

---

# The Four Elements

The four classical elements are the primary resources used by the player.

* 🔥 Fire
* 💧 Water
* 🌍 Earth
* 🌪 Air

These are **not** the values used by the world simulation. Instead, they are the player's resource economy.

Elements are spent to play cards and are earned by harvesting the world.

Example:

* Volcanoes generate Fire.
* Lakes generate Water.
* Mountains generate Earth.
* Windy plains or high ridges generate Air.

The player must carefully manage these limited resources throughout a run.

---

# Hidden World Simulation

Behind the scenes, every tile stores a small number of environmental values.

Example values:

* Moisture
* Temperature
* Fertility
* Elevation

Players never directly interact with these values.

Cards modify these values, while terrain contributes small influences to nearby tiles. At the end of each turn, every tile evaluates its current conditions to determine whether it should change or gain new features.

This allows the world to evolve organically without requiring hundreds of handcrafted interaction rules.

---

# Terrain Evolution

Terrain represents the visible state of the world.

Players do **not** place terrain directly.

Instead, terrain emerges from the hidden environmental simulation.

For example:

* Increasing Moisture may create lakes.
* Fertile, wet land may become forest.
* High Elevation combined with high Temperature may create volcanoes.
* Cold mountain peaks may gain snow.

The goal is for players to think in terms of cause and effect rather than memorizing recipes.

> "If I bring rain to these mountains, I might create a river."

instead of

> "Forest requires Moisture > 7."

---

# Harvesting

Terrain slowly produces elemental essence over time.

When essence is ready, it appears visually above the terrain as a glowing collectible.

Examples:

* 🔥 Ember above a Volcano
* 💧 Droplet above a Lake
* 🌍 Crystal above a Mountain
* 🌪 Swirling breeze above a Windy Plain

The player physically reaches out in VR and harvests the essence.

Harvested essence is stored in the player's elemental reserves and can immediately be used to play new cards.

Harvesting creates a tactile interaction that encourages players to inspect and care for the world they are creating.

---

# Cards

Cards are the primary way the player influences the simulation.

Each card:

* Has an elemental cost.
* Applies one or more environmental effects.
* Advances the world by one simulation tick.

Example cards:

* Rain
* Heat Wave
* Raise Land
* Strong Winds
* Fertile Soil
* Wildfire
* Flood
* Frost

Cards never directly create terrain. Instead, they manipulate the underlying environmental conditions that allow terrain to emerge naturally.

---

# Objectives

The game is divided into short rounds.

After a fixed number of turns, the player must complete an objective in order to continue.

Example objectives:

* Grow 8 Forest tiles.
* Harvest 20 Water essence.
* Create a Volcano.
* Connect a Mountain to a Lake with a River.
* Maintain three different biome types.

Completing an objective rewards the player with a choice of new cards, allowing each run to develop differently.

Failure to complete an objective ends the run.

---

# Win & Lose Conditions

The player loses when they are unable to continue shaping the world.

Examples include:

* Insufficient elemental essence to play any remaining cards.
* Failure to complete an objective before the round ends.

Success comes from building a self-sustaining ecosystem that continuously generates the elemental resources needed to keep expanding and transforming the landscape.

The core strategic challenge is balancing immediate resource needs against long-term ecological growth. Players who create healthy, diverse environments will naturally gain access to more elemental essence, more strategic options, and more powerful combinations.

# World Expansion

The world starts as a small island of approximately **7–10 hexes**. This provides enough terrain to make meaningful decisions immediately while leaving plenty of room for growth.

The world does **not** expand automatically.

Expansion is a strategic choice made by the player through special **Expansion Cards**.

## Expansion Philosophy

Expanding the world is an investment rather than a reward.

A larger world allows:

* More terrain to evolve.
* More elemental essence to be harvested.
* More opportunities to complete objectives.

However, expansion is expensive and competes with other uses for elemental resources.

The player must constantly decide between:

* Investing in the future by expanding.
* Improving the existing ecosystem.
* Saving resources for objectives.

Because every expansion increases future production, expansion costs should increase throughout the run.

The intended end-game is not that the ecosystem collapses, but that the player eventually cannot generate enough elemental essence to continue expanding and playing cards efficiently.

An average successful run should end with a world of roughly **30–50 tiles**.

---

# Expansion Cards

Expansion cards are rare and valuable.

They are primarily rewarded after completing major objectives.

Each expansion adds a **small connected group of 2–3 hexes** to the edge of the existing world.

The player chooses where to attach the new land.

Different expansion cards create different starting terrain and encourage different play styles.

## Fertile Expansion

**Cost**

* 🌍 Earth ×2
* 💧 Water ×2

**Adds**

* 3 Plains

Designed to rapidly grow forests and fertile ecosystems.

---

## Highland Expansion

**Cost**

* 🌍 Earth ×4
* 🌪 Air ×2

**Adds**

* 1 Mountain
* 2 Hills

Excellent Earth production and the source of future rivers.

---

## Volcanic Expansion

**Cost**

* 🔥 Fire ×4
* 🌍 Earth ×3

**Adds**

* 1 Volcano
* 2 Rocky tiles

High Fire production with increased ecological risk.

---

## Coastal Expansion

**Cost**

* 💧 Water ×4
* 🌪 Air ×2

**Adds**

* 1 Lake
* 2 Wet Plains

Strong Water generation and ideal for fertile biomes.

---

# Expansion Cost Scaling

Every expansion permanently increases the cost of future expansion.

Example progression:

| Expansion | Additional Cost |
| --------- | --------------: |
| 1         |              +0 |
| 2         |  +1 Any Element |
| 3         | +2 Any Elements |
| 4         | +3 Any Elements |
| 5         | +4 Any Elements |

This keeps the world growing steadily while preventing unlimited expansion.

Balancing note: the exact scaling will be tuned through playtesting.

---

# Terrain

Terrain is the visible state of the world.

Terrain generates elemental essence and influences nearby tiles through the hidden simulation.

The player never directly places terrain (except through Expansion Cards).

## MVP Terrain List

### Plains

* Default terrain
* Moderate Fertility
* Produces a small amount of 🌪 Air

### Forest

* Requires Moisture + Fertility
* Produces 🌪 Air
* Improves nearby Fertility

### Ancient Forest

* Mature version of Forest
* Produces additional 🌪 Air
* Strong ecological influence

### Lake

* Produces 💧 Water
* Increases nearby Moisture

### River

* Connects Mountains to Lakes
* Produces 💧 Water
* Improves nearby Fertility

### Hills

* Produces 🌍 Earth
* Moderate Elevation influence

### Mountain

* Produces 🌍 Earth
* Strong Elevation influence

### Volcano

* Produces 🔥 Fire
* Increases nearby Temperature

### Desert

* Produces small amounts of 🔥 Fire
* High Temperature
* Low Fertility

### Swamp

* Produces 💧 Water
* High Moisture
* High Fertility

### Snow

* Mountain variant
* Cold climate
* Limited production

### Grassland

* Transitional fertile terrain
* Slight 🌪 Air production
* Can evolve into Forest

---

# Elemental Essence

The four classical elements are the player's primary resources.

* 🔥 Fire
* 💧 Water
* 🌍 Earth
* 🌪 Air

Terrain periodically creates elemental essence.

When ready, a glowing elemental orb appears above the terrain.

The player physically harvests the essence in VR by grabbing it.

Harvested essence is stored in the player's elemental reserve and is spent to play cards.

Harvesting is intended to be one of the core tactile interactions of the game.

---

# Card Categories

Cards are divided into two categories.

## World Cards

These manipulate the hidden environmental simulation.

Example cards:

* Rain
* Heat Wave
* Fertile Soil
* Strong Winds
* Raise Land
* Frost
* Wildfire
* Flood

## Expansion Cards

These permanently grow the world.

Expansion cards are much rarer and require significantly more elemental essence.

---

# MVP Card List

## Rain

**Cost:** 💧 Water ×1

Increases Moisture in a small area.

---

## Heat Wave

**Cost:** 🔥 Fire ×1

Raises Temperature.

---

## Fertile Soil

**Cost:** 🌍 Earth ×1

Increases Fertility.

---

## Strong Winds

**Cost:** 🌪 Air ×1

Moves moisture and spreads environmental influence.

---

## Raise Land

**Cost:** 🌍 Earth ×2

Increases Elevation on one tile.

---

## Wildfire

**Cost:** 🔥 Fire ×2

Strong Temperature increase with reduced Fertility.

---

## Flood

**Cost:** 💧 Water ×2

Greatly increases Moisture across multiple tiles.

---

## Frost

**Cost:** 🌪 Air ×1 + 💧 Water ×1

Reduces Temperature and may create Snow.

---

## Nature's Balance

**Cost:** 🔥💧🌍🌪 (1 of each)

Small increase to all environmental values in an area.

---

## Expansion Card (Reward)

Chosen after major objectives.

Allows the player to permanently expand the world.

---

# Development Order

To minimize risk during the game jam, implementation should follow this order:

1. Hex grid and tile placement.
2. Hidden simulation values (Moisture, Temperature, Fertility, Elevation).
3. Terrain evolution rules.
4. Element harvesting.
5. Card system.
6. Objectives.
7. Expansion cards.
8. Visual polish and additional content.

The goal is to achieve a fun gameplay loop as early as possible. New terrain types, cards and objectives should primarily be added as data rather than requiring new gameplay systems.

Start with just:
- Plains
- Forest
- Lake
- Hills
- Mountain
- Volcano