import { formatVideoResponse } from '@/utils/formatDetectionResults';
import type { DetectionResults } from '@/redux/types';

interface ApiResponse {
  data?: DetectionResults;
  error?: string;
}

export async function analyzeVideoApi(file: File): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch('/api/analyze-video', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      return { error: data.error };
    }

    const formatted = formatVideoResponse(data);
    return { data: formatted };
  } catch (error) {
    console.error('Error analyzing video:', error);
    return { error: 'Error analyzing video. Check console for details.' };
  }
}
