"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { FC, useMemo } from "react";

interface ImageRenderProps {
  byteString: string;
  altText: string;
  setByteString: (byteString: string) => void;
}
const ImageRenderer: FC<ImageRenderProps> = ({
  byteString,
  altText,
  setByteString,
}) => {
  // Convert the byte string to a Base64 encoded string
  const base64String = useMemo(() => {
    return `data:image/jpeg;base64,${byteString}`;
  }, [byteString]);

  return (
    <div
      className={cn(
        "transition-all duration-300 h-[500px] overflow-x-auto sticky top-20  ease-linear",
        byteString ? "w-[900px]" : "w-0"
      )}
    >
      <X
        className="ml-auto fixed z-20 w-5 h-5 cursor-pointer  text-rose-500"
        onClick={() => setByteString("")}
      />
      <div className="w-[1000px] mt-9 overflow-x-auto h-full sticky top-0">
        <img
          src={base64String}
          alt={altText || "Rendered Image"}
          className="object-cover w-full"
        />
      </div>
    </div>
  );
};

export default ImageRenderer;
