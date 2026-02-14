import { useWizardState } from '../hooks/useWizardState';
import { ProgressBar } from './ProgressBar';
import { MachineResults } from './MachineResults';
import { ContainerStep } from './steps/ContainerStep';
import { ProductStep } from './steps/ProductStep';
import { DetailsStep } from './steps/DetailsStep';
import { ClosureStep } from './steps/ClosureStep';
import { ProductionStep } from './steps/ProductionStep';
import { ExtrasStep } from './steps/ExtrasStep';
import { ResultsStep } from './steps/ResultsStep';

export function Wizard() {
  const {
    state,
    update,
    currentStep,
    logicalStep,
    isFirst,
    isLast,
    next,
    back,
    goTo,
    canProceed,
    matchedMachines,
    accessories,
    visibleStepLabels,
    checkViability,
  } = useWizardState();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <ContainerStep state={state} update={update} />;
      case 1: return <ProductStep state={state} update={update} checkViability={checkViability} />;
      case 2: return <DetailsStep state={state} update={update} />;
      case 3: return <ClosureStep state={state} update={update} checkViability={checkViability} />;
      case 4: return <ProductionStep state={state} update={update} />;
      case 5: return <ExtrasStep state={state} update={update} />;
      case 6: return <ResultsStep state={state} update={update} matchedMachines={matchedMachines} accessories={accessories} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-700">WMD</span>
              <span className="text-sm text-gray-500 hidden sm:inline">Equipment Solutions Finder</span>
            </div>
            <div className="text-xs text-gray-400">
              {matchedMachines.length} machine{matchedMachines.length !== 1 ? 's' : ''} available
            </div>
          </div>
          <ProgressBar
            labels={visibleStepLabels}
            currentIndex={logicalStep}
            onStepClick={goTo}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Wizard area */}
        <main className="flex-1 lg:max-w-[60%] overflow-y-auto pb-24 lg:pb-8">
          {renderStep()}

          {/* Desktop navigation (hidden on mobile where the fixed bottom bar handles it) */}
          <div className="hidden lg:flex items-center justify-between max-w-lg mx-auto px-4 pb-8">
            <button
              onClick={back}
              disabled={isFirst}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isFirst
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              ← Back
            </button>

            {!isLast ? (
              <button
                onClick={next}
                disabled={!canProceed}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  canProceed
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            ) : (
              <span className="text-xs text-gray-400">Review & send above</span>
            )}
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[40%] border-l border-gray-200 bg-gray-50 sticky top-[106px] h-[calc(100vh-106px)]">
          <MachineResults machines={matchedMachines} accessories={accessories} />
        </aside>
      </div>

      {/* Mobile navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-20">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={back}
            disabled={isFirst}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isFirst
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ← Back
          </button>

          {!isLast ? (
            <button
              onClick={next}
              disabled={!canProceed}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                canProceed
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          ) : (
            <span className="text-xs text-gray-400">Review & send above</span>
          )}
        </div>
      </nav>

      {/* Mobile machine results (floating badge + bottom sheet) */}
      {!isLast && (
        <div className="lg:hidden">
          <MachineResults machines={matchedMachines} accessories={accessories} />
        </div>
      )}
    </div>
  );
}
