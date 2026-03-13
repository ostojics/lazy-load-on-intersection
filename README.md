# React + TypeScript + Vite - Lazy Load on Intersection (HOC)

This repository demonstrates a small, production-minded pattern for lazily
loading React components when they scroll into view using an easy-to-reuse
higher-order component: `withLazyLoadOnIntersection`.

## Why this HOC?

Large UIs often contain widgets or visual sections that are not visible on
first paint. Loading those components only when they are near the viewport
reduces initial bundle work, improves first paint time, and reduces memory
pressure. This HOC pairs `React.lazy` + `Suspense` with an intersection
observer to make lazy-loading ergonomic and typesafe.

Key features

- TypeScript-friendly API with generics (keeps props typings intact).
- Built on `react-intersection-observer` for predictable behaviour and test helpers.
- Suspense fallback support for graceful UI while the chunk loads.
- `triggerOnce` default to avoid re-mount thrash and extra observation cost.

## Quick example (TypeScript)

```tsx
import React, { lazy } from "react";
import { withLazyLoadOnIntersection } from "./with-lazy-load-on-intersection";

const TimeDisplay = lazy(
  () => import("./components/time-display/time-display"),
);

const LazyTimeDisplay = withLazyLoadOnIntersection({
  Component: TimeDisplay,
  fallback: <div>Loading time display...</div>,
  options: { threshold: 0.5, rootMargin: "100px", triggerOnce: true },
});

export default function App() {
  return (
    <div>
      <h3>Lazy loaded on intersection</h3>
      <LazyTimeDisplay additionalText="This was lazy loaded when visible" />
    </div>
  );
}
```

## API / Types

The HOC signature (TypeScript) is:

```ts
export const withLazyLoadOnIntersection = <P extends object>({
  Component,
  fallback?,                // ReactNode shown while lazy chunk loads
  options?,                 // IntersectionObserver props (Omit children)
  wrapperProps?,            // Props forwarded to the wrapper <div>
}: WithLazyLoadOnIntersectionProps<P>) => (props: P) => JSX.Element
```

Props details:

- `Component: React.ComponentType<P>` — a lazy or normal React component.
- `fallback?: React.ReactNode` — the `Suspense` fallback while code loads.
- `options?: Omit<IntersectionObserverProps, "children">` — all standard
  intersection observer options from `react-intersection-observer` (e.g.
  `threshold`, `rootMargin`, `triggerOnce`). Defaults chosen for common
  lazy-loading patterns.
- `wrapperProps?: React.ComponentProps<"div">` — forwarded to outer wrapper,
  useful for `className`, `style`, or ARIA attributes.

## Implementation notes (what the HOC does)

- Renders an outer `<div ref={inViewRef} style={{minHeight: "1px"}} ...>` that
  acts as the observation target.
- Uses `useOnInView` from `react-intersection-observer` to set a local flag
  `isIntersecting`.
- When `isIntersecting` becomes true the HOC renders the wrapped `Component`
  inside `React.Suspense` with the provided `fallback`.
- The HOC intentionally sets `triggerOnce` default to true to avoid repeated
  observations and remounts once the component has loaded.

## Accessibility & SSR

- IntersectionObserver is a client-side API. During SSR the HOC will render
  the wrapper and the fallback behaviour depends on your hydration strategy.
  If content must be visible on initial load for users or crawlers, avoid
  wrapping that content with this HOC (or render a server-side placeholder).
- Ensure `fallback` is accessible (e.g. aria-busy, role, visible text) and
  that `wrapperProps` can be used to set ARIA attributes if needed.

## Performance tips

- Use appropriate `rootMargin` so components start loading slightly before they
  enter the visible viewport (e.g. `200px`).
- Keep `triggerOnce: true` for static content; set false only if you need
  repeated enter/exit logic.

## Adopting into your codebase

1. Copy `src/with-lazy-load-on-intersection.tsx` to your utilities/components folder.
2. Add `react-intersection-observer` to your project: `pnpm add react-intersection-observer`.
3. Wrap lazy components with `withLazyLoadOnIntersection({ Component: MyLazy })`.
4. Tune `options` per component (optional): threshold/rootMargin/triggerOnce.

## Source / Files of interest

- HOC implementation: `src/with-lazy-load-on-intersection.tsx`
- Example component: `src/components/time-display/time-display.tsx`
- Example usage: `src/App.tsx`

## Setup

- pnpm i
- pnpm dev

## License & attribution

This project is a demo/boilerplate. Feel free to reuse the HOC as-is or adapt for your project.

## Demo video




https://github.com/user-attachments/assets/3e1effa4-970e-440a-84be-cd6584452e4c

