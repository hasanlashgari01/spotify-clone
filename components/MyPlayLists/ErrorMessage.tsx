interface ErrorProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="mx-[20px] flex h-[300px] items-center justify-center bg-[#101720] text-red-500 sm:mx-[64px] sm:h-[333px]">
      Error loading playlist: {message}
    </div>
  );
};

export default ErrorMessage;
