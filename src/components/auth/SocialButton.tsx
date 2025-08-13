type SocialButtonProps = {
  iconSrc: string;
  text: string;
  onClick?: () => void;
};

const SocialButton = ({ iconSrc, text, onClick }: SocialButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 sm:h-10 w-full max-w-[320px] items-center justify-center gap-2.5 rounded-2xl border-2 border-[#1574f5] transition-all duration-300 hover:scale-[1.01] hover:bg-[#1574f5]/10"
    >
      <img src={iconSrc} alt={text} className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="text-[13px] sm:text-sm">Sign up with {text}</span>
    </button>
  );
};

export default SocialButton;


