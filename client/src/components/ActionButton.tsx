interface ActionButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  loading?: boolean;
  text?: string;
  classname?: string;
  onClick?: () => void;
}

export default function ActionButton({
  type,
  loading,
  text,
  classname,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`btn h-[40px] hover:text-white border-0 font-bold ${classname}`}
    >
      {loading ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}
