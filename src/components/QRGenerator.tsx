"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async () => {
    if (!text.trim()) {
      setError('Please enter text to generate QR code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code');
      }

      setQrImage(data.qr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qr-text">Enter text to generate QR code</Label>
        <Input
          id="qr-text"
          type="text"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && generateQR()}
        />
      </div>

      <Button 
        onClick={generateQR} 
        disabled={loading || !text.trim()}
        className="w-full"
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {qrImage && (
        <Card>
          <CardContent className="p-4 text-center">
            <img 
              src={qrImage || "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f7a504d0-dc4c-49d9-8078-b872654c07f5.png"} 
              alt="Preview of the generated QR code with high clarity" 
              className="mx-auto mb-4 border rounded-lg shadow-sm"
              onError={(e) => { 
                e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/318cb603-1a87-4bcc-b4fa-e05f667f3528.png"; 
              }} 
            />
            <Button onClick={downloadQR} variant="outline" className="w-full">
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
