import type { WizardState } from '../types';

export type RequirementStep = 'container' | 'product' | 'details' | 'closure' | 'production' | 'extras';

export interface RequirementRow {
  label: string;
  value: string;
  step: RequirementStep;
}

const LABELS: Record<string, string> = {
  bottle: 'Bottles / Jars',
  pouch: 'Pouches / Bags',
  sachet: 'Sachets',
  bucket: 'Buckets / Pails',
  liquid: 'Liquid',
  viscous: 'Semi-liquid / Viscous',
  dry: 'Dry',
  powder: 'Powder',
  screw: 'Screw Cap',
  ropp: 'ROPP Screw Cap',
  cork: 'Wine Cork',
  't-cork': 'T-Cork',
  'press-on': 'Press-on Cap',
  'twist-off': 'Twist-off Cap',
  dropper: 'Dropper',
  'heat-seal': 'Heat Sealed',
  'spout-cap': 'Spout Cap',
  none: 'No capping needed',
  semi: 'Semi-automatic OK',
  full: 'Fully automatic only',
  food: 'Food',
  beverage: 'Beverage',
  'wine-spirits': 'Wine & Spirits',
  cosmetics: 'Cosmetics',
  pharma: 'Pharmaceuticals',
  chemicals: 'Chemicals',
  'home-care': 'Home Care',
};

interface RequirementOptions {
  includeUnspecified?: boolean;
  alwaysIncludeCapping?: boolean;
}

export function label(key: string | null | undefined): string {
  if (!key) return 'Not specified';
  return LABELS[key] ?? key;
}

export function getRequirementRows(state: WizardState, options: RequirementOptions = {}): RequirementRow[] {
  const { includeUnspecified = false, alwaysIncludeCapping = false } = options;
  const rows: RequirementRow[] = [];

  if (state.containerType || includeUnspecified) {
    rows.push({ label: 'Container Type', value: label(state.containerType), step: 'container' });
  }

  if (state.productType || includeUnspecified) {
    rows.push({ label: 'Product Type', value: label(state.productType), step: 'product' });
  }

  if (state.hasChunks) rows.push({ label: 'Contains chunks/solids', value: 'Yes', step: 'product' });
  if (state.isFoamy) rows.push({ label: 'Foamy product', value: 'Yes', step: 'product' });
  if (state.isCombustible) {
    rows.push({
      label: 'Combustible/flammable (ATEX required)',
      value: 'Yes',
      step: 'product',
    });
  }
  if (state.industry) rows.push({ label: 'Industry', value: label(state.industry), step: 'product' });

  if (state.fillVolumeMin !== null || state.fillVolumeMax !== null) {
    const min = state.fillVolumeMin ?? '—';
    const max = state.fillVolumeMax ?? '—';
    rows.push({ label: 'Fill Volume', value: `${min} - ${max} ml`, step: 'details' });
  }

  if (state.containerType === 'pouch' && state.pouchStyle) {
    rows.push({
      label: 'Pouch Style',
      value: state.pouchStyle === 'pre-made' ? 'Pre-made pouches' : 'Form Fill & Seal',
      step: 'details',
    });
  }

  if (state.containerType === 'pouch' && state.hasSpouted) {
    rows.push({ label: 'Spouted pouches', value: 'Yes', step: 'details' });
  }
  if (state.bottleMaterial) rows.push({ label: 'Container Material', value: state.bottleMaterial, step: 'details' });

  if (state.containerType !== 'sachet') {
    if (!state.needsCapping) {
      rows.push({ label: 'Capping', value: 'Not needed', step: 'closure' });
    } else if (state.closureType || alwaysIncludeCapping) {
      rows.push({ label: 'Capping', value: label(state.closureType), step: 'closure' });
    }
  }

  if (state.throughputTarget) {
    rows.push({
      label: 'Target Throughput',
      value: `${state.throughputTarget.toLocaleString()} units/hr`,
      step: 'production',
    });
  }

  if (state.automationLevel) {
    rows.push({ label: 'Automation', value: label(state.automationLevel), step: 'production' });
  }

  const extras: string[] = [];
  if (state.wantsNitrogen) extras.push('Nitrogen injection');
  if (state.wantsRinsing) extras.push('Container rinsing');
  if (state.wantsLabeling) extras.push('Labeling');
  if (state.wantsDatePrinting) extras.push('Date/lot printing');
  if (state.wantsHeated) extras.push('Heated components');
  if (extras.length > 0) {
    rows.push({ label: 'Extras', value: extras.join(', '), step: 'extras' });
  }

  return rows;
}
