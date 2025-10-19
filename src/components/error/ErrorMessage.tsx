import { FC } from 'react';

interface ErrorProps {
  error: unknown;
  message?: string;
}

const ErrorMessage: FC<ErrorProps> = ({ error, message }) => {
  const displayMessage =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : 'Unknown error occurred';

  return (
    <div className="mx-5 flex h-[300px] items-center justify-center bg-[#101720] text-red-500 sm:mx-16 sm:h-[333px]">
      {message || 'Error loading data:'} {displayMessage}
    </div>
  );
};

export default ErrorMessage;
