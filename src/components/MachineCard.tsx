import { useState } from 'react';
import type { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  compact?: boolean;
}

export function MachineCard({ machine, compact = false }: MachineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
      >
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-gray-900 leading-tight">{machine.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{machine.manufacturer}</p>
        </div>

        <div className="flex items-center gap-3">
          {machine.price !== 'Contact Us' && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline-block">
              {machine.price}
            </span>
          )}
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="pt-3">
            {/* Mobile-only price badge if it was hidden in header */}
            {machine.price !== 'Contact Us' && (
              <div className="sm:hidden mb-3">
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  {machine.price}
                </span>
              </div>
            )}

            {!compact && (
              <>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{machine.description}</p>
                <ul className="space-y-1">
                  {machine.keySpecs.slice(0, 4).map((spec) => (
                    <li key={spec} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {compact && (
              <p className="text-xs text-gray-500">
                {machine.throughputMin.toLocaleString()}–{machine.throughputMax.toLocaleString()} units/hr
                {' · '}
                {machine.fillVolumeMin}–{machine.fillVolumeMax} ml
              </p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add explicit action or link handler here if needed in future
              }}
              className="mt-4 w-full py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              View Full Specs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
