interface ProgressBarProps {
  labels: string[];
  currentIndex: number;
  onStepClick: (index: number) => void;
}

export function ProgressBar({ labels, currentIndex, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full px-2 py-4">
      {/* Mobile: compact dots */}
      <div className="flex items-center justify-center gap-2 sm:hidden">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => i <= currentIndex && onStepClick(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-8 bg-blue-600'
                : i < currentIndex
                ? 'w-2.5 bg-blue-400 cursor-pointer'
                : 'w-2.5 bg-gray-300'
            }`}
            aria-label={`Step ${i + 1}: ${label}`}
          />
        ))}
        <span className="ml-3 text-sm text-gray-500">
          {currentIndex + 1}/{labels.length}
        </span>
      </div>

      {/* Desktop: full step labels */}
      <div className="hidden sm:flex items-center justify-between w-full">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center">
            <button
              onClick={() => i <= currentIndex && onStepClick(i)}
              className={`flex items-center gap-2 transition-colors ${
                i <= currentIndex ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                    : i < currentIndex
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < currentIndex ? '✓' : i + 1}
              </span>
              <span
                className={`text-sm font-medium hidden md:inline ${
                  i === currentIndex ? 'text-blue-700' : i < currentIndex ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
            {i < labels.length - 1 && (
              <div
                className={`w-8 lg:w-12 h-0.5 mx-1 ${
                  i < currentIndex ? 'bg-blue-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
