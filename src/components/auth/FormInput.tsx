import { InputHTMLAttributes, forwardRef } from 'react';

type FormInputProps = {
  label: string;
  id: string;
  error?: string;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, containerClassName, className, ...props }, ref) => {
    return (
      <div className={containerClassName ?? 'w-full'}>
        <label htmlFor={id} className="mb-1 block text-sm sm:text-base font-semibold">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={
            `h-10 w-full rounded-2xl border-2 px-3 transition-all focus:outline-none focus:ring-2 focus:ring-[#1574f5] ` +
            (error ? 'border-red-500' : 'border-[#676b70]') +
            (className ? ` ${className}` : '')
          }
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;


