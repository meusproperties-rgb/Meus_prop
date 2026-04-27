import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/db/index';

export async function GET() {
  try {
    await ensureDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database connection is ready',
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
