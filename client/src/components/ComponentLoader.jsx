import { Loader2 } from "lucide-react";

const ComponentLoader = ({
  size = 26,
  text,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 py-4 ${className}`}
    >
      <Loader2
        size={size}
        className="animate-spin text-gray-600"
      />
      {text && (
        <span className="text-sm text-gray-500">
          {text}
        </span>
      )}
    </div>
  );
};

export default ComponentLoader;
