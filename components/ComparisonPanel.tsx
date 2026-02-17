"use client";

import type { DetectionResults } from '@/redux/types';

interface ComparisonPanelProps {
  imageResults: DetectionResults;
  videoResults: DetectionResults;
}

const SECTION_METADATA: Array<{
  key: keyof DetectionResults;
  label: string;
  helper: string;
}> = [
  {
    key: 'labels',
    label: 'Labels',
    helper: 'High-level categories describing the scene or content.',
  },
  {
    key: 'objects',
    label: 'Objects',
    helper: 'Concrete items or entities detected in the frame(s).',
  },
  {
    key: 'text',
    label: 'Text',
    helper: 'OCR-style extraction of visible text content.',
  },
  {
    key: 'logos',
    label: 'Logos',
    helper: 'Brand or product logos recognized by the models.',
  },
];

function summarizeItems(items: string[]): string {
  if (!items || items.length === 0) {
    return 'None detected';
  }

  const preview = items.slice(0, 3).join(', ');
  const remaining = items.length - 3;

  if (remaining > 0) {
    return `${preview}  (+${remaining} more)`;
  }

  return preview;
}

export default function ComparisonPanel({
  imageResults,
  videoResults,
}: ComparisonPanelProps) {
  return (
    <section className="space-y-8">
      {/* Dynamic comparison based on actual API results */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/40 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            Image vs Video Analysis Comparison
          </h2>
          <p className="mt-1 text-sm text-purple-100">
            Live comparison based on the image processed by Google Cloud Vision
            API and the video processed by Google Cloud Video Intelligence API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/70">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aspect
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Image (Vision API)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Video (Video Intelligence API)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {SECTION_METADATA.map(({ key, label, helper }) => (
                <tr key={key}>
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {label}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {helper}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">
                        {imageResults[key].length}
                      </span>{' '}
                      items
                    </div>
                    <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                      {summarizeItems(imageResults[key])}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">
                        {videoResults[key].length}
                      </span>{' '}
                      items
                    </div>
                    <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                      {summarizeItems(videoResults[key])}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conceptual service comparison to support the written report */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Google Cloud Vision API vs Google Cloud Video Intelligence API
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            High-level comparison in terms of advantages, disadvantages,
            scalability, performance, durability, image &amp; video analysis,
            accuracy, and pricing model.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/70">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dimension
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vision API (Images)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Video Intelligence API (Videos)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Advantages
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Very fast for single images, rich pre-trained features (label
                  detection, OCR, logo detection, face and landmark detection),
                  easy to integrate with web and mobile apps.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Designed for temporal information – can detect labels and
                  objects across frames, actions over time, shot changes, and
                  text appearing at different timestamps in a video.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Disadvantages
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Limited to a single image at a time, cannot understand motion
                  or events that depend on multiple frames, may miss temporal
                  context present only in video.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Processing is slower and more expensive than single-image
                  analysis, upload size and processing-time limits apply, and
                  interpreting long video output is more complex.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Scalability
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Scales well for large batches of independent images; requests
                  are stateless and can be parallelised easily using serverless
                  or microservice architectures.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Scales for large video libraries but requires more storage,
                  network bandwidth, and processing time per request; often
                  processed asynchronously in the background.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Performance &amp; Latency
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Typical latency is low (hundreds of milliseconds to a couple
                  of seconds), which is suitable for near real-time web or
                  mobile interactions.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Latency depends on video duration; long videos are usually
                  processed asynchronously and can take minutes, which is better
                  suited for back-office analytics than real-time UX.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Durability / Use Cases
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Ideal for document digitisation, photo libraries, image search
                  engines, content moderation on images, and quick visual
                  inspection tasks.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Ideal for CCTV analytics, sports and event analysis, content
                  moderation on streaming/recorded video, and understanding user
                  behaviour over time.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Image &amp; Video Analysis Focus
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Focuses on spatial information inside a single frame: what
                  objects, text, and logos are present in a static scene.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Adds temporal understanding: how scenes evolve over time, when
                  objects appear/disappear, and which actions happen in which
                  segments of the video.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Accuracy
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  High accuracy for well-lit, high-resolution images. Confidence
                  scores (as percentages) are returned for most detections, as
                  you can see in the results above.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Accuracy is also high but can be affected by motion blur,
                  compression, and frame rate. Confidence scores are provided
                  per segment or frame so you can filter low-confidence
                  detections.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  Pricing Model
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Billed per image and per feature type (labels, OCR, logos,
                  etc.). Cost is predictable when you know how many images you
                  will analyse.
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  Billed mainly per processed minute of video and feature type.
                  Overall, analysing long videos is usually more expensive than
                  analysing a few images, but it captures much richer behaviour
                  over time.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
          Note: The high-level comparison above is based on typical behaviour of
          Google Cloud Vision and Video Intelligence APIs. Always check the
          latest Google Cloud documentation for up-to-date feature set and
          pricing details.
        </div>
      </div>
    </section>
  );
}

