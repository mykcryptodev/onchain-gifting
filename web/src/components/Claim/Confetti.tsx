import { type FC, useEffect, useMemo, memo } from "react";
import { useConfetti } from "use-confetti-svg";
import { giftImage, heartRibbonImage, redEnvelopeImage, confettiImage, popperImage } from './confetti-images';

type Props = {
  image?: 'gift' | 'heart' | 'envelope' | 'confetti' | 'popper';
  duration?: number
}

const ConfettiComponent: FC<Props> = ({ image, duration = 600 }) => {
  const confettiConfig = useMemo(() => {
    const images = [
      { src: giftImage, weight: 10 },
      { src: heartRibbonImage, weight: 10 },
      { src: redEnvelopeImage, weight: 60 },
      { src: confettiImage, weight: 10 },
      { src: popperImage, weight: 10 },
    ];

    if (image) {
      const selectedImage = {
        gift: giftImage,
        heart: heartRibbonImage,
        envelope: redEnvelopeImage,
        confetti: confettiImage,
        popper: popperImage
      }[image];
      images.length = 0;
      images.push({ src: selectedImage, weight: 100 });
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
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, runAnimation]);

  return (
    <div />
  );
};

export const Confetti = memo(ConfettiComponent);

export default Confetti;