import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../buttons/Button';
import { Input } from '../inputs/Input';
import { Label } from '../inputs/Label';

interface FormProps {
  name: string;
}

interface TemplateEditorProps {}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors: formErrors, isDirty },
  } = useForm<FormProps>({ criteriaMode: 'all' });
  const [completedSteps, setCompletedSteps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <form className="space-y-4">
      <div className="border-b border-gray-300 pb-4 transition-colors">
        <h3 className="text-2xl font-medium leading-6 text-gray-900">Create Template</h3>
        <p className={clsx('mt-2 max-w-4xl text-sm text-gray-500')}>
          Here is where you can create templates using your exercises which can be referenced in your workouts or plans
        </p>
      </div>

      <div className="space-y-4">
        <Steps currentStep={currentStep} setCurrentStep={setCurrentStep} completedSteps={completedSteps} />
        <Input label="Template Name" placeholder="Legs 1" {...register('name')} />
      </div>
      <div className="flex w-full justify-end border-t border-gray-300 pt-4">
        <Button color="sky">Next Step</Button>
      </div>
    </form>
  );
};

const Steps = ({
  currentStep,
  setCurrentStep,
  completedSteps,
}: {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  completedSteps: number;
}) => {
  const steps = [
    {
      id: 'Step 1',
      name: 'Exercises',
    },
    {
      id: 'Step 2',
      name: 'Sets & Reps',
    },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex space-x-4 md:space-x-8">
        {steps.map((step, index) => {
          let status;
          if (index === currentStep) {
            status = 'current';
          } else if (index < currentStep) {
            status = 'complete';
          } else {
            status = 'upcoming';
          }
          return (
            <li key={step.name} className="flex-1">
              <button
                type="button"
                onClick={() => setCurrentStep(index)}
                disabled={index > completedSteps}
                className={clsx(
                  'group flex w-full flex-col border-t-4 py-2 pt-4',
                  'disabled:opacity-40',
                  status === 'complete' && 'hover:border-sky-800',
                  status === 'upcoming' && 'border-gray-200 hover:border-gray-300 disabled:hover:border-gray-200',
                  status !== 'upcoming' && 'border-sky-600',
                )}
              >
                <span
                  className={clsx(
                    'text-xs font-bold uppercase tracking-wider',
                    status === 'complete' && 'group-hover:text-sky-800',
                    status === 'upcoming' &&
                      'text-gray-500 group-hover:text-gray-700 group-disabled:group-hover:text-gray-500',
                    status !== 'upcoming' && 'text-sky-600',
                  )}
                >
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
