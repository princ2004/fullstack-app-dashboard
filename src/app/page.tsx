"use client";

import { useState } from 'react';
import QRGenerator from '@/components/QRGenerator';
import QRScanner from '@/components/QRScanner';
import RealtimeChat from '@/components/RealtimeChat';
import RestAPIPanel from '@/components/RestAPIPanel';
import FirebaseRealtime from '@/components/FirebaseRealtime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("qr");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Full-Stack Application Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Complete solution with QR codes, real-time chat, REST APIs, and Firebase integration
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="qr">QR Codes</TabsTrigger>
            <TabsTrigger value="chat">Real-time Chat</TabsTrigger>
            <TabsTrigger value="api">REST APIs</TabsTrigger>
            <TabsTrigger value="firebase">Firebase Live</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Generator</CardTitle>
                  <CardDescription>
                    Generate QR codes from text using Python backend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRGenerator />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Scanner</CardTitle>
                  <CardDescription>
                    Scan and decode QR codes using JavaScript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRScanner />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Chat Tab */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>
                  Socket.io powered real-time communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeChat />
              </CardContent>
            </Card>
          </TabsContent>

          {/* REST API Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>REST API Integration</CardTitle>
                <CardDescription>
                  Connect to Django, Laravel, and Node.js backends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RestAPIPanel />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Firebase Tab */}
          <TabsContent value="firebase">
            <Card>
              <CardHeader>
                <CardTitle>Firebase Realtime Database</CardTitle>
                <CardDescription>
                  Live data synchronization with Firebase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FirebaseRealtime />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frontend Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Next.js 15 with React 19</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Shadcn/ui components</li>
                    <li>• Responsive design</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backend Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Node.js with Express</li>
                    <li>• Socket.io for real-time</li>
                    <li>• Python for QR generation</li>
                    <li>• RESTful API design</li>
                    <li>• Multiple database support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• MySQL integration</li>
                    <li>• MongoDB support</li>
                    <li>• PostgreSQL connection</li>
                    <li>• SQLite for development</li>
                    <li>• Firebase Realtime DB</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
