interface SelectionCardProps {
  icon: string;
  label: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function SelectionCard({ icon, label, description, selected, disabled = false, onClick }: SelectionCardProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-2 p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-center min-w-0 ${
        disabled
          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed grayscale'
          : selected
            ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <span className={`text-sm sm:text-base font-semibold ${selected ? 'text-blue-700' : 'text-gray-800'}`}>
        {label}
      </span>
      {description && (
        <span className="text-xs text-gray-500 leading-tight">{description}</span>
      )}
    </button>
  );
}
