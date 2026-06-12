# AI Agent Guide: MWS Heart & Purpose UI Kit

This is the compact operating guide for AI coding agents building or modifying MWS/MAD Labs product screens.

## Primary goal

Every generated interface should help users feel:

> MWS is a place where goodness grows.

Prioritize readability, compassion, accessibility, and reuse over novelty.

## Read order for agents

1. `docs/AI_AGENT_GUIDE.md` — compact workflow and guardrails.
2. `llms.txt` — machine-readable repository map and canonical rules.
3. `src/data/uiKit.ts` — structured tokens, product references, page templates, checklists, and agent rules.
4. `src/components/UIPrimitives.tsx` — reusable React primitives and expected class patterns.
5. `src/styles/global.css` — CSS variables, typography classes, focus ring, shadows, and motion utilities.
6. `docs/DEVELOPER_GUIDELINES.md` — full implementation guidance.

## Decision workflow

When asked to create or change a screen:

1. Identify the product context:
   - Reading/library
   - Wellbeing/check-in
   - MTSS/student support
   - Proofpoint/performance/evidence
   - Parent communication
   - Admin/internal tooling
2. Choose the palette:
   - Base: Burgundy `#7E1518`, White `#FFFFFF`, Charcoal `#241718`.
   - Add one meaningful secondary color:
     - Reading/library: Gold + Sky
     - Wellbeing/check-in: Rose + Sky
     - MTSS/support: Sage + Sky
     - Performance/evidence: Navy + Gold
     - Parent communication: mostly White + Charcoal, Burgundy for structure, small Gold accent
3. Compose from existing primitives first:
   - `Button`
   - `Card`
   - `Badge`
   - `SectionHeader`
   - `ProgressBar`
   - `InputPreview` / form patterns
   - `EmptyStatePreview`
4. Use the page templates in `src/data/uiKit.ts` before inventing a new layout.
5. Write warm, specific, action-oriented copy.
6. Validate accessibility and run `npm run build` when code changes are made.

## Implementation defaults

- Use React + TypeScript + Tailwind CSS patterns already present in the repo.
- Prefer CSS variables in `src/styles/global.css` and color data in `src/data/uiKit.ts`.
- Keep layouts spacious: clear sections, rounded cards, short paragraphs, one primary action.
- Use `Plus Jakarta Sans` for headings and controls, `Nunito Sans` for body text, `Lora` only for quotes/reflection prompts.
- Use Lucide icons consistently; add accessible names for interactive icon-only controls.

## Do

- Reuse existing tokens, components, class patterns, and motion utilities.
- Preserve semantic headings and readable section hierarchy.
- Use visible labels, focus states, keyboard-accessible controls, and status text alongside color.
- Use supportive status labels such as `Growing`, `Guided support`, `Needs reflection`, `Evidence ready`, and `Completed`.
- Make empty states encouraging and useful.
- Keep the UI calm and easy for teachers, parents, students, and leaders to scan quickly.

## Do not

- Do not invent a new color palette, typography system, shadow style, or animation language.
- Do not make screens overly Burgundy or visually heavy.
- Do not use punitive labels like `Problem student`, `Failed`, `Bad behavior`, or `Low performer`.
- Do not use motion for urgency, pressure, flashing, bouncing, or decoration-heavy effects.
- Do not communicate status by color alone.
- Do not crowd dashboards with too many unrelated widgets above the fold.

## Copy rules

Good MWS copy is warm, clear, truthful, compassionate, and encouraging.

Use words like:

- Grow
- Guide
- Reflect
- Support
- Progress
- Evidence
- Belonging
- Purpose
- Community

Avoid tones linked to shame, punishment, fear, elitism, academic pressure, bullying, discrimination, or fixed mindset.

## Accessibility checklist

Before finishing a generated screen, verify:

- Inputs have visible or screen-reader-accessible labels.
- Buttons and links have clear accessible names.
- Focus states are visible.
- Color contrast is suitable for body text and controls.
- Status information is not conveyed by color alone.
- Tables use proper headers.
- Modals/drawers support keyboard navigation.
- Reduced-motion preferences are respected.

## Final output expectation

When reporting changes, mention:

- Files changed.
- Which MWS product context the changes support.
- Which tokens/components were reused.
- Validation command run, usually `npm run build`.
