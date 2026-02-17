/**
 * Shared types for Vision and Video detection results
 */
export interface DetectionResults {
  labels: string[];
  objects: string[];
  text: string[];
  logos: string[];
}
