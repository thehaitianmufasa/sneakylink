"use client";

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@backend/lib/utils/cn';

interface BaseFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  requiredIndicator?: boolean;
}

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    BaseFieldProps {}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, hint, error, id, className, requiredIndicator = true, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-dark-gray">
            {label}
            {required && requiredIndicator && <span className="ml-1 text-secondary">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            'h-11 rounded-md border border-slate-200 bg-white px-4 text-base text-dark-gray shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-light-gray/60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          hint && <p className="text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'>,
    BaseFieldProps {
  rows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, hint, error, id, className, rows = 4, requiredIndicator = true, required, ...props }, ref) => {
    const generatedId = useId();
    const textAreaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={textAreaId} className="text-sm font-medium text-dark-gray">
            {label}
            {required && requiredIndicator && <span className="ml-1 text-secondary">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textAreaId}
          rows={rows}
          required={required}
          className={cn(
            'rounded-md border border-slate-200 bg-white px-4 py-3 text-base text-dark-gray shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-light-gray/60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          hint && <p className="text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export interface SelectInputProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    BaseFieldProps {}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, hint, error, id, className, requiredIndicator = true, required, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-dark-gray">
            {label}
            {required && requiredIndicator && <span className="ml-1 text-secondary">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={cn(
            'h-11 rounded-md border border-slate-200 bg-white px-4 text-base text-dark-gray shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-light-gray/60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          hint && <p className="text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export const FormField = {
  Input: TextInput,
  TextArea,
  Select: SelectInput,
};

export default FormField;
