/**
 * ==============================================================
 * 📘 React Notes – Props Drilling vs Composition
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Props Drilling?
 * - Passing data from parent → child → grandchild → further down,
 *   even if intermediate components don’t need that data.
 * - Happens when state/data is at a top-level component but
 *   deep children need access.
 * - Leads to "prop chains" that make code harder to read/maintain.
 *
 * ✅ Example use: Small apps with few levels of components.
 * ❌ Problem: Becomes messy in large apps (too many unnecessary props).
 *
 * --------------------------------------------------------------
 * 🔹 What is Composition?
 * - A React design pattern where components are combined together
 *   (composed) instead of drilling props deeply.
 * - Instead of passing props through every level,
 *   we can directly "inject" children/components where needed.
 * - Helps to reduce prop drilling and makes code reusable & clean.
 *
 * ✅ Example use: Wrapper components, layout components, slots.
 * ❌ Still not enough if many unrelated components need same data.
 *
 * --------------------------------------------------------------
 * 🔹 Key Differences
 * - Props Drilling:
 *    * Data passed explicitly through multiple layers.
 *    * Can cause unnecessary re-renders of intermediate components.
 *    * Makes refactoring harder as hierarchy grows.
 *
 * - Composition:
 *    * Lets parent wrap children components or pass JSX directly.
 *    * Cleaner and avoids "prop chain pollution".
 *    * Promotes reuse and flexibility.
 *
 * --------------------------------------------------------------
 * 🔹 When to use what?
 * - Props Drilling → OK for simple, small apps (2-3 levels).
 * - Composition → Better for reusable UI structures, layouts, and
 *   avoiding unnecessary prop passing.
 * - For **global shared state** → use Context API or state managers
 *   (Redux, Zustand, Jotai, etc.).
 *
 * ==============================================================
 */

//
// 🔹 Example 1: Props Drilling
//
function App() {
  const user = { name: "Avi" };
  return <Parent user={user} />;
}

function Parent({ user }) {
  // Passing down to Child even if Parent doesn’t use it
  return <Child user={user} />;
}

function Child({ user }) {
  // Passing further to GrandChild
  return <GrandChild user={user} />;
}

function GrandChild({ user }) {
  return <h1>Hello, {user.name}</h1>;
}

//
// 🔹 Example 2: Composition
//
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function App2() {
  return (
    <Card>
      <h1>Title</h1>
      <p>This is inside a card!</p>
    </Card>
  );
}
// ✅ Cleaner: No need to pass props unnecessarily down multiple levels.

//
// 🔹 Example 3: Composition with Props
//
function Layout({ header, content, footer }) {
  return (
    <div>
      <header>{header}</header>
      <main>{content}</main>
      <footer>{footer}</footer>
    </div>
  );
}

function App3() {
  return (
    <Layout
      header={<h1>My App</h1>}
      content={<p>Main Content Here</p>}
      footer={<small>© 2025</small>}
    />
  );
}
// ✅ Each part passed directly → no drilling needed.

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is props drilling?
 *    → Passing props through multiple levels even if only the last
 *      child needs them.
 *
 * Q2: Why is props drilling bad?
 *    → Causes unnecessary re-renders, bloated component interfaces,
 *      and harder maintenance.
 *
 * Q3: How does composition solve props drilling?
 *    → Instead of passing props down each level, parent can directly
 *      wrap or inject children where needed.
 *
 * Q4: Give a real-world analogy of props drilling vs composition.
 *    → Props Drilling: Asking each friend to pass a note until it
 *      reaches the target person.
 *      Composition: Handing the note directly to the right person.
 *
 * Q5: When should we prefer Context API or Redux over composition?
 *    → When many unrelated components across the tree need the same
 *      data (global/shared state).
 *
 * Q6: Can props drilling and composition be used together?
 *    → Yes. Composition handles UI structure, while props drilling
 *      is fine for small/simple data passing.
 *
 * ==============================================================
 */
