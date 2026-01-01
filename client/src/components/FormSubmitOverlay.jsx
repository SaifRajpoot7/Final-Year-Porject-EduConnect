import { Loader2 } from "lucide-react";

const FormSubmitOverlay = ({ isSubmitting, text = "Submitting..." }) => {
  if (!isSubmitting) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white/70 backdrop--sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
        <span className="text-sm text-gray-600">
          {text}
        </span>
      </div>
    </div>
  );
};

export default FormSubmitOverlay;
