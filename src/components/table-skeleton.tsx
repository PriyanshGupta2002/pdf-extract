import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeletonLoader() {
  const rows = 5; // Number of skeleton rows to display

  return (
    <div className="max-w-7xl m-auto flex flex-col space-y-6 w-full">
      <div className="bg-lightWhite300 text-darkBlack700 font-semibold text-sm rounded-md">
        <div className="flex">
          <div className="w-1/3 p-2">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="w-1/3 p-2">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="w-1/3 p-2">
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4 p-2 border-b">
            <div className="w-1/3">
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="w-1/3">
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="w-1/3">
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeletonLoader;
