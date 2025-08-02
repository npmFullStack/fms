import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex justify-center items-center">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    </div>
  );
};

export default Loading;
