import { useCallback, useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  slideCount: number;
  autoPlay: boolean;
  autoPlayInterval: number;
  paused?: boolean;
}

interface UseCarouselReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToSlide: (index: number) => void;
}

export function useCarousel({
  slideCount,
  autoPlay,
  autoPlayInterval,
  paused = false,
}: UseCarouselOptions): UseCarouselReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clamp activeIndex when slideCount changes
  useEffect(() => {
    if (activeIndex >= slideCount && slideCount > 0) {
      setActiveIndex(slideCount - 1);
    }
  }, [slideCount, activeIndex]);

  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    clearAutoPlay();
    if (autoPlay && !paused && slideCount > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slideCount);
      }, autoPlayInterval);
    }
  }, [autoPlay, paused, slideCount, autoPlayInterval, clearAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return clearAutoPlay;
  }, [startAutoPlay, clearAutoPlay]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
    startAutoPlay(); // Reset timer on manual nav
  }, [slideCount, startAutoPlay]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
    startAutoPlay();
  }, [slideCount, startAutoPlay]);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index);
      startAutoPlay();
    },
    [startAutoPlay],
  );

  return { activeIndex, setActiveIndex, goToPrev, goToNext, goToSlide };
}
