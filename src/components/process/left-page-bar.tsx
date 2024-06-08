"use client";
import { PdfPagesTypes } from "@/app/process/[pdfId]/page";
import { cn } from "@/lib/utils";
import { ArrowRightFromLine, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback } from "react";

interface LeftPageBarProps {
  pdfPages: PdfPagesTypes[];
  pageId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  setImageByteString: (byteString: string) => void;
}
const LeftPageBar: FC<LeftPageBarProps> = ({
  pdfPages,
  pageId,
  isOpen,
  setOpen,
  setImageByteString,
}) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams);
      if (id) {
        params.set("page", id);
        setImageByteString("");
      } else {
        params.delete("id");
        setImageByteString("");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, setImageByteString]
  );

  return (
    <>
      {!isOpen ? (
        <div
          onClick={() => setOpen(true)}
          className="bg-lightWhite400 cursor-pointer w-fit p-3 rounded-md "
        >
          <ArrowRightFromLine className="w-5 h-5  text-darkBlack700 " />
        </div>
      ) : (
        <div
          className={cn(
            "fixed transition-all duration-150 ease-linear h-[90vh] overflow-y-auto p-1 bg-lightWhite400",
            isOpen ? "w-52" : "w-0"
          )}
        >
          <X
            className="w-5 h-5 text-rose-500 ml-auto cursor-pointer"
            onClick={() => setOpen(false)}
          />
          <div className="flex flex-col space-y-7 p-3 items-center justify-center">
            {pdfPages.map((item) => (
              <div
                key={item._id}
                className="flex flex-col cursor-pointer items-center justify-center space-y-2"
              >
                <div
                  className={cn(
                    "relative w-32 h-32",
                    pageId === item._id &&
                      "border-sdzBlue800 border-2 rounded-md"
                  )}
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
      )}
    </>
  );
};

export default LeftPageBar;
