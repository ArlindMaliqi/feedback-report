'use client';

import React from 'react';
import { FeedbackWidget, OptimizedFeedbackWidget, MinimalFeedbackWidget } from 'react-feedback-report-widget';

// Simple working example for Next.js
export function SimpleFeedbackExample() {
  return (
    <FeedbackWidget 
      config={{
        apiEndpoint: '/api/feedback',
        theme: 'system',
        localization: {
          locale: 'en',
          fallbackLocale: 'en'
        }
      }}
    />
  );
}

// Optimized version for better performance
export function OptimizedFeedbackExample() {
  return (
    <OptimizedFeedbackWidget 
      config={{
        apiEndpoint: '/api/feedback',
        theme: 'system',
        enableOfflineSupport: true
      }}
      theme="system"
      showButton={true}
    />
  );
}

// Minimal version for smallest bundle
export function MinimalFeedbackExample() {
  return (
    <MinimalFeedbackWidget
      apiEndpoint="/api/feedback"
      position="bottom-right"
      theme="system"
    />
  );
}

// Example API route for Next.js App Router
// app/api/feedback/route.ts
/*
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const feedback = await request.json();
    console.log('Feedback received:', feedback);
    
    // Process feedback here (save to database, send notifications, etc.)
    
    return NextResponse.json({ success: true, id: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}
*/

export default SimpleFeedbackExample;
