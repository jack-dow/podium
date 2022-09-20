import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, forwardRef } from 'react';

import clsx from 'clsx';
import { Label } from '../inputs/Label';
import { ChevronUpDownIcon } from '@/assets/icons/mini/ChevronUpDown';
import { CheckIcon } from '@/assets/icons/mini/CheckIcon';

interface SelectItem {
  value: string;
  label?: string;
  disabled?: boolean;
}

interface SelectProps {
  data: ReadonlyArray<string> | ReadonlyArray<SelectItem>;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  invalid?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ data, label, placeholder, invalid, value, onChange }, ref) => {
    return (
      <Listbox value={value} onChange={onChange} as="div" ref={ref}>
        {({ open }) => (
          <div>
            <Listbox.Label as={Label}>{label}</Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button
                className={clsx(
                  'relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left capitalize shadow-sm sm:text-sm',
                  'focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600',
                  invalid && 'ring-2 ring-red-500',
                  open && 'border-sky-600 ring-1 ring-sky-600',
                )}
              >
                <span className="block truncate">{value || placeholder || 'Click to open'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {data.map((item) => {
                    const isSelectItem = typeof item === 'string';
                    const itemValue = isSelectItem ? item : item.value;
                    const itemLabel = isSelectItem ? item : item.label || item.value;
                    return (
                      <Listbox.Option
                        key={itemValue}
                        value={itemValue}
                        disabled={isSelectItem ? false : item.disabled}
                        className={({ active }) =>
                          clsx(
                            'relative cursor-default select-none py-2 pl-8 pr-4',
                            active ? 'bg-sky-600 text-white' : 'text-gray-900',
                          )
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={clsx('block truncate capitalize', selected ? 'font-semibold' : 'font-normal')}
                            >
                              {itemLabel}
                            </span>

                            {selected ? (
                              <span
                                className={clsx(
                                  'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                  active ? 'text-white' : 'text-sky-600',
                                )}
                              >
                                <CheckIcon aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    );
                  })}
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        )}
      </Listbox>
    );
  },
);

Select.displayName = 'Select';
