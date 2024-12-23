import { type FC, useEffect, useMemo } from "react";
import { useConfetti } from "use-confetti-svg";

const christmasTreeImage = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIj4KICAgIDxwYXRoIGQ9Ik0xMiAyTDIwIDIwSDRMMTIgMloiIGZpbGw9IiMwMDgwMDAiIHN0cm9rZT0iIzAwNjQwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICAgIDxjaXJjbGUgY3g9IjgiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2ZmMDAwMCIvPgogICAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNCIgcj0iMSIgZmlsbD0iI2ZmZDcwMCIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSIxIiBmaWxsPSIjZmYwMDAwIi8+CiAgICA8cmVjdCB4PSIxMSIgeT0iMjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM4YjRjMzMiLz4KPC9zdmc+';

const santaImage = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMS41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjQiIGZpbGw9IiNmZjAwMDAiLz4KICAgIDxwYXRoIGQ9Ik04IDEyQzggMTQgMTAgMTYgMTIgMTZDMTQgMTYgMTYgMTQgMTYgMTIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICAgIDxjaXJjbGUgY3g9IjkiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzAwMDAwMCIvPgogICAgPGNpcmNsZSBjeD0iMTUiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4=';

const giftImage = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIj4KICAgIDxyZWN0IHg9IjQiIHk9IjgiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNCIgZmlsbD0iI2ZmMDAwMCIgc3Ryb2tlPSIjZGQwMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogICAgPHJlY3QgeD0iMTEiIHk9IjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjE0IiBmaWxsPSIjZmZkNzAwIi8+CiAgICA8cGF0aCBkPSJNOCA4QzggNCA4IDQgMTIgNEMxNiA0IDE2IDggMTYgOEg4WiIgZmlsbD0iI2ZmZDcwMCIgc3Ryb2tlPSIjZmZhYTAwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4=';

const heartRibbonImage = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIj4KICAgIDxwYXRoIGQ9Ik0xMiAyMEwzIDEwQzAgNyAwIDQgMyAyQzYgMCA5IDIgMTIgNkMxNSAyIDE4IDAgMjEgMkMyNCA0IDI0IDcgMjEgMTBMMTIgMjBaIiBmaWxsPSIjZmYwMDAwIiBzdHJva2U9IiNkZDAwMDAiIHN0cm9rZS13aWR0aD0iMS41Ii8+CiAgICA8cGF0aCBkPSJNMTAgMTZMOCAyMEg2TDggMTZNMTQgMTZMMTYgMjBIMThMMTYgMTYiIGZpbGw9IiNmZmQ3MDAiIHN0cm9rZT0iI2ZmYWEwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPC9zdmc+';

type Props = {
  image?: 'tree' | 'santa' | 'gift' | 'heart';
}

export const Confetti: FC<Props> = ({ image }) => {
  const confettiConfig = useMemo(() => {
    const images = [
      { src: `data:image/svg+xml;base64,${christmasTreeImage}`, weight: 25 },
      { src: `data:image/svg+xml;base64,${santaImage}`, weight: 25 },
      { src: `data:image/svg+xml;base64,${giftImage}`, weight: 25 },
      { src: `data:image/svg+xml;base64,${heartRibbonImage}`, weight: 25 },
    ];

    if (image) {
      const selectedImage = {
        tree: christmasTreeImage,
        santa: santaImage,
        gift: giftImage,
        heart: heartRibbonImage
      }[image];
      images.length = 0;
      images.push({ src: `data:image/svg+xml;base64,${selectedImage}`, weight: 100 });
    }

    return {
      images: images.flatMap(img => [16, 32, 64].map(size => ({
        src: img.src,
        size,
        weight: (size === 32 ? 2 : 1) * img.weight / images.length,
      }))),
      duration: 6000,
      fadeOut: 500,
      particleCount: 50,
      speed: 50,
      rotate: true
    };
  }, [image]);

  const { runAnimation } = useConfetti(confettiConfig);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      #confetti-canvas {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: -1 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void runAnimation();
    }, 300);

    return () => clearTimeout(timer);
  }, [runAnimation]);

  return (
    <div />
  );
};

export default Confetti;