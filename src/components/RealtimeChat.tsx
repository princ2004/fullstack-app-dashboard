"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  user: string;
}

export default function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      try {
        // Import socket.io-client dynamically
        const { io } = await import('socket.io-client');
        const newSocket = io('http://localhost:8000');

        newSocket.on('connect', () => {
          setConnected(true);
          console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
          setConnected(false);
          console.log('Disconnected from server');
        });

        newSocket.on('message', (message: Message) => {
          setMessages(prev => [...prev, message]);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setConnected(false);
        });

        setSocket(newSocket);
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        // Add demo messages for development
        setMessages([
          {
            id: '1',
            text: 'Welcome to the chat! (Demo mode - Socket.io server not running)',
            timestamp: new Date(),
            user: 'System'
          }
        ]);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !username.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date(),
      user: username.trim()
    };

    if (socket && connected) {
      socket.emit('message', message);
    } else {
      // Demo mode - add message locally
      setMessages(prev => [...prev, message]);
    }

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <Badge variant={connected ? "default" : "secondary"}>
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
        <span className="text-sm text-gray-500">
          {messages.length} messages
        </span>
      </div>

      {/* Username Input */}
      {!username && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your username to start chatting:</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setUsername(username)}
                />
                <Button onClick={() => setUsername(username)} disabled={!username.trim()}>
                  Join Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      {username && (
        <>
          <Card>
            <CardContent className="p-4">
              <div className="h-64 overflow-y-auto space-y-3 mb-4 border rounded-md p-3 bg-gray-50">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-blue-600">
                        {message.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm bg-white p-2 rounded border">
                      {message.text}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          {!connected && (
            <Alert>
              <AlertDescription>
                Socket.io server is not running. Start the server with `node server.js` to enable real-time chat.
                Currently running in demo mode.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Chat Features */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Real-time messaging with Socket.io</p>
        <p>• Automatic scroll to latest messages</p>
        <p>• Connection status indicator</p>
        <p>• Press Enter to send messages</p>
      </div>
    </div>
  );
}
