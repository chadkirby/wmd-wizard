import type { Machine, WizardState } from '../types';
import { getRequirementRows, label } from './requirements';

const SALES_EMAIL = 'SALES_CONTACT@wmdequipment.com'; // TODO: wire up real address

export function buildSummaryText(state: WizardState, matches: Machine[]): string {
  const requirementRows = getRequirementRows(state, {
    includeUnspecified: true,
    alwaysIncludeCapping: true,
  });

  const lines: string[] = [
    '=== WMD Equipment - Filling Machine Inquiry ===',
    '',
    '--- Requirements ---',
    '',
  ];

  requirementRows.forEach((row) => {
    lines.push(`${row.label}: ${row.value}`);
  });

  lines.push('');
  lines.push('--- Matched Machines ---');
  lines.push('');

  if (matches.length === 0) {
    lines.push('No standard machines matched all criteria. Custom solution may be needed.');
  } else {
    matches.forEach((m) => {
      lines.push(`• ${m.name} (${m.manufacturer})`);
      lines.push(`  ${m.throughputMin.toLocaleString()}-${m.throughputMax.toLocaleString()} units/hr | ${m.fillVolumeMin}-${m.fillVolumeMax} ml`);
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
  const subject = `Filling Machine Inquiry - ${label(state.containerType)} / ${label(state.productType)}`;
  const body = buildSummaryText(state, matches);

  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
