import type { AutomationLevel, WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { SelectionCard } from '../SelectionCard';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
}

const throughputPresets = [
  { label: '< 500/hr', desc: 'Small batch', value: 300 },
  { label: '500–2K/hr', desc: 'Small production', value: 1000 },
  { label: '2K–6K/hr', desc: 'Medium production', value: 4000 },
  { label: '6K–18K/hr', desc: 'High volume', value: 12000 },
  { label: '18K+/hr', desc: 'Industrial', value: 25000 },
];

const automationOptions: { value: AutomationLevel; icon: string; label: string; desc: string }[] = [
  { value: 'semi', icon: '🖐️', label: 'Semi-auto OK', desc: 'Operator-assisted, lower cost' },
  { value: 'full', icon: '🤖', label: 'Fully automatic', desc: 'Minimal operator intervention' },
];

export function ProductionStep({ state, update }: Props) {
  return (
    <StepContainer
      title="Production requirements"
      subtitle="How fast do you need to fill?"
    >
      <div className="space-y-6">
        {/* Throughput */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Target throughput</h3>
          <div className="space-y-2">
            {throughputPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => update('throughputTarget', preset.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                  state.throughputTarget === preset.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`text-sm font-semibold ${
                  state.throughputTarget === preset.value ? 'text-blue-700' : 'text-gray-800'
                }`}>
                  {preset.label}
                </span>
                <span className="text-xs text-gray-500">{preset.desc}</span>
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">Or enter exact:</span>
            <input
              type="number"
              min={0}
              placeholder="units/hr"
              value={
                throughputPresets.some((p) => p.value === state.throughputTarget)
                  ? ''
                  : state.throughputTarget ?? ''
              }
              onChange={(e) => update('throughputTarget', e.target.value ? Number(e.target.value) : null)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Automation level */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Automation level</h3>
          <div className="grid grid-cols-2 gap-3">
            {automationOptions.map((opt) => (
              <SelectionCard
                key={opt.value}
                icon={opt.icon}
                label={opt.label}
                description={opt.desc}
                selected={state.automationLevel === opt.value}
                onClick={() => update('automationLevel', opt.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  );
}
