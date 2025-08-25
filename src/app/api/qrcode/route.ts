import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400
    });

    return NextResponse.json({
      qr: qrCodeDataURL,
      text: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('QR Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'QR Code API is running',
    endpoints: {
      POST: '/api/qrcode - Generate QR code from text'
    },
    usage: {
      method: 'POST',
      body: { text: 'Your text here' },
      response: { qr: 'data:image/png;base64,...', text: 'Your text here', timestamp: '...' }
    }
  });
}
