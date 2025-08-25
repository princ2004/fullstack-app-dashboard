"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface FirebaseData {
  id: string;
  message: string;
  timestamp: number;
  user: string;
}

export default function FirebaseRealtime() {
  const [data, setData] = useState<FirebaseData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize Firebase connection
    initializeFirebase();
  }, []);

  const initializeFirebase = async () => {
    try {
      // Check if Firebase is configured
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      
      if (!apiKey || apiKey === 'your_firebase_api_key') {
        // Demo mode - simulate Firebase data
        setError('Firebase not configured. Running in demo mode.');
        setData([
          {
            id: '1',
            message: 'Welcome to Firebase Realtime Database demo!',
            timestamp: Date.now(),
            user: 'System'
          },
          {
            id: '2',
            message: 'This is simulated real-time data.',
            timestamp: Date.now() - 60000,
            user: 'Demo User'
          }
        ]);
        
        // Simulate real-time updates
        const interval = setInterval(() => {
          setData(prev => [...prev, {
            id: Date.now().toString(),
            message: `Auto-generated message at ${new Date().toLocaleTimeString()}`,
            timestamp: Date.now(),
            user: 'Auto System'
          }]);
        }, 30000);

        return () => clearInterval(interval);
      }

      // Real Firebase initialization would go here
      const { initializeApp } = await import('firebase/app');
      const { getDatabase, ref, onValue, push, set } = await import('firebase/database');

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const messagesRef = ref(database, 'messages');

      // Listen for real-time updates
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messages = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setData(messages.sort((a, b) => b.timestamp - a.timestamp));
        }
        setConnected(true);
      });

    } catch (err) {
      setError('Failed to initialize Firebase: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setConnected(false);
    }
  };

  const addMessage = async () => {
    if (!newMessage.trim() || !username.trim()) return;

    setLoading(true);
    
    try {
      const messageData: FirebaseData = {
        id: Date.now().toString(),
        message: newMessage.trim(),
        timestamp: Date.now(),
        user: username.trim()
      };

      if (connected && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_firebase_api_key') {
        // Real Firebase push
        const { getDatabase, ref, push } = await import('firebase/database');
        const database = getDatabase();
        const messagesRef = ref(database, 'messages');
        await push(messagesRef, messageData);
      } else {
        // Demo mode - add locally
        setData(prev => [messageData, ...prev]);
      }

      setNewMessage('');
    } catch (err) {
      setError('Failed to add message: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    try {
      if (connected && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_firebase_api_key') {
        const { getDatabase, ref, set } = await import('firebase/database');
        const database = getDatabase();
        const messagesRef = ref(database, 'messages');
        await set(messagesRef, null);
      } else {
        setData([]);
      }
    } catch (err) {
      setError('Failed to clear data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <Badge variant={connected ? "default" : "secondary"}>
          {connected ? 'Firebase Connected' : 'Demo Mode'}
        </Badge>
        <span className="text-sm text-gray-500">
          {data.length} messages
        </span>
      </div>

      {/* Username Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firebase-username">Username</Label>
          <Input
            id="firebase-username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firebase-message">Message</Label>
          <div className="flex space-x-2">
            <Input
              id="firebase-message"
              placeholder="Enter your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMessage()}
            />
            <Button 
              onClick={addMessage}
              disabled={loading || !newMessage.trim() || !username.trim()}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Real-time Data Display */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Real-time Messages</CardTitle>
          <Button 
            onClick={clearData}
            variant="outline" 
            size="sm"
          >
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No messages yet</p>
            ) : (
              data.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-blue-600">
                      {item.user}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Firebase Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Firebase Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>To enable real Firebase integration:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Create a Firebase project at <code>https://console.firebase.google.com</code></li>
            <li>Enable Realtime Database in your Firebase project</li>
            <li>Copy your Firebase config to <code>.env.local</code></li>
            <li>Update the environment variables with your actual Firebase credentials</li>
            <li>Restart the development server</li>
          </ol>
          <p className="text-gray-600 mt-2">
            Currently running in demo mode with simulated real-time updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
