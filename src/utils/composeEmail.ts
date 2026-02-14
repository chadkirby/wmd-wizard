import type { Machine, WizardState } from '../types';

const SALES_EMAIL = 'SALES_CONTACT@wmdequipment.com'; // TODO: wire up real address

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

function label(key: string | null | undefined): string {
  if (!key) return 'Not specified';
  return LABELS[key] ?? key;
}

export function buildSummaryText(state: WizardState, matches: Machine[]): string {
  const lines: string[] = [
    '=== WMD Equipment — Filling Machine Inquiry ===',
    '',
    '--- Requirements ---',
    '',
    `Container Type: ${label(state.containerType)}`,
    `Product Type: ${label(state.productType)}`,
  ];

  if (state.hasChunks) lines.push('Contains chunks/solids: Yes');
  if (state.isFoamy) lines.push('Foamy product: Yes');
  if (state.isCombustible) lines.push('Combustible/flammable (ATEX required): Yes');
  if (state.industry) lines.push(`Industry: ${label(state.industry)}`);

  lines.push('');

  if (state.fillVolumeMin !== null || state.fillVolumeMax !== null) {
    const min = state.fillVolumeMin ?? '—';
    const max = state.fillVolumeMax ?? '—';
    lines.push(`Fill Volume: ${min} – ${max} ml`);
  }

  if (state.containerType === 'pouch' && state.pouchStyle) {
    lines.push(`Pouch Style: ${state.pouchStyle === 'pre-made' ? 'Pre-made pouches' : 'Form Fill & Seal'}`);
    if (state.hasSpouted) lines.push('Spouted pouches: Yes');
  }

  if (state.bottleMaterial) lines.push(`Container Material: ${state.bottleMaterial}`);

  lines.push(`Capping: ${state.needsCapping ? label(state.closureType) : 'Not needed'}`);

  if (state.throughputTarget) lines.push(`Target Throughput: ${state.throughputTarget.toLocaleString()} units/hr`);
  if (state.automationLevel) lines.push(`Automation: ${label(state.automationLevel)}`);

  const extras: string[] = [];
  if (state.wantsNitrogen) extras.push('Nitrogen injection');
  if (state.wantsRinsing) extras.push('Container rinsing');
  if (state.wantsLabeling) extras.push('Labeling');
  if (state.wantsDatePrinting) extras.push('Date/lot printing');
  if (state.wantsHeated) extras.push('Heated components');
  if (extras.length > 0) {
    lines.push(`Extras: ${extras.join(', ')}`);
  }

  lines.push('');
  lines.push('--- Matched Machines ---');
  lines.push('');

  if (matches.length === 0) {
    lines.push('No standard machines matched all criteria. Custom solution may be needed.');
  } else {
    matches.forEach((m) => {
      lines.push(`• ${m.name} (${m.manufacturer})`);
      lines.push(`  ${m.throughputMin.toLocaleString()}–${m.throughputMax.toLocaleString()} units/hr | ${m.fillVolumeMin}–${m.fillVolumeMax} ml`);
      lines.push(`  ${m.url}`);
      lines.push('');
    });
  }

  lines.push('--- Contact Information ---');
  lines.push('');
  if (state.contactName) lines.push(`Name: ${state.contactName}`);
  if (state.contactCompany) lines.push(`Company: ${state.contactCompany}`);
  if (state.contactEmail) lines.push(`Email: ${state.contactEmail}`);
  if (state.contactPhone) lines.push(`Phone: ${state.contactPhone}`);
  if (state.contactNotes) lines.push(`Notes: ${state.contactNotes}`);

  return lines.join('\n');
}

export function buildMailtoUrl(state: WizardState, matches: Machine[]): string {
  const subject = `Filling Machine Inquiry — ${label(state.containerType)} / ${label(state.productType)}`;
  const body = buildSummaryText(state, matches);

  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
