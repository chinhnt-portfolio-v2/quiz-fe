# tester: Vitest Setup & Component Tests — quiz-fe

**Date:** 2026-04-06
**Status:** DONE

## Setup

| Step | Result |
|------|--------|
| Install vitest + @vitejs/plugin-react + @testing-library/* + jsdom | ✅ |
| Create `src/test/setup.ts` with jest-dom matchers | ✅ |
| Update `vite.config.ts` with test config | ✅ |
| Add `test` / `test:watch` scripts to package.json | ✅ |

**Additional install:** `@testing-library/dom` was missing (required by `@testing-library/react`).

## Results

```
Test Files  4 passed (4)
     Tests  21 passed (21)
  Duration  2.51s
```

| File | Tests | Status |
|------|-------|--------|
| `quiz-session-store.test.ts` | 8 | ✅ |
| `quiz-level-badge.test.tsx` | 4 | ✅ |
| `quiz-progress-bar.test.tsx` | 4 | ✅ |
| `quiz-option-row.test.tsx` | 5 | ✅ (stderr warning — see below) |

## Issues Fixed

1. **`@testing-library/dom` missing** — install `npm install --save-dev @testing-library/dom`
2. **Store `nextQuestion` test stale closure** — captured `store` variable at `.setQueue()` time but read `store.currentIndex` after `.nextQuestion()`. Zustand `get()` reads fresh state; test was reading stale closure value. Fixed by calling `useQuizSessionStore.getState()` again before the assertion.

## Warnings (non-failing)

- `quiz-option-row.test.tsx` → **React does not recognize `whileTap` prop on DOM element.** The `motion.button` mock renders as a plain `<button>` in test. The `whileTap` attribute is passed as a React prop but not recognized by the DOM. This is cosmetic only — test passes and the component works correctly at runtime with real framer-motion. Mock could be enhanced to forward motion props if needed.

## Files Created

- `src/test/setup.ts`
- `src/components/quiz/quiz-option-row.test.tsx`
- `src/components/quiz/quiz-level-badge.test.tsx`
- `src/components/quiz/quiz-progress-bar.test.tsx`
- `src/stores/quiz-session-store.test.ts`

## Unresolved Questions

- None.