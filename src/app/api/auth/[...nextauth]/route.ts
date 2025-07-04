// Static export compatible auth implementation
import { NextResponse } from 'next/server';

// For static export, we need a simplified implementation
// This is a placeholder that will be replaced by client-side auth

// Generate static params for all possible auth routes
export function generateStaticParams() {
  return [
    { nextauth: ['signin'] },
    { nextauth: ['signout'] },
    { nextauth: ['session'] },
    { nextauth: ['csrf'] },
    { nextauth: ['callback', 'credentials'] }
  ];
}

// Static handlers for auth endpoints
export async function GET() {
  return NextResponse.json(
    { error: 'Static export does not support server-side auth API' },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Static export does not support server-side auth API' },
    { status: 200 }
  );
}

// For static export compatibility
export const dynamic = 'force-static';
