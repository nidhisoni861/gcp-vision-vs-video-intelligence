"use client";

import type { DetectionResults } from '@/redux/types';
import comparisonStyles from '@/styles/components/ComparisonPanel.module.css';

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
  {
    key: 'sentiment',
    label: 'Sentiment / Experience',
    helper:
      'Overall emotional tone inferred from detected labels and extracted text.',
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

export default function   ComparisonPanel({
  imageResults,
  videoResults,
}: ComparisonPanelProps) {
  return (
    <section className={comparisonStyles.section}>
      <div className={comparisonStyles.card}>
        <div className={comparisonStyles.header}>
          <h2 className={comparisonStyles.title}>
            Image vs Video Analysis Comparison
          </h2>
          <p className={comparisonStyles.subtitle}>
            Live comparison based on the image processed by Google Cloud Vision
            API and the video processed by Google Cloud Video Intelligence API.
          </p>
        </div>

        <div className={comparisonStyles.tableWrapper}>
          <table className={comparisonStyles.table}>
            <thead className={comparisonStyles.thead}>
              <tr>
                <th className={comparisonStyles.th}>Aspect</th>
                <th className={comparisonStyles.th}>Image (Vision API)</th>
                <th className={comparisonStyles.th}>Video (Video Intelligence API)</th>
              </tr>
            </thead>
            <tbody>
              {SECTION_METADATA.map(({ key, label, helper }) => (
                <tr key={key}>
                  <td className={comparisonStyles.td}>
                    <div className={comparisonStyles.tdLabel}>{label}</div>
                    <div className={comparisonStyles.tdHelper}>{helper}</div>
                  </td>
                  <td className={comparisonStyles.td}>
                    <div className={comparisonStyles.tdItems}>
                      {imageResults[key].length} items
                    </div>
                    <div className={comparisonStyles.tdPreview}>
                      {summarizeItems(imageResults[key])}
                    </div>
                  </td>
                  <td className={comparisonStyles.td}>
                    <div className={comparisonStyles.tdItems}>
                      {videoResults[key].length} items
                    </div>
                    <div className={comparisonStyles.tdPreview}>
                      {summarizeItems(videoResults[key])}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={comparisonStyles.cardInfo}>
        <div className={comparisonStyles.cardInfoHeader}>
          <h2 className={comparisonStyles.cardInfoTitle}>
            Google Cloud Vision API vs Google Cloud Video Intelligence API
          </h2>
          <p className={comparisonStyles.cardInfoSubtitle}>
            High-level comparison in terms of advantages, disadvantages,
            scalability, performance, durability, image &amp; video analysis,
            accuracy, and pricing model.
          </p>
        </div>

        <div className={comparisonStyles.tableWrapper}>
          <table className={comparisonStyles.table}>
            <thead className={comparisonStyles.thead}>
              <tr>
                <th className={comparisonStyles.th}>Dimension</th>
                <th className={comparisonStyles.th}>Vision API (Images)</th>
                <th className={comparisonStyles.th}>Video Intelligence API (Videos)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Advantages</td>
                <td className={comparisonStyles.td}>
                  Very fast for single images, rich pre-trained features (label
                  detection, OCR, logo detection, face and landmark detection),
                  easy to integrate with web and mobile apps.
                </td>
                <td className={comparisonStyles.td}>
                  Designed for temporal information – can detect labels and
                  objects across frames, actions over time, shot changes, and
                  text appearing at different timestamps in a video.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Disadvantages</td>
                <td className={comparisonStyles.td}>
                  Limited to a single image at a time, cannot understand motion
                  or events that depend on multiple frames, may miss temporal
                  context present only in video.
                </td>
                <td className={comparisonStyles.td}>
                  Processing is slower and more expensive than single-image
                  analysis, upload size and processing-time limits apply, and
                  interpreting long video output is more complex.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Scalability</td>
                <td className={comparisonStyles.td}>
                  Scales well for large batches of independent images; requests
                  are stateless and can be parallelised easily using serverless
                  or microservice architectures.
                </td>
                <td className={comparisonStyles.td}>
                  Scales for large video libraries but requires more storage,
                  network bandwidth, and processing time per request; often
                  processed asynchronously in the background.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Performance &amp; Latency</td>
                <td className={comparisonStyles.td}>
                  Typical latency is low (hundreds of milliseconds to a couple
                  of seconds), which is suitable for near real-time web or
                  mobile interactions.
                </td>
                <td className={comparisonStyles.td}>
                  Latency depends on video duration; long videos are usually
                  processed asynchronously and can take minutes, which is better
                  suited for back-office analytics than real-time UX.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Durability / Use Cases</td>
                <td className={comparisonStyles.td}>
                  Ideal for document digitisation, photo libraries, image search
                  engines, content moderation on images, and quick visual
                  inspection tasks.
                </td>
                <td className={comparisonStyles.td}>
                  Ideal for CCTV analytics, sports and event analysis, content
                  moderation on streaming/recorded video, and understanding user
                  behaviour over time.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Image &amp; Video Analysis Focus</td>
                <td className={comparisonStyles.td}>
                  Focuses on spatial information inside a single frame: what
                  objects, text, and logos are present in a static scene.
                </td>
                <td className={comparisonStyles.td}>
                  Adds temporal understanding: how scenes evolve over time, when
                  objects appear/disappear, and which actions happen in which
                  segments of the video.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Accuracy</td>
                <td className={comparisonStyles.td}>
                  High accuracy for well-lit, high-resolution images. Confidence
                  scores (as percentages) are returned for most detections, as
                  you can see in the results above.
                </td>
                <td className={comparisonStyles.td}>
                  Accuracy is also high but can be affected by motion blur,
                  compression, and frame rate. Confidence scores are provided
                  per segment or frame so you can filter low-confidence
                  detections.
                </td>
              </tr>
              <tr>
                <td className={`${comparisonStyles.td} ${comparisonStyles.tdLabel}`}>Pricing Model</td>
                <td className={comparisonStyles.td}>
                  Billed per image and per feature type (labels, OCR, logos,
                  etc.). Cost is predictable when you know how many images you
                  will analyse.
                </td>
                <td className={comparisonStyles.td}>
                  Billed mainly per processed minute of video and feature type.
                  Overall, analysing long videos is usually more expensive than
                  analysing a few images, but it captures much richer behaviour
                  over time.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
