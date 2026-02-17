"use client";

import { useState } from 'react';
import Image from "next/image";

// This is a client component that will handle the file upload
function VisionTest() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{
    labels: string[];
    objects: string[];
    text: string[];
    logos: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    labels: false,
    objects: false,
    text: false,
    logos: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    setExpandedSections({
      labels: false,
      objects: false,
      text: false,
      logos: false,
    });
    
    try {
      // Create form data to send to our API route
      const formData = new FormData();
      formData.append('image', file);
      
      // Call our API route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(`Error: ${data.error}`);
      } else {
        const reorderUniqueFirst = <T,>(items: T[], getKey: (item: T) => string): T[] => {
          const seen = new Set<string>();
          const uniques: T[] = [];
          const duplicates: T[] = [];
          for (const item of items) {
            const key = getKey(item);
            if (!seen.has(key)) {
              seen.add(key);
              uniques.push(item);
            } else {
              duplicates.push(item);
            }
          }
          return uniques.concat(duplicates);
        };

        const getUniqueByKey = <T,>(
          items: T[] | undefined,
          getKey: (item: T) => string,
          getScore?: (item: T) => number | undefined,
          format?: (key: string, score?: number) => string
        ): string[] => {
          if (!items || items.length === 0) return [];
          const map = new Map<string, { score?: number }>();
          items.forEach((item) => {
            const key = getKey(item);
            const score = getScore ? getScore(item) : undefined;
            const existing = map.get(key);
            if (
              !existing ||
              (score !== undefined &&
                (existing.score === undefined || score > existing.score))
            ) {
              map.set(key, { score });
            }
          });
          return Array.from(map.entries()).map(([key, value]) =>
            format ? format(key, value.score) : key
          );
        };

        // Format labels (deduplicated by description, keep highest score)
        const labels = getUniqueByKey(
          data.labels,
          (label: any) => label.description,
          (label: any) => Math.round(label.score * 100),
          (description, score) =>
            score !== undefined ? `${description} (${score}%)` : description
        );

        // Format objects (KEEP duplicates; reorder so first 10 looks diverse)
        type ObjectDisplayItem = { key: string; display: string };
        const objectItems: ObjectDisplayItem[] = (data.objects || []).map((object: any) => {
          const name = String(object.name ?? 'Unknown');
          const score = Math.round((object.score ?? 0) * 100);
          return {
            key: name.trim().toLowerCase(),
            display: `${name} (${score}%)`,
          };
        });
        const objects = reorderUniqueFirst<ObjectDisplayItem>(objectItems, (o) => o.key).map(
          (o) => o.display
        );

        // Format text (skip full text block, deduplicate by description)
        const text = getUniqueByKey(
          data.text?.slice(1),
          (textItem: any) => textItem.description,
          undefined,
          (description) => `"${description}"`
        );

        // Format logos (deduplicated by description, keep highest score)
        const logos = getUniqueByKey(
          data.logos,
          (logo: any) => logo.description,
          (logo: any) => Math.round(logo.score * 100),
          (description, score) =>
            score !== undefined ? `${description} (${score}%)` : description
        );

        setResults({
          labels,
          objects,
          text,
          logos,
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Error analyzing image. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Google Vision API Test
      </h1>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      
      <button
        onClick={analyzeImage}
        disabled={!file || isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          !file || isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Image'}
      </button>
      
      {file && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Preview:</h3>
          <div className="mt-2 w-full max-w-xs">
            <Image
              src={URL.createObjectURL(file)}
              alt="Preview"
              width={300}
              height={200}
              className="rounded-md"
            />
          </div>
        </div>
      )}
      
      {(results || error) && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Results:</h3>
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}
          {results && (
            <div className="space-y-4 text-sm">
              <DetectionSection
                icon="🏷️"
                title="Labels"
                items={results.labels}
                isExpanded={expandedSections.labels}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    labels: !prev.labels,
                  }))
                }
              />
              <DetectionSection
                icon="🎯"
                title="Objects"
                items={results.objects}
                isExpanded={expandedSections.objects}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    objects: !prev.objects,
                  }))
                }
              />
              <DetectionSection
                icon="📝"
                title="Text"
                items={results.text}
                isExpanded={expandedSections.text}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    text: !prev.text,
                  }))
                }
              />
              <DetectionSection
                icon="🎭"
                title="Logos"
                items={results.logos}
                isExpanded={expandedSections.logos}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    logos: !prev.logos,
                  }))
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type DetectionSectionProps = {
  icon: string;
  title: string;
  items: string[];
  isExpanded: boolean;
  onToggle: () => void;
};

const MAX_VISIBLE_ITEMS = 10;

function DetectionSection({
  icon,
  title,
  items,
  isExpanded,
  onToggle,
}: DetectionSectionProps) {
  if (!items || items.length === 0) {
    return (
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {icon} {title}
        </h4>
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          No {title.toLowerCase()} detected
        </p>
      </div>
    );
  }

  const hasMore = items.length > MAX_VISIBLE_ITEMS;
  const visibleItems = isExpanded
    ? items
    : items.slice(0, MAX_VISIBLE_ITEMS);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {icon} {title}
        </h4>
        {hasMore && (
          <button
            type="button"
            onClick={onToggle}
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      <ul className="mt-1 list-disc list-inside space-y-0.5 text-gray-700 dark:text-gray-200">
        {visibleItems.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default VisionTest;
