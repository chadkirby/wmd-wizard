import type { ContainerType, WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { SelectionCard } from '../SelectionCard';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
}

const options: { value: ContainerType; icon: string; label: string; desc: string }[] = [
  { value: 'bottle', icon: '🍾', label: 'Bottles / Jars', desc: 'Glass, PET, HDPE, or metal containers' },
  { value: 'pouch', icon: '🧴', label: 'Pouches / Bags', desc: 'Stand-up, spouted, Doypack, flexible' },
  { value: 'sachet', icon: '📦', label: 'Sachets', desc: 'Small flat packets, single-serve' },
  { value: 'bucket', icon: '🪣', label: 'Buckets / Pails', desc: 'Large containers up to 8 gallons' },
];

export function ContainerStep({ state, update }: Props) {
  return (
    <StepContainer
      title="What container are you filling?"
      subtitle="Select the type of packaging you need to fill"
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((opt) => (
          <SelectionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            description={opt.desc}
            selected={state.containerType === opt.value}
            onClick={() => update('containerType', opt.value)}
          />
        ))}
      </div>
    </StepContainer>
  );
}
