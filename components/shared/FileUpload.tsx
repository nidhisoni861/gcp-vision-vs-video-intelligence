"use client";

interface FileUploadProps {
  accept: string;
  onChange: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
}

export function FileUpload({
  accept,
  onChange,
  selectedFile,
  label = "Choose file",
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-label={label}
      />
    </div>
  );
}
