import { SparklesIcon } from "@heroicons/react/24/outline";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <SparklesIcon className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  );
};

export default Loading;