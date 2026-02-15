import { NextResponse } from 'next/server';
import {
  VideoIntelligenceServiceClient,
  protos,
} from '@google-cloud/video-intelligence';

// IMPORTANT: Video Intelligence + Buffer require Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Initialize client (uses service account JSON via env)
    const client = new VideoIntelligenceServiceClient();

    // Convert uploaded file to Buffer
    const inputContent = Buffer.from(await file.arrayBuffer());

    // Call Video Intelligence API
    const [operation] = await client.annotateVideo({
      inputContent,
      features: [
        protos.google.cloud.videointelligence.v1.Feature.LABEL_DETECTION,
        protos.google.cloud.videointelligence.v1.Feature.OBJECT_TRACKING,
        protos.google.cloud.videointelligence.v1.Feature.TEXT_DETECTION,
        protos.google.cloud.videointelligence.v1.Feature.LOGO_RECOGNITION,
      ],
    });

    // Wait for async processing
    const [operationResult] = await operation.promise();

    const annotationResults = operationResult.annotationResults?.[0];
    
    // Get labels
    const labels = annotationResults?.segmentLabelAnnotations ?? [];
    
    // Get objects
    const objects = annotationResults?.objectAnnotations ?? [];
    
    // Get text
    const textAnnotations = annotationResults?.textAnnotations ?? [];

    // Get logos
    const logoAnnotations = annotationResults?.logoRecognitionAnnotations ?? [];

    return NextResponse.json({
      labels: labels.map((label: any) => ({
        description: label.entity?.description ?? '',
        confidence: label.segments?.[0]?.confidence ?? 0,
        categoryEntities:
          label.categoryEntities?.map((cat: any) => cat.description) ?? [],
      })),
      objects: objects.map((object: any) => ({
        description: object.entity?.description ?? '',
        confidence: object.confidence ?? 0,
        frames: object.frames?.map((frame: any) => ({
          timeOffset: frame.timeOffset?.seconds ? `${frame.timeOffset.seconds}s` : '0s',
          normalizedBoundingBox: frame.normalizedBoundingBox
        })) ?? []
      })),
      text: textAnnotations.map((text: any) => ({
        text: text.text ?? '',
        segments: text.segments?.map((segment: any) => ({
          startTime: segment.startTime?.seconds ? `${segment.startTime.seconds}s` : '0s',
          endTime: segment.endTime?.seconds ? `${segment.endTime.seconds}s` : '0s',
          confidence: segment.confidence ?? 0
        })) ?? []
      })),
      logos: logoAnnotations.map((logo: any) => ({
        description: logo.entity?.description ?? '',
        confidence: logo.segments?.[0]?.confidence ?? 0,
        tracks: logo.tracks?.map((track: any) => ({
          startTime: track.segment?.startTime?.seconds ? `${track.segment.startTime.seconds}s` : '0s',
          endTime: track.segment?.endTime?.seconds ? `${track.segment.endTime.seconds}s` : '0s',
          confidence: track.confidence ?? 0
        })) ?? []
      }))
    });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    );
  }
}
