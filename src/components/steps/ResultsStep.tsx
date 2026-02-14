import { useState } from 'react';
import type { Machine, WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { MachineCard } from '../MachineCard';
import { buildMailtoUrl, buildSummaryText } from '../../utils/composeEmail';
import { getRequirementRows } from '../../utils/requirements';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
  matchedMachines: Machine[];
  accessories: Machine[];
}

export function ResultsStep({ state, update, matchedMachines, accessories }: Props) {
  const [copiedRequirements, setCopiedRequirements] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const requirements = getRequirementRows(state);
  const requirementsText = requirements.map((row) => `${row.label}: ${row.value}`).join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(requirementsText);
    setCopiedRequirements(true);
    setTimeout(() => setCopiedRequirements(false), 2000);
  };

  const mailtoUrl = buildMailtoUrl(state, matchedMachines);

  return (
    <StepContainer
      title="Your results"
      subtitle={`${matchedMachines.length} machine${matchedMachines.length !== 1 ? 's' : ''} match your requirements`}
    >
      <div className="space-y-6">
        {/* Requirements summary */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Requirements</h3>
            <button
              onClick={handleCopy}
              disabled={requirements.length === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                requirements.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copiedRequirements ? 'Copied!' : 'Copy requirements'}
            </button>
          </div>
          {requirements.length === 0 ? (
            <p className="text-xs text-gray-500">No requirements selected yet.</p>
          ) : (
            <dl className="space-y-2">
              {requirements.map((row) => (
                <div key={`${row.label}-${row.value}`} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-3 text-sm">
                  <dt className="font-medium text-gray-600">{row.label}</dt>
                  <dd className="text-gray-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Your contact information</h3>
          <input
            type="text"
            placeholder="Full name"
            value={state.contactName}
            onChange={(e) => update('contactName', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Company"
            value={state.contactCompany}
            onChange={(e) => update('contactCompany', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              placeholder="Email"
              value={state.contactEmail}
              onChange={(e) => update('contactEmail', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={state.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            placeholder="Additional notes or questions..."
            rows={3}
            value={state.contactNotes}
            onChange={(e) => update('contactNotes', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Matched machines */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recommended machines</h3>
          {matchedMachines.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">No standard machines match all your criteria.</p>
              <p className="text-gray-400 text-xs mt-1">Our team can help design a custom solution.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedMachines.map((m) => (
                <MachineCard key={m.id} machine={m} />
              ))}
            </div>
          )}
        </div>

        {/* Accessories */}
        {accessories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggested add-ons</h3>
            <div className="space-y-3">
              {accessories.map((m) => (
                <MachineCard key={m.id} machine={m} compact />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={mailtoUrl}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            <span>📧</span> Email WMD Sales
          </a>
          <button
            onClick={async () => {
              const text = buildSummaryText(state, matchedMachines);
              await navigator.clipboard.writeText(text);
              setCopiedSummary(true);
              setTimeout(() => setCopiedSummary(false), 2000);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
          >
            {copiedSummary ? '✓ Copied!' : '📋 Copy Full Summary'}
          </button>
        </div>
      </div>
    </StepContainer>
  );
}
