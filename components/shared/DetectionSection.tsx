"use client";

import detectionSectionStyles from "@/styles/components/DetectionSection.module.css";

const MAX_VISIBLE_ITEMS = 10;

export interface DetectionSectionProps {
  icon: string;
  title: string;
  items: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function DetectionSection({
  icon,
  title,
  items,
  isExpanded,
  onToggle,
}: DetectionSectionProps) {
  if (!items || items.length === 0) {
    return (
      <div className={detectionSectionStyles.section}>
        <h4 className={detectionSectionStyles.title}>
          {icon} {title}
        </h4>
        <p className={detectionSectionStyles.empty}>
          No {title.toLowerCase()} detected
        </p>
      </div>
    );
  }

  const hasMore = items.length > MAX_VISIBLE_ITEMS;
  const visibleItems = isExpanded ? items : items.slice(0, MAX_VISIBLE_ITEMS);

  return (
    <div className={detectionSectionStyles.section}>
      <div className={detectionSectionStyles.header}>
        <h4 className={detectionSectionStyles.title}>
          {icon} {title}
        </h4>
        {hasMore && (
          <button
            type="button"
            onClick={onToggle}
            className={detectionSectionStyles.toggle}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      <ul className={detectionSectionStyles.list}>
        {visibleItems.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
