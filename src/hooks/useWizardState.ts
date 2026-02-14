import { useState, useMemo, useCallback } from 'react';
import type { WizardState, ContainerType } from '../types';
import { INITIAL_STATE } from '../types';
import { machines } from '../data/machines';
import { filterMachines, getAccessories } from '../utils/filterMachines';

// Steps: 0-based index
// 0: Container Type
// 1: Product Characteristics
// 2: Container Details
// 3: Closure / Capping (skipped for sachets)
// 4: Production Requirements
// 5: Extras
// 6: Contact & Results

export const STEP_LABELS = [
  'Container',
  'Product',
  'Details',
  'Closure',
  'Production',
  'Extras',
  'Results',
];

function getStepCount(containerType: ContainerType | null): number {
  // Sachets skip the closure step
  if (containerType === 'sachet') return 6;
  return 7;
}

function mapLogicalToActual(logicalStep: number, containerType: ContainerType | null): number {
  // For sachets, logical step 3 (closure) is skipped
  // Logical: 0,1,2,3,4,5 → Actual: 0,1,2,4,5,6
  if (containerType === 'sachet' && logicalStep >= 3) {
    return logicalStep + 1;
  }
  return logicalStep;
}

function getSelectionProgressByLogicalStep(state: WizardState): boolean[] {
  const base = [
    state.containerType !== null,
    state.productType !== null,
    state.fillVolumeMin !== null ||
      state.fillVolumeMax !== null ||
      state.bottleMaterial !== null ||
      state.pouchStyle !== null ||
      state.hasSpouted,
    !state.needsCapping || state.closureType !== null,
    state.throughputTarget !== null || state.automationLevel !== null,
    state.wantsNitrogen ||
      state.wantsRinsing ||
      state.wantsLabeling ||
      state.wantsDatePrinting ||
      state.wantsHeated,
    state.contactName.trim().length > 0 ||
      state.contactCompany.trim().length > 0 ||
      state.contactEmail.trim().length > 0 ||
      state.contactPhone.trim().length > 0 ||
      state.contactNotes.trim().length > 0,
  ];

  if (state.containerType === 'sachet') {
    // Sachets skip closure, so remove that logical slot.
    return base.filter((_, i) => i !== 3);
  }

  return base;
}

export function useWizardState() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [logicalStep, setLogicalStep] = useState(0);

  const stepCount = getStepCount(state.containerType);
  const currentStep = mapLogicalToActual(logicalStep, state.containerType);
  const isFirst = logicalStep === 0;
  const isLast = logicalStep === stepCount - 1;

  const update = useCallback(<K extends keyof WizardState>(field: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateMany = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const next = useCallback(() => {
    setLogicalStep((s) => Math.min(s + 1, stepCount - 1));
  }, [stepCount]);

  const back = useCallback(() => {
    setLogicalStep((s) => Math.max(s - 1, 0));
  }, []);

  const goTo = useCallback((logicalIdx: number) => {
    setLogicalStep(Math.max(0, Math.min(logicalIdx, stepCount - 1)));
  }, [stepCount]);

  const matchedMachines = useMemo(() => filterMachines(state, machines), [state]);
  const accessories = useMemo(() => getAccessories(state, machines), [state]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: return state.containerType !== null;
      case 1: return state.productType !== null;
      case 2: return true; // details are optional
      case 3: return true; // closure is optional
      case 4: return true; // production is optional
      case 5: return true; // extras are optional
      case 6: return true; // contact is filled before send
      default: return true;
    }
  }, [currentStep, state]);

  const visibleStepLabels = useMemo(() => {
    if (state.containerType === 'sachet') {
      return STEP_LABELS.filter((_, i) => i !== 3);
    }
    return STEP_LABELS;
  }, [state.containerType]);

  const maxUnlockedStep = useMemo(() => {
    const progress = getSelectionProgressByLogicalStep(state);
    let furthestSelected = 0;

    progress.forEach((hasSelection, index) => {
      if (hasSelection) {
        furthestSelected = index;
      }
    });

    return Math.min(stepCount - 1, Math.max(logicalStep, furthestSelected + 1));
  }, [logicalStep, state, stepCount]);

  return {
    state,
    update,
    updateMany,
    currentStep,
    logicalStep,
    stepCount,
    isFirst,
    isLast,
    next,
    back,
    goTo,
    canProceed,
    matchedMachines,
    accessories,
    visibleStepLabels,
    maxUnlockedStep,
    checkViability: (updates: Partial<WizardState>) => {
      const nextState = { ...state, ...updates };
      return filterMachines(nextState, machines).length > 0;
    },
  };
}
