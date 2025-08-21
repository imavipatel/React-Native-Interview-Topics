/*

📌 1. React Fundamentals
* JSX & Babel transpilation – how JSX turns into React.createElement
* Virtual DOM vs Real DOM vs Shadow DOM
* Components – Functional vs Class
* Props vs State – immutability & data flow
* Rendering process & reconciliation (Fiber)
* StrictMode in React 18+
* Keys in lists – why important, impact on reconciliation
* Performance: minimizing re-renders in lists
* New React optimizations: React Compiler (React Forget – auto memoization)
* Security: preventing unsafe rendering with `dangerouslySetInnerHTML`

📌 2. Component Communication
* Passing props (parent → child)
* Callback functions (child → parent)
* Prop drilling problem & alternatives
* Context API – propagation & performance pitfalls
* Using selectors with context to avoid re-renders
* Controlled vs uncontrolled components
* Event emitters, custom hooks for communication
* Security: validating props with PropTypes / TypeScript
* Advanced patterns – Mediator, Observer, Pub/Sub for React apps

📌 3. State & Lifecycle
* useState, useReducer – when to use which
* Class lifecycle methods & equivalent hooks
* Derived state pitfalls & alternatives
* Asynchronous & batched state updates (React 18 concurrent mode)
* Lifting state up – avoiding prop drilling
* Avoiding stale closures & state splits
* State normalization for performance
* Security: preventing sensitive data leakage in client state
* Advanced: server-driven state management (React Server Components)

📌 4. React Hooks (Deep Dive)
* useState, useEffect, useRef fundamentals
* useCallback vs useMemo – when & why
* useReducer vs useState – scalability
* useLayoutEffect vs useInsertionEffect vs useEffect
* Custom hooks – reusability & encapsulation
* React 18+ hooks: useId, useTransition, useDeferredValue
* React 19+: useOptimistic, useActionState
* Performance: concurrent rendering with hooks
* Pitfalls: dependency arrays, closures, cleanup leaks
* Future: Async Context API proposal

📌 5. Rendering & Performance
* React.memo – caveats & deep dive
* PureComponent vs memoization vs useCallback
* Avoiding unnecessary re-renders with selectors & memoization
* Virtualization (react-window, react-virtualized)
* Suspense for data fetching & lazy loading
* Concurrent rendering – automatic batching, transitions
* Profiling with React DevTools Profiler & Flamegraphs
* Build optimization: tree-shaking, code splitting, bundle analyzers
* Server-Side Rendering (SSR) performance – streaming & caching
* Security: preventing unsafe rehydration & DOM injections

📌 6. Forms & Events
* Controlled vs uncontrolled forms
* Form validation (Formik, React Hook Form, Zod)
* Large form optimization with context & lazy validation
* Debouncing & throttling inputs
* Synthetic vs native events – event pooling
* Event bubbling & delegation
* Accessibility (a11y) best practices
* Security: sanitizing inputs, preventing XSS
* Performance: optimizing form re-renders

📌 7. Routing
* React Router v6+ – nested routes, loaders, actions
* Dynamic & protected routes
* Route-level data prefetching (Next.js / Remix)
* Lazy loading with Suspense & route-based chunking
* SSR vs CSR vs SSG vs ISR (Next.js / Remix)
* Streaming & Suspense with React Router future
* Security: handling JWTs, avoiding open redirects
* Performance: route-based code splitting, caching navigation

📌 8. Error Handling
* Error boundaries – global & granular
* try/catch in async components & Suspense
* Fallback UI patterns – loading, error, retry
* Centralized error handling & logging
* Integration with Sentry, Datadog, LogRocket
* Security: avoiding sensitive error leakage in prod
* Advanced: error handling in Server Components & async rendering

📌 9. Security in React Apps
* XSS prevention – sanitization, DOMPurify
* Safe usage of dangerouslySetInnerHTML
* CSRF protection – tokens & SameSite cookies
* JWT handling – secure storage & refresh strategies
* Clickjacking protection (X-Frame-Options, CSP)
* Dependency security – npm audit, Snyk scanning
* Protecting against supply-chain attacks
* Security headers for React SSR apps

📌 10. Testing
* Unit testing with Jest
* Component testing with React Testing Library
* Snapshot testing – pros & cons
* Integration testing – mocking APIs, async flows
* Testing hooks & context
* E2E testing with Cypress / Playwright
* Performance testing – Lighthouse CI, React Profiler
* Security testing – fuzzing, dependency scanning
* Contract testing (Pact) for API-driven React apps

📌 11. Advanced Patterns
* Higher-order components (HOC) – pitfalls
* Render props – flexibility vs complexity
* Compound components (for design systems)
* Provider pattern & modular contexts
* State machines with XState – predictable UI flows
* Micro-frontend patterns with React (Module Federation)
* Security: sandboxing micro-frontends
* Performance: isolated rendering, independent deployments

📌 12. Ecosystem & Build Tools
* CRA, Vite, Next.js differences
* SSR vs CSR vs SSG vs ISR
* Webpack 5 – Module Federation
* Babel vs SWC vs ESBuild – performance trade-offs
* TypeScript with React – strict typing
* ESLint & Prettier for code quality
* Performance: build-time optimizations, caching, bundle splitting
* Security: env variable handling, secret management
* CI/CD integration with Vite/Next.js

📌 13. Performance Optimization (Deep)
* Bundle optimization – tree-shaking, dynamic imports
* Image & asset optimization (WebP, AVIF, CDNs)
* Memoization strategies at scale
* Concurrent rendering – transitions, deferred values
* Server-side rendering optimization – streaming, caching, CDN
* Avoiding hydration mismatches
* Profiling bottlenecks with React Profiler & Flamegraphs
* React Compiler (Forget) – future of auto-optimization
* RSC performance: network waterfalls, server-driven rendering

📌 14. Deployment & CI/CD
* Production build optimization (gzip, Brotli, minification)
* Dockerizing React apps
* Hosting (Vercel, Netlify, AWS Amplify, Cloudflare Pages)
* CI/CD pipelines (GitHub Actions, CircleCI, GitLab CI)
* Feature flags & staged rollouts
* Monitoring & rollback strategies
* Security: handling secrets & env variables in CI/CD
* Performance: edge deployment, CDN caching

📌 15. New & Emerging Features (React 18 & 19)
* React Server Components (RSC) – future of React
* Suspense for data fetching
* Streaming SSR in React 18
* Automatic batching of state updates
* useOptimistic, useActionState (React 19)
* Async Context (RFC)
* Asset Loading API (upcoming React feature)
* React Forget – compiler for auto memoization
* React Canary releases – experimenting with new features

--------

📌 16. Security & Performance Checklist  

### 🔒 Security  
* Avoid `dangerouslySetInnerHTML` unless sanitized  
* Escape all user-generated content (prevent **XSS**)  
* Store JWTs in **httpOnly cookies**, not localStorage/sessionStorage  
* Implement **CSRF protection** (tokens / SameSite cookies)  
* Secure cookies with **Secure, HttpOnly, SameSite** flags  
* Add **Content Security Policy (CSP)** headers  
* Prevent **Clickjacking** with `X-Frame-Options` / CSP  
* Validate & sanitize all form inputs  
* Use **PropTypes / TypeScript** for runtime safety  
* Keep dependencies updated – run `npm audit` / `yarn audit`  
* Use tools like **Snyk**, **OWASP Dependency-Check**  
* Avoid exposing **secrets/env variables** in bundles  
* Configure **error boundaries** to avoid sensitive error leakage  
* Ensure secure API integration (HTTPS, signed requests)  

### 🚀 Performance  
* Use **React.memo / PureComponent** for expensive renders  
* Split large bundles with **dynamic imports & code splitting**  
* Use **React.lazy + Suspense** for route/component lazy loading  
* Optimize images (WebP/AVIF, responsive, lazy load)  
* Minify & compress builds (**gzip/Brotli**)  
* Enable **tree-shaking** in Webpack/Vite  
* Use **Profiler & Flamegraph** to find bottlenecks  
* Virtualize large lists (**react-window / react-virtualized**)  
* Avoid unnecessary state & prop drilling  
* Use **useCallback/useMemo** carefully (avoid over-optimization)  
* Debounce/throttle expensive events (scroll, resize, input)  
* Use **Concurrent Features** (useTransition, useDeferredValue)  
* Cache API data (React Query / SWR)  
* Pre-render & cache with **SSR/SSG/ISR**  
* Avoid hydration mismatches in SSR  
* Monitor runtime performance (Datadog, Sentry, LogRocket)  

### 🛠 Build & Deployment  
* Bundle analysis with **Webpack Bundle Analyzer / Vite Visualizer**  
* Use modern build tools (**SWC / ESBuild**) for faster builds  
* Optimize CSS (purge unused CSS, Tailwind, PostCSS)  
* Use **Hermes / TurboPack** (where supported)  
* Serve static assets via **CDN**  
* Enable **HTTP/2 or HTTP/3** for faster delivery  
* Implement **staged rollouts / feature flags**  
* Automate security scanning in CI/CD pipeline  

*/
