import type { WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { ToggleField } from '../ToggleField';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
}

const materialOptions = ['Glass', 'PET', 'HDPE', 'Aluminum', 'Other'];

export function DetailsStep({ state, update }: Props) {
  const isBottle = state.containerType === 'bottle';
  const isPouch = state.containerType === 'pouch';
  const isSachet = state.containerType === 'sachet';
  const isBucket = state.containerType === 'bucket';

  return (
    <StepContainer
      title="Container details"
      subtitle="Help us narrow down the right machine for your containers"
    >
      <div className="space-y-6">
        {/* Fill volume */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Fill volume {isSachet ? '(ml per sachet)' : '(ml per container)'}
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 50"
                value={state.fillVolumeMin ?? ''}
                onChange={(e) => update('fillVolumeMin', e.target.value ? Number(e.target.value) : null)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 500"
                value={state.fillVolumeMax ?? ''}
                onChange={(e) => update('fillVolumeMax', e.target.value ? Number(e.target.value) : null)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <span className="text-xs text-gray-500 mt-5">ml</span>
          </div>
        </div>

        {/* Bottle-specific */}
        {isBottle && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Container material</h3>
            <div className="flex flex-wrap gap-2">
              {materialOptions.map((mat) => (
                <button
                  key={mat}
                  onClick={() => update('bottleMaterial', state.bottleMaterial === mat ? null : mat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    state.bottleMaterial === mat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pouch-specific */}
        {isPouch && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Pouch style</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => update('pouchStyle', 'pre-made')}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    state.pouchStyle === 'pre-made'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pre-made pouches
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    Already formed, ready to fill
                  </span>
                </button>
                <button
                  onClick={() => update('pouchStyle', 'form-fill-seal')}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    state.pouchStyle === 'form-fill-seal'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Form Fill & Seal
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    Machine forms from film roll
                  </span>
                </button>
              </div>
            </div>

            <ToggleField
              label="Spouted pouches"
              description="Pouches have a pre-attached spout for filling through"
              checked={state.hasSpouted}
              onChange={(v) => update('hasSpouted', v)}
            />
          </div>
        )}

        {/* Bucket-specific */}
        {isBucket && (
          <p className="text-sm text-gray-500">
            Our bucket filling line handles containers up to 300mm diameter and volumes up to 8 gallons.
          </p>
        )}
      </div>
    </StepContainer>
  );
}
