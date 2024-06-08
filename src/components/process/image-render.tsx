"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { FC } from "react";

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
  const base64String = `data:image/jpeg;base64,${byteString}`;

  return (
    <div
      className={cn(
        "transition-all duration-300 max-h-36 sticky top-11  ease-linear",
        byteString ? "w-[1200px]" : "w-0"
      )}
    >
      <X
        className="ml-auto w-5 h-5 cursor-pointer text-rose-500"
        onClick={() => setByteString("")}
      />
      <div className="w-full h-full sticky top-0">
        <img
          src={base64String}
          alt={altText || "Rendered Image"}
          className="object-cover w-full "
        />
      </div>
    </div>
  );
};

export default ImageRenderer;
