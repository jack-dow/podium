import { useEffect, useState, type ReactNode } from "react";

let loading = true;

type FallbackProps = {
  delay?: number;
  fallback: ReactNode;
  minimumFallbackDisplayTime?: number;
  isLoading: boolean;
  children: React.ReactNode;
};

export function Fallback({
  delay = 150,
  fallback,
  minimumFallbackDisplayTime = 250,
  isLoading,
  children,
}: FallbackProps) {
  const [delayExceeded, setDelayExceeded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [shownForMinimumTime, setShownForMinimumTime] = useState(false);

  loading = isLoading;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const innerIsLoading = loading;

      if (innerIsLoading) {
        setDelayExceeded(true);
        setShowSpinner(true);
      }
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  useEffect(() => {
    if (showSpinner) {
      const timeout = setTimeout(() => {
        const innerIsLoading = loading;

        setShownForMinimumTime(true);

        if (!innerIsLoading) {
          setShowSpinner(false);
        }
      }, minimumFallbackDisplayTime);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showSpinner, minimumFallbackDisplayTime]);

  useEffect(() => {
    if (!isLoading && delayExceeded && shownForMinimumTime) {
      setShowSpinner(false);
    }
  }, [isLoading, delayExceeded, shownForMinimumTime]);

  if (isLoading && !showSpinner) {
    return <></>;
  }

  if (showSpinner) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
