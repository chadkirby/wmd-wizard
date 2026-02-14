import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RequirementsSnapshot } from '../RequirementsSnapshot';
import { INITIAL_STATE } from '../../types';
import type { WizardState } from '../../types';
import type { RequirementRow } from '../../utils/requirements';

function StatefulSnapshot() {
  const [state, setState] = useState<WizardState>({
    ...INITIAL_STATE,
    containerType: 'bottle',
    productType: 'viscous',
  });

  const handleClear = (row: RequirementRow) => {
    setState((prev) => ({ ...prev, ...row.clearUpdates }));
  };

  return (
    <RequirementsSnapshot
      state={state}
      onStepClick={vi.fn()}
      onClearRequirement={handleClear}
    />
  );
}

describe('RequirementsSnapshot clear controls', () => {
  it('clears an individual requirement chip when x is clicked', () => {
    render(<StatefulSnapshot />);

    expect(screen.getByRole('button', { name: /Clear Product Type/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Container Type/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Clear Product Type/i }));

    expect(screen.queryByRole('button', { name: /Clear Product Type/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Container Type/i })).toBeInTheDocument();
  });
});
