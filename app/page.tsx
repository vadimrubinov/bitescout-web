'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const EXAMPLE_QUERIES = [
  'Best salmon charters in BC for July',
  'Halibut fishing in Alaska, budget $2000',
  'Family-friendly fishing lodge near Vancouver',
];

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (query?: string) => {
    const text = query || input;
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Hero */}
      {messages.length === 0 && (
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            World's most complete
            <br />
            trophy fishing database
          </h1>
          <p className="text-gray-500 text-sm mt-4">
            AI-powered · 1,500+ operators · Expanding worldwide
          </p>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-surface text-gray-900'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">
                {msg.role === 'user' ? 'You' : 'Scout'}
              </p>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Scout</p>
              <p className="text-gray-500">Searching database...</p>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about fishing charters..."
          rows={3}
          className="w-full p-4 pr-24 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || !input.trim()}
          className="absolute right-3 bottom-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Ask Scout →'}
        </button>
      </div>

      {/* Example Queries */}
      {messages.length === 0 && (
        <div className="mt-4">
          <p className="text-gray-500 text-sm mb-2">Try:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(q)}
                className="text-sm text-primary hover:underline"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Value Props */}
      {messages.length === 0 && (
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">🎯</div>
            <p className="font-medium text-gray-900">AI finds best matches</p>
            <p className="text-sm text-gray-500">No more endless searching</p>
          </div>
          <div>
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium text-gray-900">Compare side-by-side</p>
            <p className="text-sm text-gray-500">Prices, ratings, specialties</p>
          </div>
          <div>
            <div className="text-2xl mb-2">📩</div>
            <p className="font-medium text-gray-900">Request quotes</p>
            <p className="text-sm text-gray-500">One click, multiple operators</p>
          </div>
        </div>
      )}

      {/* Coverage */}
      {messages.length === 0 && (
        <div className="mt-16 text-center text-sm text-gray-500">
          <p className="font-medium text-gray-700">Currently covering</p>
          <p>British Columbia · Alaska</p>
          <p className="mt-1 text-xs">Coming soon: Florida · Mexico · Norway · New Zealand</p>
        </div>
      )}
    </div>
  );
}
