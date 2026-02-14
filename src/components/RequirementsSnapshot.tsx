import { useMemo, useState } from 'react';
import type { WizardState } from '../types';
import type { RequirementRow, RequirementStep } from '../utils/requirements';
import { getRequirementRows } from '../utils/requirements';

interface RequirementsSnapshotProps {
  state: WizardState;
  onStepClick: (index: number) => void;
  onClearRequirement: (row: RequirementRow) => void;
}

function buildStepOrder(containerType: WizardState['containerType']): RequirementStep[] {
  if (containerType === 'sachet') {
    return ['container', 'product', 'details', 'production', 'extras'];
  }

  return ['container', 'product', 'details', 'closure', 'production', 'extras'];
}

export function RequirementsSnapshot({ state, onStepClick, onClearRequirement }: RequirementsSnapshotProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const rows = useMemo(() => getRequirementRows(state), [state]);
  const stepOrder = useMemo(() => buildStepOrder(state.containerType), [state.containerType]);

  const jumpToStep = (step: RequirementStep) => {
    const targetIndex = stepOrder.indexOf(step);
    if (targetIndex >= 0) onStepClick(targetIndex);
  };

  if (rows.length === 0) {
    return (
      <div className="pb-3">
        <p className="text-xs text-gray-500">Selections will appear here as you move through the wizard.</p>
      </div>
    );
  }

  const mobileSummary = rows
    .slice(0, 2)
    .map((row) => `${row.label}: ${row.value}`)
    .join(' | ');

  return (
    <div className="pb-3 space-y-2">
      <div className="hidden sm:flex items-center gap-2 flex-wrap">
        {rows.map((row) => (
          <div
            key={row.id}
            className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs"
          >
            <button
              onClick={() => jumpToStep(row.step)}
              className="px-2.5 py-1 hover:bg-blue-100 transition-colors rounded-l-full"
            >
              <span className="font-semibold">{row.label}:</span> {row.value}
            </button>
            <button
              onClick={() => onClearRequirement(row)}
              className="px-1.5 py-0.5 mr-1 rounded-full text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors align-super"
              aria-label={`Clear ${row.label}`}
              title={`Clear ${row.label}`}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="sm:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-blue-100 bg-blue-50 text-xs text-blue-800"
        >
          <span className="truncate text-left">
            {mobileSummary}
            {rows.length > 2 ? ` +${rows.length - 2} more` : ''}
          </span>
          <span className="ml-3 font-semibold">{mobileOpen ? 'Hide' : 'View'}</span>
        </button>

        {mobileOpen && (
          <div className="mt-2 flex flex-wrap gap-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs"
              >
                <button
                  onClick={() => {
                    jumpToStep(row.step);
                    setMobileOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-l-full"
                >
                  <span className="font-semibold">{row.label}:</span> {row.value}
                </button>
                <button
                  onClick={() => onClearRequirement(row)}
                  className="px-1.5 py-0.5 mr-1 rounded-full text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors align-super"
                  aria-label={`Clear ${row.label}`}
                  title={`Clear ${row.label}`}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
