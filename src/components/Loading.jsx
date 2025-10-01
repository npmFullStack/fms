import {
  Loader2
} from "lucide-react";


const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  );
};

export default Loading;