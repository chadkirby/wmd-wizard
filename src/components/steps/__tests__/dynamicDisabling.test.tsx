import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductStep } from '../ProductStep';
import { ClosureStep } from '../ClosureStep';
import { INITIAL_STATE } from '../../../types';
import type { WizardState } from '../../../types';

describe('dynamic viability disabling', () => {
  it('disables non-viable product options and toggles in Product step', () => {
    const state: WizardState = {
      ...INITIAL_STATE,
      containerType: 'bucket',
      productType: 'liquid',
    };

    const checkViability = vi.fn((updates: Partial<WizardState>) => {
      if (updates.productType === 'powder') return false;
      if (updates.hasChunks === true) return false;
      return true;
    });

    render(
      <ProductStep
        state={state}
        update={vi.fn()}
        checkViability={checkViability}
      />,
    );

    expect(screen.getByRole('button', { name: /powder/i })).toBeDisabled();
    expect(screen.getByText('Dry').closest('button')).toBeEnabled();
    expect(screen.getByRole('switch', { name: /contains chunks or solids/i })).toBeDisabled();
  });

  it('disables non-viable closure options in Closure step', () => {
    const state: WizardState = {
      ...INITIAL_STATE,
      containerType: 'bottle',
      needsCapping: true,
      closureType: null,
    };

    const checkViability = vi.fn((updates: Partial<WizardState>) => updates.closureType !== 'cork');

    render(
      <ClosureStep
        state={state}
        update={vi.fn()}
        checkViability={checkViability}
      />,
    );

    expect(screen.getByRole('button', { name: /wine cork/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /screw cap/i })).toBeEnabled();
  });
});
