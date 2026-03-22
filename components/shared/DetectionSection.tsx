"use client";

import detectionSectionStyles from "@/styles/components/DetectionSection.module.css";

const MAX_VISIBLE_ITEMS = 8;

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
  const itemCount = items?.length ?? 0;
  const hasMore = itemCount > MAX_VISIBLE_ITEMS;
  const visibleItems = isExpanded && items ? items : (items ?? []).slice(0, MAX_VISIBLE_ITEMS);
  const isEmpty = !items || items.length === 0;
  console.log(visibleItems , "visibleItems")

  return (
    <article className={detectionSectionStyles.card}>
      <div className={detectionSectionStyles.cardHeader}>
        <div className={detectionSectionStyles.iconWrapper}>
          <span aria-hidden>{icon}</span>
          <h4 className={detectionSectionStyles.title}>{title}</h4>
          {!isEmpty && (
            <span className={detectionSectionStyles.count}>{itemCount}</span>
          )}
        </div>
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
      <div className={detectionSectionStyles.content}>
        {isEmpty ? (
          <p className={detectionSectionStyles.empty}>
            No {title.toLowerCase()} detected
          </p>
        ) : (
          <ul className={detectionSectionStyles.list}>
            {visibleItems.map((item, index) => (
              <li key={`${title}-${index}`} className={detectionSectionStyles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
