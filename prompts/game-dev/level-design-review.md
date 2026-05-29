# Prompt — Level Design Review

**Platform:** Unity / Unreal Engine / Any  
**Category:** Game Development  
**Type:** one-shot

---

## Purpose

Reviews a level design brief for pacing, player experience, difficulty curve, and teachable moments. Returns structured feedback with specific suggestions for each section of the level.

---

## Prompt

```
You are a senior level designer and game designer. Review the level design brief below.

Evaluate:
1. PACING — does the level breathe? Are there peaks (combat/challenge), valleys (exploration/rest), and climaxes (boss/puzzle)?
2. PLAYER GUIDANCE — how does the player know where to go? Are there landmarks, lighting cues, or environmental storytelling?
3. DIFFICULTY CURVE — does the level teach mechanics before testing them? Are new mechanics introduced safely then escalated?
4. TEACHABLE MOMENTS — what does the player learn in this level that they'll use later?
5. FLOW STATE — are there sections likely to cause frustration (too hard), boredom (too easy/long), or confusion (unclear objective)?
6. RISK / REWARD — are exploration and off-path discoveries rewarded? Are checkpoints placed fairly?
7. REPLAYABILITY — what changes on a second playthrough?

Output a section-by-section review, then an overall assessment with a priority list of changes.

Game genre: [e.g. mobile platformer, 3D action RPG, puzzle game, FPS]
Level brief:
[DESCRIBE THE LEVEL — include: setting, sections, enemies/obstacles, puzzles, story beats, length estimate]
```

---

## Example Usage

**What you paste:**
```
Game genre: 3D action platformer (mobile)
Level brief:
Level 3 — Ancient Ruins (estimated 8-10 minutes)
Section 1: Player enters a crumbling courtyard. Two basic enemies patrol. Player must reach a lever that opens the gate. Lever is visible from the start.
Section 2: Moving platform section over a lava pit. 5 platforms, no enemies. First time moving platforms appear in the game.
Section 3: Small arena fight — 3 basic enemies + 1 shield enemy (new type). Shield enemy blocks frontal attacks, must be hit from behind.
Section 4: A narrow bridge leading to the level boss. A single heavy enemy blocks the path.
Boss: A large armored knight. Phase 1: frontal attacks only. Phase 2 (50% HP): starts circling and attacking from sides.
```

**Expected output:**
```
LEVEL DESIGN REVIEW — Level 3: Ancient Ruins

SECTION 1 — Courtyard
Rating: Good
The lever being visible from the start is excellent environmental guidance — players can
see the goal immediately. The two patrolling enemies serve as a warm-up after the
inter-level transition. No issues.
Suggestion: Add a visual cue (light beam, color) on the lever to draw the eye further,
since this is still early in the game and players may not yet scan for interactive objects.

SECTION 2 — Moving Platforms
Rating: Needs Adjustment
CRITICAL PACING ISSUE: The moving platform section is the first time platforms appear.
Introducing a new mechanic over instant-death lava with no safe landing zone creates
frustration before mastery. Players who fail will respawn at the section start and face
the same immediate death risk — no learning opportunity.
Recommendations:
1. Add a "safe" version of one moving platform before the lava section — same mechanic,
   but falling only costs a small HP amount (not instant death).
2. Make the first 1–2 platforms slower, then speed them up mid-section.
3. Place a checkpoint at the platform section entry.

SECTION 3 — Arena Fight with Shield Enemy
Rating: Good (with one caveat)
The shield enemy introduction is well-structured for teaching: 3 familiar enemies first,
then the new type. Players learn the "hit from behind" mechanic under pressure but not
extreme pressure.
Caveat: If the arena is small, players may accidentally stumble into the correct solution
without understanding why. Add a brief environmental cue — maybe a mural or another
dead shield enemy with an arrow in its back — that hints at the weakness.

SECTION 4 — Bridge with Heavy Enemy
Rating: Weak
The narrow bridge fight with a single heavy enemy after the arena provides no escalation.
It feels like a speed bump, not a climax before the boss. Players may be low on resources
here and frustrated by another combat encounter without a rest beat.
Recommendation: Replace with a short traversal section (no combat) as a "breath" before
the boss fight. This contrast makes the boss feel more impactful. OR make the heavy enemy
optional — a blocking path the player can bypass with a platforming route — rewarding
skilled players.

BOSS — Armored Knight
Rating: Good Structure, Mobile Controls Risk
Phase 1 (frontal only) → Phase 2 (circling) is a textbook escalation pattern. The mechanic
mirrors the shield enemy from Section 3 — excellent callback.
Mobile risk: Phase 2 requires tracking an enemy that circles. On mobile touch controls,
camera rotation during combat is difficult. Recommend: lock the camera to a top-down or
fixed isometric view during the boss fight, or auto-rotate the camera to face the enemy.

OVERALL ASSESSMENT
------------------
Strengths: Good goal visibility, excellent shield enemy introduction, boss design callbacks.
Priority fixes:
1. [HIGH] Moving platform section — add safe preview platform + checkpoint before lava.
2. [MEDIUM] Bridge section — replace with a rest beat before boss.
3. [LOW] Section 3 shield hint — environmental teaching aid.
4. [MEDIUM] Boss camera — test mobile camera control during Phase 2.

PACING DIAGRAM:
Section 1 [LOW] → Section 2 [HIGH] → Section 3 [HIGH] → Section 4 [MEDIUM] → Boss [HIGH]
Current: No valley between S2 and Boss — fatigue risk on mobile (short sessions).
Ideal:   Section 1 [LOW] → S2 [HIGH] → S3 [HIGH] → Bridge REST [LOW] → Boss [HIGH]
```

---

## Variations

- **Mobile casual game:** Add "Focus on session length (target: 2-3 minutes per level), one-tap controls, and immediate visual feedback."
- **Puzzle game:** Add "Focus on the 'aha moment' — does the puzzle teach the solution within itself? Is the difficulty telegraphed?"
