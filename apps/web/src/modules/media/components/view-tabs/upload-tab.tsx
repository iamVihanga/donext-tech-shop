"use client";
import { IconSlideshow } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon, UploadIcon, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Image from "next/image";
import { toast } from "sonner";
import { MediaService } from "../../service";
import { Media } from "../../types";
import { ActiveTab } from "../gallery-view";

type Props = {
  currentTab: ActiveTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
};

export default function UploadTab({ currentTab, setCurrentTab }: Props) {
  // If the current tab is not "upload", return null to avoid rendering this component
  if (currentTab !== "upload") {
    return null;
  }

  const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
  const queryClient = useQueryClient();
  const mediaService = MediaService.getInstance();

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<Media[] | null>(null);

  const onDrop = useCallback(
    async (selectedFiles: File[]) => {
      let newFiles: File[] = [];

      selectedFiles.forEach((file) => {
        // Check if the file already exists in the accepted files
        const isDuplicate = acceptedFiles.some(
          (acceptedFile) => acceptedFile.name === file.name
        );

        if (isDuplicate) {
          toast.error(`File already exists in the list.`);
        } else {
          newFiles.push(file);
        }
      });

      if (newFiles.length > 0) {
        setAcceptedFiles((prev) => [...prev, ...newFiles]);
      }

      setUploadResult(null);
    },
    [acceptedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    multiple: true
  });

  const handleDelete = (e: React.MouseEvent, file: File) => {
    e.preventDefault();
    e.stopPropagation();
    setAcceptedFiles?.((prev) => prev.filter((f) => f.name !== file.name));
  };

  const handleUpload = async () => {
    console.log({ acceptedFiles });
  };

  return (
    <div className="h-full flex-1">
      {/* Upload Dropzone */}
      {acceptedFiles.length < 1 && (
        <div
          className={`w-full h-[340px] rounded-sm bg-zinc-100 hover:bg-primary/10 transition-all duration-200 hover:border-1 border-dashed hover:border-primary/50 flex items-center justify-center flex-col hover:cursor-pointer ${isDragActive ? "border-primary border-[1.5px]" : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <IconSlideshow className="size-16 text-primary mb-2" />

          <div className="mt-3 text-center space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              Upload your media files
            </h3>

            <div className="flex items-center flex-col justify-center space-y-1">
              <p className="text-sm text-primary/70">
                Drag and drop files here or click to select files from your
                device.
              </p>

              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{`Images, Videos & Docs`}</Badge>
                <Badge variant={"outline"}>
                  Max Size: {Number(MAX_SIZE / 1024 / 1024)} MB
                </Badge>
              </div>
            </div>

            <Button
              className="mt-2 cursor-pointer hover:shadow-lg"
              icon={<UploadIcon />}
            >
              Choose Files
            </Button>
          </div>
        </div>
      )}

      {/* Uploaded File list */}
      {acceptedFiles.length > 0 && (
        <Card className="w-full h-full min-h-[300px] rounded-sm px-4 py-3 shadow-none relative overflow-hidden transition-all duration-200 flex flex-col border-secondary/90">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Uploaded Files <span>{`(${acceptedFiles.length})`}</span>
            </h4>

            <div className="flex items-center gap-2">
              <Button
                className="cursor-pointer"
                icon={<XIcon />}
                variant={"link"}
                size="sm"
                onClick={() => setAcceptedFiles([])}
              >
                Clear Selection
              </Button>
              <Button
                className="cursor-pointer rounded-sm min-w-28 text-xs"
                icon={<UploadIcon />}
                variant={"default"}
                size="sm"
                onClick={handleUpload}
              >
                Upload All
              </Button>
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 w-full relative" {...getRootProps()}>
            <input {...getInputProps()} />

            {/* Floating Add More Button */}
            <Button
              className="rounded-full size-11 absolute bottom-2 right-4 z-20 hover:shadow-lg cursor-pointer hover:-translate-y-1 transition-all duration-200"
              size="icon"
            >
              <PlusIcon className="size-7" />
            </Button>

            {/* Drop State Overlay */}
            {isDragActive && (
              <div className="absolute inset-0 bg-primary/25 border-2 border-dashed border-primary/50 rounded-sm flex items-center justify-center flex-col gap-3 z-20 backdrop-blur-xs text-primary-foreground">
                <UploadIcon className="size-8 animate-bounce" />
                <p className="font-semibold text-lg">Drop files here</p>
              </div>
            )}

            <div className="grid grid-cols-5 gap-4">
              {acceptedFiles.map((file, index) => (
                <UploadedImageCard
                  key={index}
                  file={file}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function UploadedImageCard({
  file,
  handleDelete
}: {
  file: File;
  handleDelete: (e: React.MouseEvent, file: File) => void;
}) {
  return (
    <div
      className={`group w-full aspect-square rounded-md relative overflow-hidden hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:border-3 border-primary`}
    >
      <Image
        src={URL.createObjectURL(file)}
        alt={file.name}
        width={300}
        height={300}
        className="object-cover w-full h-full"
      />

      <Button
        size="icon"
        className={`hidden group-hover:flex absolute top-2 right-2 rounded-full shadow-md z-20 cursor-pointer`}
        variant={"destructive"}
        onClick={(e) => handleDelete(e, file)}
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}
