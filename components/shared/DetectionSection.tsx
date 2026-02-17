"use client";

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
  const visibleItems = isExpanded ? items : items.slice(0, MAX_VISIBLE_ITEMS);

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
            {isExpanded ? "Show less" : "Show more"}
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
