import { lazy, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { withLazyLoadOnIntersection } from "./with-lazy-load-on-intersection";
const TimeDisplay = lazy(
  () => import("./components/time-display/time-display"),
);

const LazyTimeDisplay = withLazyLoadOnIntersection({
  Component: TimeDisplay,
  fallback: <div>Loading time display...</div>,
  options: { threshold: 0.5, rootMargin: "100px", triggerOnce: true },
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="content-block">
        <h3>This is lazy loading test</h3>
      </div>
      <div className="content-block">
        <LazyTimeDisplay additionalText="This was lazy loaded on intersection" />
      </div>
    </>
  );
}

export default App;
