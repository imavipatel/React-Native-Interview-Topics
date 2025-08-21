/*

🧱 1. Foundations of JavaScript
* Working of JS & JS Engine
    * How JS is parsed and executed
    * Memory allocation & garbage collection
    * Types of garbage collection/ Memory Leaks
    * Event loop basics, JS single-threaded nature
* Execution Context & Global Object
    * Global vs function execution context
    * Lexical environment & variable environment
    * Hoisting of variables and functions
* Call Stack & Memory Heap
    * Stack overflow and memory leak examples
    * Function call management
* ECMAScript & ES6+ new features overview
    * let / const / block scope
    * Arrow functions
    * Template literals & tagged templates
    * Destructuring assignment (arrays & objects)
    * Modules (import/export)
    * Optional chaining ?. & nullish coalescing ??
* Blocking vs Non-blocking
    * Synchronous vs asynchronous execution
    * Event loop, microtasks vs macrotasks
* Additional Topics
    * Strict mode ('use strict')
    * Temporal Dead Zone (TDZ)
    * Shortest JS program / Hello World variations
    * Global object differences: window, global, globalThis
    * Comparison quirks (== vs ===)

🔢 2. Data Types & Variables
* Primitive vs Non-Primitive Types
* Symbol datatype
* Mutable vs Immutable
* let / const / var
* undefined vs null vs not defined
* Truthy & Falsy values
* Type Coercion & Type Conversion
* Hoisting & Temporal Dead Zone
* Illegal Shadowing
* Additional Topics
    * typeof vs instanceof
    * NaN, Infinity, -Infinity
    * BigInt introduction
    * Spread & Rest Operators (arrays/objects/functions)
    * Destructuring (nested objects/arrays)

📦 3. Core Data Structures & Operations
* Strings
    * All string methods (charAt, slice, substring, replace, match, includes, startsWith, endsWith, repeat, padStart, padEnd)
    * Template Literals & Tagged Templates
    * String immutability
* Arrays
    * push, pop, shift, unshift
    * map, filter, reduce, reduceRight, slice, splice, flat, forEach, some, every
    * Array dispatch event on push
    * Destructuring assignment
    * Spread & Rest Operators for arrays
    * Additional: Array.isArray, find, findIndex, sort, reverse, join
    * Bit manipulation intro – find max element from array using ES5
    * var a = [1,2,3,4,5][0,1,2,3,4] output?
* Objects
    * Object.freeze, Object.seal, Object.assign
    * Deep Freeze Object
    * Shallow copy vs Deep copy, Deep cloning techniques
    * Spread & Rest Operators for objects
    * proto, Prototype Chain & Inheritance
    * Additional: Object.keys, Object.values, Object.entries, Object.hasOwnProperty
* Collections
    * Map / WeakMap
    * mapLimit() concurrency
    * Implement Least Recently Used ( LRU ) Cache
    * Streaming tasks with mapLimit (stream of data every 1 sec) + prioritization
    * Set / WeakSet
    * Optional Chaining ?.

🔁 4. Loops & Iteration Protocol
* for / while / do-while
* for…of / for…in
* for-await-of (async iterables)
* Difference between forEach & map
* Iterables & Iterators Protocol
* Additional Topics
    * Nested loops & performance considerations
    * break / continue usage
    * Using labels with loops
    * Generator functions with iteration (yield)

🧭 5. Scope & this
* Scope & Scope Chain
* Block vs Function Scope
* Lexical vs Dynamic Scope
* this keyword (global / function / arrow / class)
* Difference: call vs apply vs bind
* Implicit and Explicit Binding
* Shortest JS program & window
* Additional Topics
    * new.target
    * globalThis
    * Shadowed variables (illegal shadowing)
    * Closures impact on scope

⚙️ 6. Functions
* Function Declaration & Expression
* Arrow Functions
* IIFE
* Default Parameters
* First Class & Higher-Order Functions
* Callback Functions
* Closures & Uses
* Currying and Infinite Currying
* Functional Programming Concepts
* Caching Functions
* Generator Functions
* Additional Topics
    * Arguments object
    * Rest & Spread in function parameters
    * Recursion & tail recursion optimization
    * Pure vs Impure functions
    * Function properties (length, name)
    * Function hoisting nuances
    * function to measure the performance of a given function

🔄 7. Asynchronous JavaScript
* setTimeout, setInterval, clearTimeout
* Event Loop, Microtasks, Macrotasks
* Callback Hell & Pyramid of Doom
* Promises & Promise Chaining
* Implement your own Promise
* Implement final() for Promise
* resolve async promises sequentially using recursion
* Promise in sequence
* Cancelable Promise
* Retry Promise N times
* Compose Polyfills
* Polyfills (call, apply, bind, map, reduce, filter, forEach, Promise, all, allSettled, race, any, flat, fetch)
* JSON.parse() polyfill
* Async/Await
* Compare: Callbacks vs Promises vs Async/Await
* Debouncing & Throttling
* Additional Topics
    * Error handling in async code (try/catch/finally with async/await)
    * Promise.allSettled vs Promise.all
    * Difference between Promise.resolve() & Promise.reject()
    * async generators (for-await-of)
    * Queue management / task scheduling

🎯 8. Browser World
* DOM & BOM
* DOM methods, find/match elements
* Event Handling: bubbling, capturing, delegation, emitter
* event.stopPropagation vs preventDefault
* Custom Events
* MutationObserver, IntersectionObserver
* Observer Pattern
* Critical Rendering Path
* script loading: async / defer
* Web APIs (Fetch, Navigator, etc.)
* XHR vs Fetch vs Axios
* HTTP vs HTTPS
* LocalStorage vs SessionStorage
* Cookies vs SessionStorage vs LocalStorage
* TTL & cookie expiry basics
* Events: DOMContentLoaded, load, beforeunload, unload
* Service Workers & Cache (basics)
* Shadow DOM (basics)
* Additional Topics
    * Reflow & Repaint (layout performance)
    * CSSOM & Render Tree overview
    * window.performance API
    * requestAnimationFrame
    * Browser memory leaks & debugging

🔥 9. Advanced Topics
* Classes & Inheritance (ES6)
* constructor, extends, super
* Static & Private class fields
* JSON handling
* Error Handling (try/catch/finally, custom errors)
* Pipe & Compose functions
* Memoisation & Caching
* Advanced memoization + caching strategies
* Generator Functions
* Execute Tasks in Parallel
* Web Workers (avoid memory leaks)
* Security Basics (XSS, CSRF)
* Lazy Loading & Infinite Scroll
* Additional Topics
    * Decorators (TypeScript / advanced JS)
    * Reflect API
    * Symbols in classes
    * Proxy & Proxy traps
    * Optional chaining inside class methods

📚 10. Bonus: System Design & Optimization Concepts
* Polyfill grouping (e.g., Lodash)
* Performance optimization in JS
* Lazy Loading
* Code splitting & tree shaking
* Event-Driven Architecture Basics
* Additional Topics
    * Memory management & profiling
    * Debugger / DevTools tips for JS
    * Lazy evaluation & caching strategies
    * Optimizing loops & DOM manipulations
    * Webpack / Rollup / Vite optimization overview
    * Design Patterns in JavaScript (Singleton, Factory, Observer, etc.)
    

*/
