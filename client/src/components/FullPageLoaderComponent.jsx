import { Loader2 } from "lucide-react";

const FullPageLoaderComponent = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center text-center bg-white/60 backdrop-blur-sm z-50">
      <Loader2 className="w-10 h-10 animate-spin text-gray-800" />
    </div>
  )
}

export default FullPageLoaderComponent
