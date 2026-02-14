import { useState } from 'react';
import type { Machine } from '../types';
import { MachineCard } from './MachineCard';

interface MachineResultsProps {
  machines: Machine[];
  accessories: Machine[];
}

export function MachineResults({ machines, accessories }: MachineResultsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const count = machines.length;

  return (
    <>
      {/* Mobile: floating badge + bottom sheet */}
      <div className="lg:hidden">
        {/* Floating badge */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <span className="text-sm font-semibold">{count}</span>
          <span className="text-xs">match{count !== 1 ? 'es' : ''}</span>
          <span className="text-xs">{mobileOpen ? '▼' : '▲'}</span>
        </button>

        {/* Bottom sheet overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="px-4 pb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  {count} matching machine{count !== 1 ? 's' : ''}
                </h3>
              </div>

              <div className="overflow-y-auto px-4 pb-6 space-y-3 max-h-[55vh]">
                {machines.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No machines match yet. Keep selecting options above.
                  </p>
                ) : (
                  machines.map((m) => <MachineCard key={m.id} machine={m} compact />)
                )}
                {accessories.length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-gray-500 pt-2">Add-ons</div>
                    {accessories.map((m) => <MachineCard key={m.id} machine={m} compact />)}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: sidebar */}
      <div className="hidden lg:block w-full h-full overflow-y-auto p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1">
          {count} matching machine{count !== 1 ? 's' : ''}
        </h3>
        <p className="text-xs text-gray-500 mb-4">Results update as you make selections</p>

        {machines.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No machines match yet.</p>
            <p className="text-gray-400 text-xs mt-1">Start selecting options to see results.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>
        )}

        {accessories.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Suggested Add-ons</h4>
            <div className="space-y-3">
              {accessories.map((m) => (
                <MachineCard key={m.id} machine={m} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
