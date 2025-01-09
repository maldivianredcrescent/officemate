import LoadingIndicator from "@/components/ui/loading-indicator";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <LoadingIndicator />
    </div>
  );
};

export default Loading;
