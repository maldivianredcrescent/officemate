"use client";

import { toast, useToast } from "@/hooks/use-toast";
import Link from "next/link";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileUpload({ onSuccess, defaultValue, label }) {
  const [fileUrl, setFileUrl] = React.useState(defaultValue);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (defaultValue) {
      setFileUrl(defaultValue);
    }
  });

  const uploadFile = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file-input", file);

    if (file.size > 1 * 2024 * 2024) {
      // Check if file size is greater than 1 MB
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "File too large",
        description:
          "The file is too large. Please upload a file less than 2 MB.",
      });
      return; // Exit the function if the file is too large
    }
    try {
      const response = await fetch(`/api/upload-file`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.message === "success") {
        setFileUrl(result.fileUrl); // Assuming the response contains the file URL
        onSuccess(result.fileUrl);
        toast({
          title: "Image uploaded",
          description: "The image has been uploaded successfully.",
        });
      } else {
        console.error("File upload failed");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading file:", error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    uploadFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      {label && (
        <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </p>
      )}
      <div className="cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="border-2 border-dashed border-border rounded-xl p-6 mt-4 bg-white">
            <p className="text-sm text-center opacity-60">
              Drop the files here ...
            </p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-xl p-6 mt-4 bg-white">
            <p className="text-sm text-center opacity-60">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="w-full">
          <div className="w-full flex justify-center items-center py-12">
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}
      {fileUrl ? (
        fileUrl.endsWith(".jpg") ||
        fileUrl.endsWith(".jpeg") ||
        fileUrl.endsWith(".png") ||
        fileUrl.endsWith(".gif") ||
        fileUrl.endsWith(".bmp") ||
        fileUrl.endsWith(".webp") ||
        fileUrl.endsWith(".svg") ? (
          <div className="h-auto overflow-hidden flex justify-center items-center mt-6 rounded-xl">
            <Link href={fileUrl} target="_blank" className="w-full">
              <img
                className="rounded-xl w-full"
                src={fileUrl}
                alt="Uploaded File"
              />
            </Link>
          </div>
        ) : (
          <>
            {fileUrl && (
              <Link
                href={fileUrl}
                download
                className="mt-2 text-black flex justify-center items-center h-[40px] text-sm bg-[#2D1912] hover:bg-[#2D1912]/90 shadow-none rounded-lg"
              >
                Download File
              </Link>
            )}
          </>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default FileUpload;
