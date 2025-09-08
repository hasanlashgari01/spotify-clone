import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

type PasswordInputProps = {
  label: string;
  id: string;
  error?: string;
  containerClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, id, error, containerClassName, className, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className={containerClassName ?? 'w-full'}>
        <label htmlFor={id} className="mb-1 block text-sm sm:text-base font-semibold">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={show ? 'text' : 'password'}
            className={
              `h-10 w-full rounded-2xl border-2 px-3 pr-9 transition-all focus:outline-none focus:ring-2 focus:ring-[#1574f5] ` +
              (error ? 'border-red-500' : 'border-[#676b70]') +
              (className ? ` ${className}` : '')
            }
            {...props}
          />
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => setShow((s) => !s)}
          >
            {show ? <IoEyeOff size={18} /> : <IoEye size={18} />}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;


