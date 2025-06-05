export default function EditHackathonMobileStepper({
  steps,
  currentStep,
  setStep,
}) {
  return (
    <div className="flex md:hidden mb-4 overflow-x-auto">
      {steps.map((step, idx) => (
        <button
          key={step.label}
          className={`flex-1 px-3 py-2 mx-1 rounded-full whitespace-nowrap
            ${
              idx === currentStep
                ? "bg-primary text-white font-bold"
                : "bg-muted text-muted-foreground"
            }
          `}
          onClick={() => setStep(idx)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}
