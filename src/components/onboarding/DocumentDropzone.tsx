"use client";

import { useRef, useState } from "react";

type DocumentDropzoneProps = {
  label: string;
  hint?: string;
  accept?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function DocumentDropzone({
  label,
  hint = "PDF, JPG, or PNG up to 10MB",
  accept = ".pdf,.jpg,.jpeg,.png",
  files,
  onFilesChange,
}: DocumentDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    onFilesChange([...files, ...Array.from(fileList)]);
  }

  return (
    <div className="space-y-xs">
      <label className="text-label-sm text-on-surface-variant">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={[
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-xl py-2xl text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-outline-variant bg-surface-container-low hover:border-primary/50",
        ].join(" ")}
      >
        <span className="material-symbols-outlined mb-sm text-4xl text-primary">
          cloud_upload
        </span>
        <p className="text-label-md text-on-surface">
          Drag & drop files here, or click to browse
        </p>
        <p className="mt-xs text-label-sm text-on-surface-variant">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-xs">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm"
            >
              <div className="flex min-w-0 items-center gap-sm">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                <span className="truncate text-body-sm text-on-surface">
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))
                }
                className="text-label-sm text-error transition-colors hover:opacity-80"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
