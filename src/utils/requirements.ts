import type { WizardState } from '../types';

export type RequirementStep = 'container' | 'product' | 'details' | 'closure' | 'production' | 'extras';

export interface RequirementRow {
  id: string;
  label: string;
  value: string;
  step: RequirementStep;
  clearUpdates: Partial<WizardState>;
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
    rows.push({
      id: 'containerType',
      label: 'Container Type',
      value: label(state.containerType),
      step: 'container',
      clearUpdates: { containerType: null },
    });
  }

  if (state.productType || includeUnspecified) {
    rows.push({
      id: 'productType',
      label: 'Product Type',
      value: label(state.productType),
      step: 'product',
      clearUpdates: { productType: null },
    });
  }

  if (state.hasChunks) {
    rows.push({
      id: 'hasChunks',
      label: 'Contains chunks/solids',
      value: 'Yes',
      step: 'product',
      clearUpdates: { hasChunks: false },
    });
  }
  if (state.isFoamy) {
    rows.push({
      id: 'isFoamy',
      label: 'Foamy product',
      value: 'Yes',
      step: 'product',
      clearUpdates: { isFoamy: false },
    });
  }
  if (state.isCombustible) {
    rows.push({
      id: 'isCombustible',
      label: 'Combustible/flammable (ATEX required)',
      value: 'Yes',
      step: 'product',
      clearUpdates: { isCombustible: false },
    });
  }
  if (state.industry) {
    rows.push({
      id: 'industry',
      label: 'Industry',
      value: label(state.industry),
      step: 'product',
      clearUpdates: { industry: null },
    });
  }

  if (state.fillVolumeMin !== null || state.fillVolumeMax !== null) {
    const min = state.fillVolumeMin ?? '—';
    const max = state.fillVolumeMax ?? '—';
    rows.push({
      id: 'fillVolume',
      label: 'Fill Volume',
      value: `${min} - ${max} ml`,
      step: 'details',
      clearUpdates: { fillVolumeMin: null, fillVolumeMax: null },
    });
  }

  if (state.containerType === 'pouch' && state.pouchStyle) {
    rows.push({
      id: 'pouchStyle',
      label: 'Pouch Style',
      value: state.pouchStyle === 'pre-made' ? 'Pre-made pouches' : 'Form Fill & Seal',
      step: 'details',
      clearUpdates: { pouchStyle: null },
    });
  }

  if (state.containerType === 'pouch' && state.hasSpouted) {
    rows.push({
      id: 'hasSpouted',
      label: 'Spouted pouches',
      value: 'Yes',
      step: 'details',
      clearUpdates: { hasSpouted: false },
    });
  }
  if (state.bottleMaterial) {
    rows.push({
      id: 'bottleMaterial',
      label: 'Container Material',
      value: state.bottleMaterial,
      step: 'details',
      clearUpdates: { bottleMaterial: null },
    });
  }

  if (state.containerType !== 'sachet') {
    if (!state.needsCapping) {
      rows.push({
        id: 'capping',
        label: 'Capping',
        value: 'Not needed',
        step: 'closure',
        clearUpdates: { needsCapping: true, closureType: null },
      });
    } else if (state.closureType || alwaysIncludeCapping) {
      rows.push({
        id: 'capping',
        label: 'Capping',
        value: label(state.closureType),
        step: 'closure',
        clearUpdates: { closureType: null },
      });
    }
  }

  if (state.throughputTarget) {
    rows.push({
      id: 'throughputTarget',
      label: 'Target Throughput',
      value: `${state.throughputTarget.toLocaleString()} units/hr`,
      step: 'production',
      clearUpdates: { throughputTarget: null },
    });
  }

  if (state.automationLevel) {
    rows.push({
      id: 'automationLevel',
      label: 'Automation',
      value: label(state.automationLevel),
      step: 'production',
      clearUpdates: { automationLevel: null },
    });
  }

  const extras: string[] = [];
  if (state.wantsNitrogen) extras.push('Nitrogen injection');
  if (state.wantsRinsing) extras.push('Container rinsing');
  if (state.wantsLabeling) extras.push('Labeling');
  if (state.wantsDatePrinting) extras.push('Date/lot printing');
  if (state.wantsHeated) extras.push('Heated components');
  if (extras.length > 0) {
    rows.push({
      id: 'extras',
      label: 'Extras',
      value: extras.join(', '),
      step: 'extras',
      clearUpdates: {
        wantsNitrogen: false,
        wantsRinsing: false,
        wantsLabeling: false,
        wantsDatePrinting: false,
        wantsHeated: false,
      },
    });
  }

  return rows;
}
