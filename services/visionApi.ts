import { formatVisionResponse } from '@/utils/formatDetectionResults';
import type { DetectionResults } from '@/redux/types';

interface ApiResponse {
  data?: DetectionResults;
  error?: string;
}

export async function analyzeImageApi(file: File): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      return { error: data.error };
    }

    const formatted = formatVisionResponse(data);
    return { data: formatted };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return { error: 'Error analyzing image. Check console for details.' };
  }
}
