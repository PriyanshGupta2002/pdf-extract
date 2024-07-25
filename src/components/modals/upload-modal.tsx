"use client";

import React, { FC, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { File as FileIcon, Flag, Loader, X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import axios from "axios";
import { FILE_UPLOAD_API, PDF_PROCESSING_API } from "@/lib/constants";
import { useToast } from "../ui/use-toast";

interface UploadModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchPdfList: () => void;
}

interface fileType {
  file: File;
  name: string;
  size: number;
}

interface fileUploadDataProps {
  URL: string;
  file_extension: string;
  file_name: string;
  file_path: string;
  file_type: string;
  message: string;
  _id: string;
}

const UploadModal: FC<UploadModalProps> = ({ open, setOpen, fetchPdfList }) => {
  const [files, setFiles] = useState<fileType[]>([]);
  let filesId: string[];
  //   const [filesId, setFilesId] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const acceptedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    const filteredFiles = acceptedFiles.filter((file) =>
      acceptedFileTypes.includes(file.type)
    );
    const mappedFiles = filteredFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...mappedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteSelectedFile = (name: string) => {
    setFiles((prev) => prev.filter((item) => item.name !== name));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      return toast({
        title: "No files are selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
    }
    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append("files", file);
    });

    try {
      setIsUploading(true);
      const { data }: { data: fileUploadDataProps[] } = await axios.post(
        FILE_UPLOAD_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileId = data.map((item) => item._id);
      filesId = fileId;
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      setOpen(false);
      setFiles([]);
      toast({
        title: "Pdf processing is started",
      });
      await fetchPdfList();
      await axios.post(PDF_PROCESSING_API, {
        file_ids: filesId,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm text-[#6F6F8D]">
            Upload multiple pdf or images
          </DialogTitle>
        </DialogHeader>
        <div {...getRootProps()}>
          <Input
            accept=".pdf, image/jpeg, image/png, image/gif"
            {...getInputProps()}
          />
          {isDragActive ? (
            <div className="p-24 text-sm gap-2 cursor-pointer text-[#6F6F8D] flex items-center flex-col rounded-md justify-center border-2 border-dashed border-gray-300">
              <div className="bg-lightWhite400 p-2 rounded-md">
                <Image
                  src={"/assets/drop.svg"}
                  width={26}
                  height={26}
                  alt="drop"
                />
                Drop here
              </div>
            </div>
          ) : (
            <div className="p-24 text-sm gap-2 cursor-pointer text-[#6F6F8D] flex items-center rounded-md justify-center border-2 border-dashed border-gray-300">
              <div className="bg-lightWhite400 p-2 rounded-md">
                <Image
                  src={"/assets/drop.svg"}
                  width={26}
                  height={26}
                  alt="drop"
                />
              </div>
              Drag &amp; drop some files here, or click to select files
            </div>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-3">
          {files.map((item, idx) => (
            <div className="flex flex-col gap-3" key={idx}>
              <div className="bg-lightWhite300 flex items-center justify-center p-4 rounded-md relative">
                <FileIcon className="text-sdzBlueInteractive" />
                <X
                  className="text-rose-500 cursor-pointer absolute -top-2 -right-2"
                  onClick={() => handleDeleteSelectedFile(item.name)}
                />
              </div>
              {item.name.substring(0, 6)}...
            </div>
          ))}
        </div>
        <Button
          variant={"primary"}
          className="disabled:bg-[#405cd7] disabled:cursor-not-allowed"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader className="animate-spin duration-200 h-5 w-5" />
          ) : (
            "Upload"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
