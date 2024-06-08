import { cn } from "@/lib/utils";
import React from "react";

const Wrapper = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 bg-[#FFFFFF] p-6 rounded-md",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Wrapper;
