interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleField({ label, description, checked, disabled = false, onChange }: ToggleFieldProps) {
  return (
    <label className={`flex items-center justify-between gap-4 p-3 rounded-lg border transition-colors ${
      disabled
        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
        : 'bg-white border-gray-200 cursor-pointer hover:border-gray-300'
    }`}>
      <div className="min-w-0">
        <div className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>{label}</div>
        {description && <div className={`text-xs mt-0.5 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{description}</div>}
      </div>
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          onChange(!checked);
        }}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? (disabled ? 'bg-blue-300' : 'bg-blue-600') : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
