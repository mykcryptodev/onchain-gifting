/** @jsxImportSource react */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const size = {
    width: 1200,
    height: 630,
  };

  const sparkles = Array.from({ length: 5 }, (_, i) => i);

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            position: 'relative',
          }}
        >
          {/* Decorative circles in the background */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />

          {/* Logo */}
          <img
            src="https://onchaingift.com/images/logo.png"
            alt="Onchain Gift Logo"
            style={{
              width: '200px',
              height: '200px',
              marginBottom: '40px',
              objectFit: 'contain',
            }}
          />

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em',
              }}
            >
              Onchain Gift
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '20px 0 0 0',
                textAlign: 'center',
              }}
            >
              Give the gift of coming onchain!
            </p>
          </div>

          {/* Sparkle effects */}
          {sparkles.map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: 'white',
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.6,
                boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)',
              }}
            />
          ))}
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 