"use client";

import fileUploadStyles from "@/styles/components/FileUpload.module.css";

interface FileUploadProps {
  accept: string;
  onChange: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
}

export function FileUpload({
  accept,
  onChange,
  label = "Choose file",
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className={fileUploadStyles.wrapper}>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className={fileUploadStyles.input}
        aria-label={label}
      />
    </div>
  );
}
