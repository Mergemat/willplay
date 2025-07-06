## Build, Lint, and Test Commands

- **Build:** `npm run build`
- **Lint:** `npm run check`
- **Type Check:** `npm run typecheck`
- **Test:** No dedicated test command found.

## Code Style Guidelines

### Formatting

- Managed by Biome with the `ultracite` preset.
- Use double quotes for all JavaScript/TypeScript and JSX.
- Run `npm run check:write` to format code.

### Naming Conventions

- Use camelCase for variables and functions.
- Use PascalCase for components and types.
- Files should be named in kebab-case.

### Types

- This is a strict TypeScript project (`strict: true`).
- `noUncheckedIndexedAccess` is enabled, so be mindful of array/object access.
- `strictNullChecks` is enabled. Avoid `null` or `undefined` where possible.

### Imports

- Use absolute imports for modules within the project using the `~/*` alias (e.g., `~/components/button`).

### Error Handling

- Use try/catch blocks for asynchronous operations that may fail.
- Return `Result` objects or throw errors as appropriate for the context.

# Motion documentation for LLMs

## React (prev Framer Motion)

### Get started
- [Get started with Motion for React](/docs/react-quick-start.md): Get started with Motion for React with our installation guide and interactive examples.

### Animations
- [Gestures](/docs/react-gestures.md): Learn how to use Motion for React's powerful gesture system to trigger animations and events.
- [Layout animations](/docs/react-layout-animations.md): Learn how to create layout and shared layout animations with Motion for React.
- [React animation](/docs/react-animation.md): Learn how to animate with Motion for React. Discover springs, exit animations, layout animations, scroll animations and more.
- [Scroll animations](/docs/react-scroll-animations.md): Learn how to create scroll-linked and scroll-triggered animations in React with Motion.
- [Transitions](/docs/react-transitions.md): A transition defines how values animate from one state to another. Learn how to configure transitions in Motion for React, with durations, cubic bezier curves, springs and more.

### Components
- [AnimatePresence](/docs/react-animate-presence.md): Learn how to quickly make exit animations with Motion for React's AnimatePresence component.
- [LayoutGroup](/docs/react-layout-group.md): Animate layout across component groups with the LayoutGroup component.
- [LazyMotion](/docs/react-lazy-motion.md): Reduce the bundlesize of Motion for React by lazy-loading functionality with the LazyMotion component.
- [motion](/docs/react-motion-component.md): The motion component is a DOM element supercharged with 120fps animations and gestures.
- [MotionConfig](/docs/react-motion-config.md): Learn how use the MotionConfig component to set a default transition for all components, define reduced motion settings, or set a security policy.
- [Reorder](/docs/react-reorder.md): Learn how to create simple drag-to-reorder effects with Motion for React's Reorder components.

### Motion Values
- [Motion values overview](/docs/react-motion-value.md): Learn how to use Motion's motion values, a performant way to track state and velocity.
- [useMotionTemplate](/docs/react-use-motion-template.md): Combine multiple motion values with a string template.
- [useMotionValueEvent](/docs/react-use-motion-value-event.md): Subscribe to motion value events from a React component.
- [useScroll](/docs/react-use-scroll.md): Learn how to create scroll-linked animations with Motion's simple yet powerful useScroll hook.
- [useSpring](/docs/react-use-spring.md): useSpring creates a motion value that animates to its target with a spring.
- [useTime](/docs/react-use-time.md): A motion value that updates every animation frame with the duration, in milliseconds, since it was created.
- [useTransform](/docs/react-use-transform.md): useTransform creates a new motion value that transforms the output of one or more motion values.
- [useVelocity](/docs/react-use-velocity.md): Create a motion value that tracks the velocity of another motion value.

### Hooks
- [useAnimate](/docs/react-use-animate.md): Create an animate function with animation controls, timelines, scoped selectors and automatic cleanup.
- [useAnimationFrame](/docs/react-use-animation-frame.md): Create an animation loop that runs a callback every frame.
- [useDragControls](/docs/react-use-drag-controls.md): Learn how to manually start/stop dragging a motion component with the useDragControls hook.
- [useInView](/docs/react-use-in-view.md): A simple state hook for detecting when an element is within the viewport.
- [useReducedMotion](/docs/react-use-reduced-motion.md): A hook that determines whether the user prefers reduced motion.

### Integrations
- [Framer](/docs/framer.md): Motion for React is already installed in your Framer project. Learn how to use it in your code components and overrides with this simple guide.
- [Integrate Motion with Radix](/docs/radix.md): Learn how to animate Radix components with Motion for React. Easily add layout, exit and spring animations to your Radix components. With live code examples for Tabs, Tooltip and more.

### Guides
- [Accessibility](/docs/react-accessibility.md): How to design accessible animations with Motion for React.
- [Reduce bundle size](/docs/react-reduce-bundle-size.md): Learn what makes up Motion's bundle size, and how to reduce it.
- [Upgrade guide](/docs/react-upgrade-guide.md): How to upgrade to the latest version of Motion for React.

### 3D
- [Layout cameras](/docs/react-three-fiber-layout-cameras.md): A perspective and orthographic camera that integrates with Framer Motion's layout animations.
- [Motion for React Three Fiber](/docs/react-three-fiber.md): Learn how to use Motion for React with React Three Fiber.
- [MotionCanvas](/docs/react-three-fiber-motion-canvas.md): A React Three Fiber Canvas replacement for linking Motion for React DOM and Three.js.

