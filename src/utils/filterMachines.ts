import type { Machine, WizardState } from '../types';

export function filterMachines(state: WizardState, allMachines: Machine[]): Machine[] {
  return allMachines.filter((m) => {
    // Never show accessories as primary matches
    if (m.isAccessory) return false;

    // Step 1: Container type
    if (state.containerType && !m.containerTypes.includes(state.containerType)) {
      return false;
    }

    // Step 2: Product characteristics
    if (state.productType) {
      // "viscous" products can run on machines that handle "liquid" too,
      // but "dry"/"powder" machines are distinct
      if (state.productType === 'liquid' && !m.productTypes.includes('liquid')) return false;
      if (state.productType === 'viscous' && !m.productTypes.includes('viscous') && !m.productTypes.includes('liquid')) return false;
      if (state.productType === 'dry' && !m.productTypes.includes('dry')) return false;
      if (state.productType === 'powder' && !m.productTypes.includes('powder')) return false;
    }

    if (state.hasChunks && !m.handlesChunks) return false;
    if (state.isCombustible && !m.atexAvailable) return false;

    // Step 3: Fill volume - check overlap between user range and machine range
    if (state.fillVolumeMin !== null && state.fillVolumeMax !== null) {
      if (m.fillVolumeMax < state.fillVolumeMin || m.fillVolumeMin > state.fillVolumeMax) {
        return false;
      }
    } else if (state.fillVolumeMin !== null) {
      if (m.fillVolumeMax < state.fillVolumeMin) return false;
    } else if (state.fillVolumeMax !== null) {
      if (m.fillVolumeMin > state.fillVolumeMax) return false;
    }

    // Step 3: Pouch style
    if (state.containerType === 'pouch' && state.pouchStyle) {
      if (m.pouchSubtype && m.pouchSubtype !== 'any' && m.pouchSubtype !== state.pouchStyle) {
        // Spouted pouches are a subset of pre-made
        if (!(state.pouchStyle === 'pre-made' && m.pouchSubtype === 'spouted')) {
          return false;
        }
      }
    }

    // Step 4: Closure type
    if (state.closureType && state.needsCapping) {
      if (!m.closureTypes.includes(state.closureType)) return false;
    }
    if (!state.needsCapping) {
      // Only show machines that can do fill-only
      if (!m.closureTypes.includes('none') && m.closureTypes.length > 0) {
        // Machines with closures can still be used... but filling-only machines are preferred
        // Don't hard-filter, let them through
      }
    }

    // Step 5: Throughput
    if (state.throughputTarget !== null && state.throughputTarget > 0) {
      // Allow some flexibility: machine max should be >= 70% of target,
      // and machine min should be <= 150% of target
      if (m.throughputMax < state.throughputTarget * 0.5) return false;
      if (m.throughputMin > state.throughputTarget * 2) return false;
    }

    // Step 5: Automation level
    if (state.automationLevel === 'full' && m.automationLevel === 'semi') {
      return false;
    }

    return true;
  });
}

export function getAccessories(state: WizardState, allMachines: Machine[]): Machine[] {
  return allMachines.filter((m) => {
    if (!m.isAccessory) return false;
    if (state.containerType && !m.containerTypes.includes(state.containerType)) return false;
    return true;
  });
}
