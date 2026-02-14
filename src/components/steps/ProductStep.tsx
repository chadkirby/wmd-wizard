import type { Industry, ProductType, WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { SelectionCard } from '../SelectionCard';
import { ToggleField } from '../ToggleField';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
  checkViability: (updates: Partial<WizardState>) => boolean;
}

const productOptions: { value: ProductType; icon: string; label: string; desc: string }[] = [
  { value: 'liquid', icon: '💧', label: 'Liquid', desc: 'Water, juice, oil, vinegar, spirits' },
  { value: 'viscous', icon: '🍯', label: 'Semi-liquid / Viscous', desc: 'Honey, sauces, creams, lotions' },
  { value: 'dry', icon: '🌾', label: 'Dry', desc: 'Coffee, pasta, dried fruit, pet food' },
  { value: 'powder', icon: '🧂', label: 'Powder', desc: 'Flour, sweeteners, bath salts, spices' },
];

const industryOptions: { value: Industry; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'wine-spirits', label: 'Wine & Spirits' },
  { value: 'cosmetics', label: 'Cosmetics' },
  { value: 'pharma', label: 'Pharma' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'home-care', label: 'Home Care' },
];

export function ProductStep({ state, update, checkViability }: Props) {
  return (
    <StepContainer
      title="Tell us about your product"
      subtitle="What are you filling into the containers?"
    >
      <div className="space-y-6">
        {/* Product type */}
        <div className="grid grid-cols-2 gap-3">
          {productOptions.map((opt) => (
            <SelectionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              description={opt.desc}
              selected={state.productType === opt.value}
              disabled={state.productType !== opt.value && !checkViability({ productType: opt.value })}
              onClick={() => update('productType', opt.value)}
            />
          ))}
        </div>

        {/* Product characteristics */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Product characteristics</h3>
          <ToggleField
            label="Contains chunks or solids"
            description="e.g., salsa, fruit filling, dressings with herbs"
            checked={state.hasChunks}
            disabled={!state.hasChunks && !checkViability({ hasChunks: true })}
            onChange={(v) => update('hasChunks', v)}
          />
          <ToggleField
            label="Foamy product"
            description="Tends to foam during filling (may need diving nozzles)"
            checked={state.isFoamy}
            disabled={!state.isFoamy && !checkViability({ isFoamy: true })}
            onChange={(v) => update('isFoamy', v)}
          />
          <ToggleField
            label="Combustible or flammable"
            description="Requires ATEX-certified equipment"
            checked={state.isCombustible}
            disabled={!state.isCombustible && !checkViability({ isCombustible: true })}
            onChange={(v) => update('isCombustible', v)}
          />
        </div>

        {/* Industry */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Industry (optional)</h3>
          <div className="flex flex-wrap gap-2">
            {industryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('industry', state.industry === opt.value ? null : opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  state.industry === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  );
}
