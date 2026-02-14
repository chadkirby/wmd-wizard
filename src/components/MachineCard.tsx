import type { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  compact?: boolean;
}

export function MachineCard({ machine, compact = false }: MachineCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-900 leading-tight">{machine.name}</h4>
          <p className="text-xs text-gray-500">{machine.manufacturer}</p>
        </div>
        {machine.price !== 'Contact Us' && (
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
            {machine.price}
          </span>
        )}
      </div>

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
        <p className="text-xs text-gray-500 mt-1">
          {machine.throughputMin.toLocaleString()}–{machine.throughputMax.toLocaleString()} units/hr
          {' · '}
          {machine.fillVolumeMin}–{machine.fillVolumeMax} ml
        </p>
      )}
    </div>
  );
}
