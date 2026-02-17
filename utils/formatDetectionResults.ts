import type { DetectionResults } from '@/redux/types';

function computeSentimentSummary(
  labelDescriptions: string[] = [],
  textContents: string[] = []
): string[] {
  const POSITIVE_KEYWORDS = [
    'happy',
    'joy',
    'smile',
    'smiling',
    'laugh',
    'laughing',
    'celebration',
    'party',
    'success',
    'win',
    'love',
    'excited',
    'fun',
    'beautiful',
    'great',
    'good',
  ];

  const NEGATIVE_KEYWORDS = [
    'sad',
    'cry',
    'crying',
    'anger',
    'angry',
    'upset',
    'bad',
    'terrible',
    'hate',
    'hurt',
    'fear',
    'scared',
    'accident',
    'death',
    'violence',
    'fight',
    'conflict',
    'failure',
  ];

  const content = [...labelDescriptions, ...textContents]
    .join(' ')
    .toLowerCase()
    .trim();

  if (!content) {
    return ['Overall sentiment: Neutral / no strong emotion detected'];
  }

  const countMatches = (words: string[]) =>
    words.reduce(
      (count, word) => (content.includes(word.toLowerCase()) ? count + 1 : count),
      0
    );

  const positiveScore = countMatches(POSITIVE_KEYWORDS);
  const negativeScore = countMatches(NEGATIVE_KEYWORDS);

  if (positiveScore === 0 && negativeScore === 0) {
    return ['Overall sentiment: Neutral / no strong emotion detected'];
  }

  if (positiveScore > negativeScore) {
    return ['Overall sentiment: Happy / positive experience'];
  }

  if (negativeScore > positiveScore) {
    return ['Overall sentiment: Sad / negative experience'];
  }

  return ['Overall sentiment: Mixed experience (both positive and negative cues)'];
}

/**
 * Reorder items so unique values appear first, duplicates at the end.
 */
function reorderUniqueFirst<T>(items: T[], getKey: (item: T) => string): T[] {
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
}

/**
 * Deduplicate items by key, keeping the one with highest score.
 */
function getUniqueByKey<T>(
  items: T[] | undefined,
  getKey: (item: T) => string,
  getScore?: (item: T) => number | undefined,
  format?: (key: string, score?: number) => string
): string[] {
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
}

/** Format Vision API response into DetectionResults */
export function formatVisionResponse(data: {
  labels?: Array<{ description: string; score?: number }>;
  objects?: Array<{ name?: string; score?: number }>;
  text?: Array<{ description: string }>;
  logos?: Array<{ description: string; score?: number }>;
}): DetectionResults {
  const rawLabelDescriptions =
    data.labels?.map((label) => label.description).filter(Boolean) ?? [];
  const rawTextContents =
    data.text?.map((t) => t.description).filter(Boolean) ?? [];

  const labels = getUniqueByKey(
    data.labels,
    (label) => label.description,
    (label) => Math.round((label.score ?? 0) * 100),
    (desc, score) => (score !== undefined ? `${desc} (${score}%)` : desc)
  );

  type ObjectDisplayItem = { key: string; display: string };
  const objectItems: ObjectDisplayItem[] = (data.objects || []).map((obj) => {
    const name = String(obj.name ?? 'Unknown');
    const score = Math.round((obj.score ?? 0) * 100);
    return { key: name.trim().toLowerCase(), display: `${name} (${score}%)` };
  });
  const objects = reorderUniqueFirst(objectItems, (o) => o.key).map(
    (o) => o.display
  );

  const text = getUniqueByKey(
    data.text?.slice(1),
    (t) => t.description,
    undefined,
    (desc) => `"${desc}"`
  );

  const logos = getUniqueByKey(
    data.logos,
    (logo) => logo.description,
    (logo) => Math.round((logo.score ?? 0) * 100),
    (desc, score) => (score !== undefined ? `${desc} (${score}%)` : desc)
  );

  const sentiment = computeSentimentSummary(rawLabelDescriptions, rawTextContents);

  return { labels, objects, text, logos, sentiment };
}

/** Format Video API response into DetectionResults */
export function formatVideoResponse(data: {
  labels?: Array<{ description: string; confidence?: number }>;
  // Support both shapes:
  // - { entity: { description }, confidence }  (raw Video Intelligence response)
  // - { description, confidence }             (our API route-flattened shape)
  objects?: Array<{
    entity?: { description?: string };
    description?: string;
    confidence?: number;
  }>;
  text?: Array<{
    text: string;
    segments?: Array<{ confidence?: number }>;
  }>;
  logos?: Array<{ description?: string; confidence?: number }>;
}): DetectionResults {
  const rawLabelDescriptions =
    data.labels?.map((l) => l.description).filter(Boolean) ?? [];
  const rawTextContents =
    data.text?.map((t) => t.text).filter(Boolean) ?? [];

  const labels = getUniqueByKey(
    data.labels,
    (l) => l.description,
    (l) => Math.round((l.confidence ?? 0) * 100),
    (desc, score) => (score !== undefined ? `${desc} (${score}%)` : desc)
  );

  type ObjectDisplayItem = { key: string; display: string };
  const objectItems: ObjectDisplayItem[] = (data.objects || []).map((obj) => {
    // Prefer flattened description from our API route, but
    // fall back to the nested entity.description if needed.
    const rawDescription =
      obj.description ?? obj.entity?.description ?? 'Unknown';
    const description = String(rawDescription);
    const confidence = Math.round((obj.confidence ?? 0) * 100);
    return {
      key: description.trim().toLowerCase(),
      display: `${description} (${confidence}%)`,
    };
  });
  const objects = reorderUniqueFirst(objectItems, (o) => o.key).map(
    (o) => o.display
  );

  const text = getUniqueByKey(
    data.text,
    (t) => t.text,
    (t) => Math.round((t.segments?.[0]?.confidence ?? 0) * 100),
    (val, score) =>
      score !== undefined ? `"${val}" (${score}%)` : `"${val}"`
  );

  const logos = getUniqueByKey(
    data.logos,
    (l) => l.description ?? '',
    (l) => Math.round((l.confidence ?? 0) * 100),
    (desc, score) => (score !== undefined ? `${desc} (${score}%)` : desc)
  );

  const sentiment = computeSentimentSummary(rawLabelDescriptions, rawTextContents);

  return { labels, objects, text, logos, sentiment };
}
