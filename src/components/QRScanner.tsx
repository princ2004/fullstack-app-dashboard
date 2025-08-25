"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QRScanner() {
  const [scannedData, setScannedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setScannedData('');

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        try {
          const simulatedData = `Scanned from ${file.name} - Demo QR content: ${Date.now()}`;
          setScannedData(simulatedData);
        } catch (err) {
          setError('Failed to scan QR code from image');
        } finally {
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setLoading(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError('Failed to process image');
      setLoading(false);
    }
  };

  const startCameraScanning = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setTimeout(() => {
        setScannedData(`Camera scan result - Demo QR content: ${Date.now()}`);
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
      
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    } catch (err) {
      setError('Camera access denied or not available');
    }
  };

  const copyToClipboard = () => {
    if (scannedData) {
      navigator.clipboard.writeText(scannedData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="qr-file">Upload QR Code Image</Label>
          <input
            ref={fileInputRef}
            id="qr-file"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-500">or</span>
        </div>

        <Button 
          onClick={startCameraScanning}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Scanning...' : 'Scan with Camera'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scannedData && (
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium">Scanned Data:</Label>
            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
              <p className="text-sm break-all">{scannedData}</p>
            </div>
            <Button 
              onClick={copyToClipboard}
              variant="outline" 
              size="sm"
              className="mt-3 w-full"
            >
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
