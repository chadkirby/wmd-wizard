import type { ClosureType, WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { SelectionCard } from '../SelectionCard';
import { ToggleField } from '../ToggleField';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
  checkViability: (updates: Partial<WizardState>) => boolean;
}

const bottleClosures: { value: ClosureType; icon: string; label: string }[] = [
  { value: 'screw', icon: '🔩', label: 'Screw Cap' },
  { value: 'ropp', icon: '🍷', label: 'ROPP Cap' },
  { value: 'cork', icon: '🪵', label: 'Wine Cork' },
  { value: 't-cork', icon: '🔌', label: 'T-Cork' },
  { value: 'press-on', icon: '⬇️', label: 'Press-on' },
  { value: 'twist-off', icon: '🔄', label: 'Twist-off' },
  { value: 'dropper', icon: '💉', label: 'Dropper' },
  { value: 'none', icon: '❌', label: 'None (fill only)' },
];

const pouchClosures: { value: ClosureType; icon: string; label: string }[] = [
  { value: 'spout-cap', icon: '🧴', label: 'Spout Cap' },
  { value: 'heat-seal', icon: '🔥', label: 'Heat Sealed' },
];

const bucketClosures: { value: ClosureType; icon: string; label: string }[] = [
  { value: 'press-on', icon: '⬇️', label: 'Press-on Lid' },
];

export function ClosureStep({ state, update, checkViability }: Props) {
  const isPouch = state.containerType === 'pouch';
  const isBucket = state.containerType === 'bucket';

  const closureOptions = isPouch ? pouchClosures : isBucket ? bucketClosures : bottleClosures;

  return (
    <StepContainer
      title="How are containers sealed?"
      subtitle="Select the closure or capping type"
    >
      <div className="space-y-4">
        {state.containerType === 'bottle' && (
          <ToggleField
            label="Capping needed"
            description="Uncheck if you only need a filling machine (no capper)"
            checked={state.needsCapping}
            onChange={(v) => {
              update('needsCapping', v);
              if (!v) update('closureType', 'none');
            }}
          />
        )}

        {(state.needsCapping || state.containerType !== 'bottle') && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {closureOptions.map((opt) => {
              const matches = checkViability({ closureType: opt.value });
              return (
                <SelectionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  selected={state.closureType === opt.value}
                  disabled={!matches}
                  onClick={() => update('closureType', opt.value)}
                />
              );
            })}
          </div>
        )}
      </div>
    </StepContainer>
  );
}
