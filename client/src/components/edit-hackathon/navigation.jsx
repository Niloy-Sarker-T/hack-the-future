import { Button } from "@/components/ui/button";

export default function EditHackathonNavButtons({
  step,
  setStep,
  stepsLength,
  onSubmit,
}) {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        disabled={step === 0}
        onClick={() => setStep(step - 1)}
      >
        Previous
      </Button>
      {step < stepsLength - 1 ? (
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      ) : (
        <Button onClick={onSubmit}>Submit</Button>
      )}
    </div>
  );
}
