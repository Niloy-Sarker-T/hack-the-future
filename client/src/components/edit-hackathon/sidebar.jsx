export default function EditHackathonSidebar({ steps, currentStep, setStep }) {
  return (
    <nav className="sticky top-8 md:block hidden">
      <ul className="space-y-2">
        {steps.map((step, idx) => {
          return (
            <li key={step.label}>
              <button
                className={`w-full text-left px-4 py-2 rounded transition
                  ${
                    idx === currentStep
                      ? "bg-primary text-white font-bold"
                      : "hover:bg-accent"
                  }
                `}
                onClick={() => setStep(idx)}
              >
                {idx + 1}. {step.label.toString()}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
