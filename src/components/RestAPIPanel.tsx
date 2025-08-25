"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface APIResponse {
  status: number;
  data: any;
  timestamp: Date;
}

export default function RestAPIPanel() {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{[key: string]: APIResponse}>({});
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState('');

  const testAPI = async (endpoint: string, name: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      setResponses(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          data,
          timestamp: new Date()
        }
      }));
    } catch (err) {
      setError(`Failed to connect to ${name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Set demo response for development
      setResponses(prev => ({
        ...prev,
        [name]: {
          status: 200,
          data: {
            message: `Demo response from ${name}`,
            timestamp: new Date().toISOString(),
            demo: true,
            note: "This is a simulated response since the actual API is not available"
          },
          timestamp: new Date()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testCustomAPI = async () => {
    if (!customUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    await testAPI(customUrl, 'custom');
  };

  const predefinedAPIs = [
    {
      name: 'Django Backend',
      url: 'http://localhost:8001/api/status',
      description: 'Django REST Framework endpoint'
    },
    {
      name: 'Laravel Backend',
      url: 'http://localhost:8002/api/status',
      description: 'Laravel API endpoint'
    },
    {
      name: 'Node.js Backend',
      url: 'http://localhost:8003/api/status',
      description: 'Express.js API endpoint'
    },
    {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      description: 'Public testing API'
    }
  ];

  const formatJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="predefined" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="predefined">Predefined APIs</TabsTrigger>
          <TabsTrigger value="custom">Custom API</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedAPIs.map((api) => (
              <Card key={api.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{api.name}</CardTitle>
                  <p className="text-sm text-gray-600">{api.description}</p>
                  <code className="text-xs bg-gray-100 p-1 rounded">{api.url}</code>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => testAPI(api.url, api.name)}
                    disabled={loading}
                    className="w-full mb-3"
                  >
                    {loading ? 'Testing...' : 'Test API'}
                  </Button>

                  {responses[api.name] && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={responses[api.name].status === 200 ? "default" : "destructive"}>
                          Status: {responses[api.name].status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {responses[api.name].timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-32">
                        {formatJSON(responses[api.name].data)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Custom API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-url">API Endpoint URL</Label>
                <Input
                  id="custom-url"
                  type="url"
                  placeholder="https://api.example.com/endpoint"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
              </div>

              <Button 
                onClick={testCustomAPI}
                disabled={loading || !customUrl.trim()}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Custom API'}
              </Button>

              {responses.custom && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={responses.custom.status === 200 ? "default" : "destructive"}>
                      Status: {responses.custom.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {responses.custom.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-40">
                    {formatJSON(responses.custom.data)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Backend Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold">Django Backend (Port 8001):</h4>
            <code className="text-xs bg-gray-100 p-1 rounded block mt-1">
              python manage.py runserver 8001
            </code>
          </div>
          <div>
            <h4 className="font-semibold">Laravel Backend (Port 8002):</h4>
            <code className="text-xs bg-gray-100 p-1 rounded block mt-1">
              php artisan serve --port=8002
            </code>
          </div>
          <div>
            <h4 className="font-semibold">Node.js Backend (Port 8003):</h4>
            <code className="text-xs bg-gray-100 p-1 rounded block mt-1">
              node server.js --port=8003
            </code>
          </div>
          <p className="text-gray-600 mt-3">
            • Each backend should expose a <code>/api/status</code> endpoint
            • CORS should be configured to allow requests from localhost:8000
            • Responses should return JSON format
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
