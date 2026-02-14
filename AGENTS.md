# WMD Filling Machine Wizard — AGENTS.md

## Project Overview

A step-by-step wizard/form that walks prospective buyers through selecting the right filling machine from WMD Equipment's catalog of 16 machines. As the user enters information (container type, product characteristics, volume, throughput, etc.), the list of matching machines updates in real-time. The final step collects contact info and generates an email to a WMD sales rep.

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- Static site — no backend, no routing library
- `mailto:` link for email composition (no server-side email)

## Architecture

### Data Flow

```
WizardState (useWizardState hook)
  ├── User selections from each step
  ├── filterMachines(state, allMachines) → matchedMachines
  └── getAccessories(state, allMachines) → accessories
```

### Key Files

| File | Purpose |
|------|---------|
| `src/types.ts` | All TypeScript interfaces: `Machine`, `WizardState`, union types for container/product/closure |
| `src/data/machines.ts` | All 16 machine profiles as typed data objects with filtering attributes |
| `src/utils/filterMachines.ts` | Pure function: `(WizardState, Machine[]) → Machine[]` — progressive AND filtering |
| `src/utils/composeEmail.ts` | Builds summary text and `mailto:` URL from wizard state + matched machines |
| `src/hooks/useWizardState.ts` | Central state hook: all form state, step navigation, computed matches |
| `src/components/Wizard.tsx` | Top-level layout: header, progress bar, step routing, sidebar/bottom-sheet |
| `src/components/steps/*.tsx` | One component per wizard step (7 steps, sachet skips closure step) |
| `src/components/MachineResults.tsx` | Responsive results panel: desktop sidebar + mobile floating badge/bottom sheet |
| `src/components/MachineCard.tsx` | Individual machine result card (full and compact variants) |

### Wizard Steps

| Step | Component | Required? | What it filters |
|------|-----------|-----------|-----------------|
| 0 - Container | `ContainerStep` | Yes (must select) | `containerTypes` |
| 1 - Product | `ProductStep` | Yes (must select type) | `productTypes`, `handlesChunks`, `atexAvailable` |
| 2 - Details | `DetailsStep` | No | `fillVolumeRange`, `pouchSubtype` |
| 3 - Closure | `ClosureStep` | No (skipped for sachets) | `closureTypes` |
| 4 - Production | `ProductionStep` | No | `throughputRange`, `automationLevel` |
| 5 - Extras | `ExtrasStep` | No | Not hard-filtered; included in email |
| 6 - Results | `ResultsStep` | N/A | Contact form + matched machines + email actions |

### Machine Data Schema

Each machine in `src/data/machines.ts` has these key filtering fields:

```typescript
{
  containerTypes: ContainerType[];     // which containers it handles
  productTypes: ProductType[];         // liquid, viscous, dry, powder
  handlesChunks: boolean;              // can it do salsa/fruit filling?
  handlesFoamy: boolean;               // diving nozzle option?
  atexAvailable: boolean;              // explosion-proof option?
  closureTypes: ClosureType[];         // what caps/closures it supports
  fillVolumeMin/Max: number;           // ml range
  throughputMin/Max: number;           // units/hr range
  automationLevel: 'semi' | 'full';
  isAccessory: boolean;                // e.g., rinser shown as add-on
}
```

### Filtering Logic (`filterMachines.ts`)

Progressive AND filtering — each wizard step's selections further narrow the list:

1. Accessories are always excluded from primary results (shown as "add-ons")
2. Container type must match
3. Product type must match (viscous can run on liquid-capable machines)
4. Chunks/combustible flags hard-filter
5. Fill volume checks range overlap
6. Pouch style (pre-made vs FFS) filters pouch machines
7. Closure type must be in machine's `closureTypes`
8. Throughput uses flexible matching (machine max >= 50% of target)
9. Semi-auto machines excluded when "fully automatic" is selected

## Responsive Design

- **Mobile (<640px)**: Full-width wizard, one step at a time, floating badge shows match count, tapping it opens bottom sheet
- **Desktop (>=1024px)**: Two-column — wizard on left (60%), live results sidebar on right (40%)

## Development

```bash
npm install
npm run dev     # dev server at localhost:5173
npm run build   # static output in dist/
```

## TODO / Future Work

- [ ] Wire up real sales email address (currently `SALES_CONTACT@wmdequipment.com` in `src/utils/composeEmail.ts`)
- [ ] Add animations/transitions when machines appear/disappear from results
- [ ] Add machine images/photos to cards
- [ ] Consider adding a "back to all machines" reset button
- [ ] Add product examples per machine (e.g., "perfect for hot sauce, salsa")
- [ ] Deploy to Cloudflare Pages
- [ ] Add form validation on the contact step before allowing email send
- [ ] Consider a "budget range" field
- [ ] Add unit tests for filterMachines logic
- [ ] Consider making the PRIMA rinser suggestion smarter (only when rinsing is checked, or always for bottles)

## Source Data

Machine data was derived from the product description files in `../wmd-products/`. Each `.md` and `.pdf` file describes one machine with specs, options, and pricing. The 16 machines span:

- **Rinsers**: PRIMA (ViMEG)
- **Pouch fillers**: Tenco Pouch, NGB, R10-R12, ETNA-L sachet
- **Bottle fillers**: FC 1-4, FC 12-30, Semi-Auto Monoblock, Linear 2-4, Linear 4-6, Line 6-40
- **Bucket fillers**: Bucket Filler
- **Compact fillers**: Compact Filler & Capper (Tenco)
- **Wine/spirits**: Vi500 4-1V, Vi500 4-1T-1V, Vi500 4-1S-1V (ViMEG)
