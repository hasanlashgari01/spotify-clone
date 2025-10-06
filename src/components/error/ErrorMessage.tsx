interface ErrorProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ error }) => {
  return (
    <div className="mx-[20px] flex h-[300px] items-center justify-center bg-[#101720] text-red-500 sm:mx-[64px] sm:h-[333px]">
      Error loading songs: {error}
    </div>
  );
};

export default ErrorMessage;
