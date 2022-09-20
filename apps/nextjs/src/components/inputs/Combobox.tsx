import { forwardRef } from 'react';
import { Combobox as HUICombobox } from '@headlessui/react';
import clsx from 'clsx';
import { Label } from './Label';
import { Input } from './Input';
import { CheckIcon } from '@/assets/icons/mini/CheckIcon';
import { ChevronUpDownIcon } from '@/assets/icons/mini/ChevronUpDown';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(({ value, onChange }, ref) => {
  return (
    <HUICombobox as="div" value={value} onChange={onChange} ref={ref}>
      <HUICombobox.Label as={Label}>Assigned to</HUICombobox.Label>
      <div className="relative mt-1">
        <HUICombobox.Input
          as={Input}
          onChange={(event) => console.log({ event })}
          displayValue={(person) => person?.name}
        />
        <HUICombobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="text-gray-400" aria-hidden="true" />
        </HUICombobox.Button>

        {filteredPeople.length > 0 && (
          <HUICombobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <HUICombobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={clsx('block truncate', selected && 'font-semibold')}>{person.name}</span>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5',
                          active ? 'text-white' : 'text-indigo-600',
                        )}
                      >
                        <CheckIcon aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </HUICombobox.Option>
            ))}
          </HUICombobox.Options>
        )}
      </div>
    </HUICombobox>
  );
});

Combobox.displayName = 'Combobox';
