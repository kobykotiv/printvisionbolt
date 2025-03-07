interface StepProps {
  number: string;
  title: string;
  description: string[];
  icon?: string;
}

export function StepGuide({ steps }: { steps: StepProps[] }) {
  return (
    <div className="space-y-12">
      {steps.map((step, index) => (
        <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
          {/* Connector line */}
          {index !== steps.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
          )}
          
          <div className="flex-none">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
              {step.icon || step.number}
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
            <div className="space-y-2 text-muted-foreground">
              {step.description.map((line, i) => (
                <p key={i} className="leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}