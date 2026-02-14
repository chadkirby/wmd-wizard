import type { WizardState } from '../../types';
import { StepContainer } from '../StepContainer';
import { ToggleField } from '../ToggleField';

interface Props {
  state: WizardState;
  update: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
}

export function ExtrasStep({ state, update }: Props) {
  return (
    <StepContainer
      title="Additional features"
      subtitle="Select any optional capabilities you need"
    >
      <div className="space-y-2">
        <ToggleField
          label="Nitrogen injection"
          description="Displaces oxygen to extend shelf life"
          checked={state.wantsNitrogen}
          onChange={(v) => update('wantsNitrogen', v)}
        />
        <ToggleField
          label="Container rinsing"
          description="Sanitize or rinse containers before filling"
          checked={state.wantsRinsing}
          onChange={(v) => update('wantsRinsing', v)}
        />
        <ToggleField
          label="Labeling"
          description="Integrated labeling station"
          checked={state.wantsLabeling}
          onChange={(v) => update('wantsLabeling', v)}
        />
        <ToggleField
          label="Date / lot printing"
          description="Print date codes or lot numbers on containers"
          checked={state.wantsDatePrinting}
          onChange={(v) => update('wantsDatePrinting', v)}
        />
        <ToggleField
          label="Heated components"
          description="For thick products like peanut butter or wax"
          checked={state.wantsHeated}
          onChange={(v) => update('wantsHeated', v)}
        />
      </div>
    </StepContainer>
  );
}
