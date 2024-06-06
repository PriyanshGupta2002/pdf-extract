"use client";
import React, { FC, useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import UploadModal from "../modals/upload-modal";

interface HeaderProps {
  fetchPdfList: () => void;
}
const Header: FC<HeaderProps> = ({ fetchPdfList }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);
  return (
    <div className="flex items-end">
      <UploadModal open={isOpen} setOpen={onOpen} fetchPdfList={fetchPdfList} />
      <div className="ml-auto flex items-center gap-2">
        <div className="bg-lightWhite400 flex items-center">
          <Input className="w-full " placeholder="Search for pdf..." />
        </div>
        <Button variant={"primary"} onClick={() => setIsOpen(true)}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Header;
