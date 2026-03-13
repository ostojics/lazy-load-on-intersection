import React, { useState, Suspense } from "react";
import {
  useOnInView,
  type IntersectionObserverProps,
} from "react-intersection-observer";

interface WithLazyLoadOnIntersectionConfig {
  fallback?: React.ReactNode;
  options?: Omit<IntersectionObserverProps, "children">;
  wrapperProps?: React.ComponentProps<"div">;
}

/**
 * A Higher-Order Component (HOC) that defers the rendering (and network request)
 * of a component until it enters or nears the viewport.
 * * This HOC is designed to work with `React.lazy` to trigger code-split chunk
 * downloads only when necessary, optimizing initial page load performance.
 * *
 *
 * @template P - The props type of the component being wrapped.
 * * @param {WithLazyLoadOnIntersectionConfig} config - Configuration object for the HOC.
 * @param {React.ComponentType<P>} config.Component - The component to be lazy-loaded (typically a `React.lazy` export).
 * @param {React.ReactNode} [config.fallback=<div>Loading...</div>] - The UI to show while the component is being fetched.
 * @param {IntersectionObserverProps} [config.options] - Intersection Observer settings (e.g., threshold, rootMargin).
 * @param {React.ComponentProps<"div">} [config.wrapperProps] - Props to pass to the wrapping `div` element.
 * * @returns {React.FC<P>} A functional component that accepts the original props of the wrapped component.
 * * @example
 * // 1. Define the lazy component
 * const HeavyChart = React.lazy(() => import("./HeavyChart"));
 * * // 2. Wrap it
 * const LazyChart = withLazyLoadOnIntersection(HeavyChart);
 * * // 3. Use it like a normal component
 * <LazyChart chartData={data} />
 */
export const withLazyLoadOnIntersection = <P extends object>(
  Component: React.ComponentType<P>,
  {
    fallback = <div>Loading...</div>,
    options = {
      threshold: 0.1,
      rootMargin: "200px",
      triggerOnce: true,
    },
    wrapperProps = {},
  }: WithLazyLoadOnIntersectionConfig = {},
) => {
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
