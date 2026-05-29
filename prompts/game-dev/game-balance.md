# Prompt — Game Balance Table Generator

**Platform:** Unity / Unreal Engine / Any  
**Category:** Game Development  
**Type:** one-shot

---

## Purpose

Generates a data-driven balance table (as a CSV or Markdown table) for game stats — enemies, weapons, levels, or economy. Includes formulas and a designer rationale for each value.

---

## Prompt

```
You are a senior game designer and systems designer. Generate a data-driven balance table
for the game stats described below.

Rules:
1. Output the table in both Markdown (for readability) and CSV (for import into Unity ScriptableObjects or a spreadsheet).
2. For each value, show the formula used (e.g., HP = base * (1 + level * 0.15)).
3. Include a DESIGN RATIONALE column explaining why each formula was chosen.
4. Flag any values that need playtesting — theory-craft values are a starting point, not truth.
5. Include a DIFFICULTY CURVE section describing how the numbers create a progression feel.

Game type: [e.g., mobile RPG, endless runner, tower defense, action platformer]
Entity to balance: [e.g., 10 enemy types, 5 weapon tiers, 8 levels]
Key stats: [list the stats, e.g., HP, Damage, Speed, Reward]
Constraints: [e.g., early enemies must die in 3-5 hits from a starting weapon; boss at level 10 should take 3 minutes to defeat]
```

---

## Example Usage

**What you paste:**
```
Game type: Mobile action RPG
Entity to balance: 5 enemy tiers (Minion → Elite → Mini-boss → Boss → Final Boss)
Key stats: HP, Attack Damage, Move Speed, XP Reward, Coin Drop (min/max)
Constraints:
- Player starting weapon does 25 damage.
- Minion should die in 3-5 hits.
- Final boss should take 90-120 seconds in a skilled fight.
- XP curve: player should level up every 10-15 enemies defeated in the same tier.
```

**Expected output:**
```
BALANCE TABLE: Enemy Tiers

| Tier | Name | HP | Attack DMG | Move Speed | XP Reward | Coin Drop |
|---|---|---|---|---|---|---|
| 1 | Minion | 75–100 | 8–10 | 3.0 m/s | 10 | 1–3 |
| 2 | Grunt | 200–250 | 15–20 | 2.8 m/s | 25 | 5–10 |
| 3 | Elite | 500–600 | 35–45 | 3.5 m/s | 60 | 15–25 |
| 4 | Mini-boss | 1,800 | 80 | 2.5 m/s | 200 | 50–80 |
| 5 | Final Boss | 12,000 | 150 | 2.0 m/s | 1,000 | 300–500 |

FORMULAS
--------
HP (Tier T): base_hp * multiplier^(T-1)
  Tier 1: 75–100 (starting player weapon = 25 dmg → 3–4 hits ✓)
  Tier 2: 100 * 2.3 ≈ 230 (weapon upgraded by Tier 2 to ~50 dmg → 4–5 hits)
  Tier 3: 230 * 2.3 ≈ 530 (weapon upgraded to ~120 dmg → 4–5 hits)
  Multiplier: 2.3x (aggressive scaling ensures enemies feel threatening at each tier)

Attack Damage: designed as % of player HP per hit at tier entry.
  Tier 1: ~5% player HP per hit (light threat, tutorial feel)
  Tier 5: ~20–25% player HP per hit (boss fight requires dodge skill)

Move Speed: intentionally non-monotonic. Elites are faster (3.5) to create urgency;
  bosses are slower (2.0) to allow pattern-reading in a prolonged fight.

XP Reward: XP_needed_to_level / enemies_to_level = 100 / 10 = 10 XP per Minion ✓

DIFFICULTY CURVE
----------------
Tier 1 (Minion): Die in 3–4 hits → player feels powerful, learns the combat loop.
Tier 2 (Grunt): Require weapon upgrade to kill efficiently → first progression gate.
Tier 3 (Elite): Speed increase + higher damage → dodge skill becomes important.
Tier 4 (Mini-boss): Long HP + high damage → first "boss fight" — teaches boss combat patterns.
Tier 5 (Final Boss): 12,000 HP at ~100 DPS peak player output ≈ 120 seconds ✓

PLAYTESTING FLAGS
-----------------
⚠ Tier 3 move speed (3.5 m/s): may feel too fast on mobile touch controls — test on device.
⚠ Final Boss HP: 90–120 seconds assumes player has fully upgraded weapon. 
  If players fight underleveled, fight will take 3–5 minutes — likely frustrating.
  Recommend: soft HP scaling based on player level (±20%).

CSV
---
Tier,Name,HP_Min,HP_Max,AttackDMG_Min,AttackDMG_Max,MoveSpeed,XP_Reward,Coin_Min,Coin_Max
1,Minion,75,100,8,10,3.0,10,1,3
2,Grunt,200,250,15,20,2.8,25,5,10
3,Elite,500,600,35,45,3.5,60,15,25
4,Mini-boss,1800,1800,80,80,2.5,200,50,80
5,Final Boss,12000,12000,150,150,2.0,1000,300,500
```

---

## Variations

- **Economy balance:** Replace entity stats with "in-app purchase pricing, currency drop rates, and gacha pull rates."
- **Level difficulty:** Replace enemy tiers with "10 levels — time limit, enemy count, obstacle density, and target score per level."
