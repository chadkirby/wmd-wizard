import type { ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StepContainer({ title, subtitle, children }: StepContainerProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}
      {children}
    </div>
  );
}
