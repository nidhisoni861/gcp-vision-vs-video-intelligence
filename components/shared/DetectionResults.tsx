"use client";

import { useState } from "react";
import { DetectionSection } from "./DetectionSection";
import type { DetectionResults as DetectionResultsType } from "@/redux/types";

interface DetectionResultsProps {
  results: DetectionResultsType | null;
  error: string | null;
}

const SECTIONS = [
  { key: "labels" as const, icon: "🏷️", title: "Labels" },
  { key: "objects" as const, icon: "🎯", title: "Objects" },
  { key: "text" as const, icon: "📝", title: "Text" },
  { key: "logos" as const, icon: "🎭", title: "Logos" },
  { key: "sentiment" as const, icon: "💬", title: "Sentiment / Experience" },
] as const;

export function DetectionResults({ results, error }: DetectionResultsProps) {
  const [expandedSections, setExpandedSections] = useState({
    labels: false,
    objects: false,
    text: false,
    logos: false,
    sentiment: false,
  });

  if (!results && !error) return null;

  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Results:</h3>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      )}
      {results && (
        <div className="space-y-4 text-sm">
          {SECTIONS.map(({ key, icon, title }) => (
            <DetectionSection
              key={key}
              icon={icon}
              title={title}
              items={results[key]}
              isExpanded={expandedSections[key]}
              onToggle={() =>
                setExpandedSections((prev) => ({
                  ...prev,
                  [key]: !prev[key],
                }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
