/** @jsxImportSource react */
import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const tokenId = request.nextUrl.pathname.split('/').pop()!;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '40px',
            background: 'linear-gradient(to bottom, #4F46E5, #312E81)',
            fontFamily: 'system-ui'
          }}
        >
          {/* Gift Box Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '200px',
              height: '200px',
              marginBottom: '40px',
              background: 'white',
              borderRadius: '24px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                height: '20px',
                background: '#EF4444',
                transform: 'translateY(-50%)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                bottom: '0',
                width: '20px',
                background: '#EF4444',
                transform: 'translateX(-50%)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#EF4444',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>

          <h1
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 700,
              color: 'white',
              margin: '0 0 20px 0',
              padding: 0,
              textAlign: 'center',
              letterSpacing: '-0.05em'
            }}
          >
            Gift Pack
          </h1>

          <p
            style={{
              display: 'flex',
              margin: 0,
              fontSize: '36px',
              color: '#E5E7EB',
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            #{tokenId}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500
    });
  }
} 