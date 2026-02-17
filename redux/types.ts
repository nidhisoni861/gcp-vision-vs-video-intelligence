/**
 * Shared types for Vision and Video detection results
 */
export interface DetectionResults {
  labels: string[];
  objects: string[];
  text: string[];
  logos: string[];
  /** Simple high-level sentiment / experience summary, e.g. "Happy / positive experience" */
  sentiment: string[];
}
