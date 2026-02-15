// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const client = new ImageAnnotatorClient();
    
    // Perform multiple detections in one request
    const [result] = await client.batchAnnotateImages({
      requests: [{
        image: { content: Buffer.from(await file.arrayBuffer()) },
        features: [
          { type: 'LABEL_DETECTION' },
          { type: 'OBJECT_LOCALIZATION' },
          { type: 'TEXT_DETECTION' },
          { type: 'LOGO_DETECTION' }
        ]
      }]
    });
    
    const annotations = result.responses?.[0];
    
    if (!annotations) {
      return NextResponse.json({ error: 'No annotations returned' }, { status: 500 });
    }
    
    return NextResponse.json({
      labels: annotations.labelAnnotations || [],
      objects: annotations.localizedObjectAnnotations || [],
      text: annotations.textAnnotations || [],
      logos: annotations.logoAnnotations || []
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}