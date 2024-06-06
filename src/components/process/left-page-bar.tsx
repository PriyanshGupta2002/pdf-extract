"use client";
import { PdfPagesTypes } from "@/app/process/[pdfId]/page";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback } from "react";

interface LeftPageBarProps {
  pdfPages: PdfPagesTypes[];
}
const LeftPageBar: FC<LeftPageBarProps> = ({ pdfPages }) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams);
      if (id) {
        params.set("page", id);
      } else {
        params.delete("id");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="fixed w-52 h-[90vh] overflow-y-auto p-1 bg-lightWhite400">
      <div className="flex flex-col space-y-7 p-3 items-center justify-center">
        {pdfPages.map((item) => (
          <div
            key={item._id}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <div
              className="relative w-32 h-32"
              onClick={() => handleClick(item._id)}
            >
              <Image
                src={item.Crop_URL}
                fill
                className="object-cover rounded-md"
                alt="image"
              />
            </div>
            <span className="text-xs text-darkBlack600">{item._id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPageBar;
