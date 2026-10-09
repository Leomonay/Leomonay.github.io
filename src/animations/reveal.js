// Shared stagger for scroll reveals: `style={revealDelay(i)}` on the i-th item.
// One step for the whole site keeps the rhythm uniform; the cap stops long lists
// (e.g. six earlier roles) from making the last items wait too long.
const STEP_MS = 80;
const MAX_STEPS = 4;

export const revealDelay = (index) => ({
  '--reveal-delay': `${Math.min(index, MAX_STEPS) * STEP_MS}ms`,
});
