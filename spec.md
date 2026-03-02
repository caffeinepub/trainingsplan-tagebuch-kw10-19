# Trainingsplan & Tagebuch KW10-19

## Current State

The app has a 3-day training plan (Monday, Wednesday, Saturday) with the following sessions:
- Monday: Endurance run, 55 min
- Wednesday: Strength training (Core, Legs, Shoulders)
- Saturday: Combination (Cycling 60 min + Strength)

Backend `Day` type supports: `#monday`, `#wednesday`, `#saturday`.

WHO stats show 115 min endurance + 2 strength days per week.

## Requested Changes (Diff)

### Add
- 4th training day: Sunday – Full-body Calisthenics 60 min
- Backend `Day` variant `#sunday`

### Modify
- Monday: change from 55 min to 60 min endurance run
- Wednesday: rename to Ganzkörpertraining Calisthenics 60 min (full-body calisthenics)
- Saturday: Kombi – Jogging + Ganzkörpertraining Calisthenics (replace cycling with jogging)
- WHO stats updated: 120 min (Mon 60) + 60 min combo (Sat) = ~120 min endurance + 3 strength days

### Remove
- Nothing removed

## Implementation Plan

1. Regenerate backend with updated `Day` type including `#sunday`
2. Update `trainingData.ts`:
   - Monday: Ausdauer-Lauf 60 min
   - Wednesday: Ganzkörpertraining Calisthenics 60 min (Kraft)
   - Saturday: Kombi – Joggen 30 min + Ganzkörpertraining Calisthenics (Kombination)
   - Sunday: Ganzkörpertraining Calisthenics 60 min (Kraft)
3. Update WHO_STATS to reflect new totals (≥150 min Ausdauer mittlere Intensität + 3 Krafttage)
