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
    const [result] = await client.labelDetection(Buffer.from(await file.arrayBuffer()));
    
    return NextResponse.json({
      labels: result.labelAnnotations || []
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}