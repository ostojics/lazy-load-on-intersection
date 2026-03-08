import React, { useState, Suspense } from "react";
import {
  useOnInView,
  type IntersectionObserverProps,
} from "react-intersection-observer";

interface WithLazyLoadOnIntersectionProps<P extends object> {
  Component: React.ComponentType<P>;
  fallback?: React.ReactNode;
  options?: Omit<IntersectionObserverProps, "children">;
  wrapperProps?: React.ComponentProps<"div">;
}

export const withLazyLoadOnIntersection = <P extends object>({
  Component,
  fallback = <div>Loading...</div>,
  options = {
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: true,
  },
  wrapperProps = {},
}: WithLazyLoadOnIntersectionProps<P>) => {
  return (props: P) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const inViewRef = useOnInView((inView) => {
      if (inView) {
        setIsIntersecting(true);
      }
    }, options);

    return (
      <div ref={inViewRef} style={{ minHeight: "1px" }} {...wrapperProps}>
        <Suspense fallback={fallback}>
          {isIntersecting ? <Component {...props} /> : null}
        </Suspense>
      </div>
    );
  };
};
