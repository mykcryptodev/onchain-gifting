import dynamic from 'next/dynamic';

// Only load in browser
const ClientFrame = dynamic(
  () => {
    // Additional runtime check
    if (typeof window === 'undefined') {
      return Promise.resolve(() => null);
    }
    return import('./ClientFrame')
      .then((mod) => mod.default)
      .catch(() => () => null);
  },
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Frame() {
  // Don't render on server
  if (typeof window === 'undefined') return null;
  return <ClientFrame />;
}