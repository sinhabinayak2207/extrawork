import { NextResponse } from 'next/server';

// This is a catch-all route for API endpoints in static export
// It ensures all API routes have static params for build time

export function generateStaticParams() {
  return [
    // Auth routes
    { path: ['auth', 'signin'] },
    { path: ['auth', 'signout'] },
    { path: ['auth', 'session'] },
    { path: ['auth', 'callback', 'credentials'] },
    // Add other API routes as needed
    { path: [] } // Root API path
  ];
}

// Static handlers for API endpoints
export async function GET() {
  return NextResponse.json(
    { message: 'This is a static API endpoint' },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: 'This is a static API endpoint' },
    { status: 200 }
  );
}

export const dynamic = 'force-static';
