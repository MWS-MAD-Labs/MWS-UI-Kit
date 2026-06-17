# Developer Guidelines: Using the MWS Heart & Purpose UI Kit

This guide explains how developers should use the **MWS Heart & Purpose UI Kit** when building apps for Millennia World School and MAD Labs.

The goal is to make every MWS product feel consistent, warm, readable, accessible, and aligned with the school values of **Truth, Beauty, Goodness, and Happiness**.

---

## 1. Core Rule

Every interface should help users feel:

> MWS is a place where goodness grows.

This means developers should not only reuse colors and components. They should also reuse the tone, spacing, interaction patterns, and accessibility practices defined by this kit.

---

## 2. When to Use This Kit

Use this UI kit for all MWS/MAD Labs products, including:

- Student apps
- Teacher dashboards
- Parent communication portals
- Admin tools
- Wellbeing systems
- MTSS/student support systems
- Reading/library systems
- Performance/evidence dashboards
- Internal productivity tools

Current product references:

| Product | Usage |
| --- | --- |
| `reading-buddy` | Reading, library, quizzes, reading progress |
| `mws-daily-checkin` | Wellbeing, reflection, emotion check-ins |
| `mws-mtss-system` | Student support, interventions, strategies |
| `mws-proofpoint` | Evidence, appraisal, approval workflows |

---

## 3. Recommended Tech Usage

The current UI kit is built with:

- React
- TypeScript
- Tailwind CSS
- Lucide React
- Vite

For new React apps, prefer:

```txt
React / Next.js / Vite
TypeScript
Tailwind CSS
Lucide React
```

For existing apps, use this kit as:

1. A visual and UX reference.
2. A source for reusable component patterns.
3. A source for brand tokens.
4. A guide for copywriting and accessibility.

---

## 4. Setup for Local Reference

Clone the UI kit:

```bash
git clone git@github.com:MWS-MAD-Labs/MWS-UI-Kit.git
cd MWS-UI-Kit
npm install
npm run dev
```

Build check:

```bash
npm run build
```

Use the local documentation site as the reference when implementing screens in product apps.

---

## 5. Color Usage Rules

Do not hardcode random colors in MWS apps. Use the official palette.

### Main colors

| Token | Hex | Use |
| --- | --- | --- |
| Burgundy | `#7E1518` | Primary identity, main actions, headings, official moments |
| White | `#FFFFFF` | Main surfaces and readable space |
| Gold | `#D6A13A` | Highlights, milestones, joyful accents |
| Charcoal | `#241718` | Main text instead of pure black |

### Secondary colors

| Token | Hex | Use |
| --- | --- | --- |
| Rose | `#B94A4E` | Compassion, SEL, wellbeing |
| Sage | `#6F8B6A` | Growth, sustainability, MTSS support |
| Navy | `#1F2A44` | Evidence, academics, leadership, reports |
| Sky | `#B8DDF8` | Calm, reflection, child-centered softness |

### Recommended product palettes

| Product type | Palette |
| --- | --- |
| Reading/library | Burgundy + Gold + Sky |
| Wellbeing/check-in | Burgundy + Rose + Sky |
| MTSS/student support | Burgundy + Sage + Sky |
| Proofpoint/performance | Burgundy + Navy + Gold |
| Parent communication | White + Burgundy + Charcoal + small Gold accent |
| Sustainability | Burgundy + Sage + White |
| Academic/reporting | Burgundy + Navy + White |

### Important color rules

Do:

- Use Burgundy as the brand anchor.
- Use White and warm surfaces generously.
- Use Charcoal for readable body text.
- Use one secondary color to communicate product context.
- Use Gold sparingly for highlights and celebration.

Do not:

- Make full pages overly Burgundy.
- Use secondary colors randomly.
- Use neon colors.
- Use purple as the main brand color.
- Use pure black for large areas.
- Use Gold in a flashy/luxury style.

---

## 6. Typography Rules

Use only the approved Google Fonts.

| Use | Font | Recommended weight |
| --- | --- | --- |
| Hero headline | Plus Jakarta Sans | Bold / ExtraBold |
| Page title | Plus Jakarta Sans | Bold |
| Section heading | Plus Jakarta Sans | SemiBold |
| Button / label | Plus Jakarta Sans | SemiBold |
| Body text | Nunito Sans | Regular |
| Body emphasis | Nunito Sans | SemiBold |
| Caption | Nunito Sans | Regular |
| Quote | Lora | Medium Italic |

Guidelines:

- Use sentence case for most headings.
- Avoid long all-caps text.
- Use generous line height.
- Do not introduce decorative or childish fonts.
- Do not use more than these three font families.

---

## 7. Layout Rules

MWS layouts should feel:

> Clean, calm, spacious, warm, and easy to understand.

Use:

- Rounded cards
- Generous white space
- Clear sections
- Soft borders
- Simple icons
- Calm visual rhythm
- One primary message per screen

Avoid:

- Crowded dashboards
- Too many widgets above the fold
- Harsh shadows
- Dense forms without grouping
- Random decorative elements
- Large dark sections unless needed for contrast or emphasis

Recommended shape values:

| Element | Radius |
| --- | --- |
| Small inputs/tags | `8px–12px` |
| Buttons/badges | `999px` or pill style |
| Cards | `16px–24px` |
| Hero panels | `24px–32px` |

---

## 8. Animation Kit Usage

Motion should make interfaces feel calm, responsive, and purposeful. Use animation to clarify hierarchy, feedback, and progress — not to decorate every element.

### Available motion utilities

| Utility | Use on | Purpose |
| --- | --- | --- |
| `motion-fade-up` | Section headers, cards, empty states | Introduce content gently on page load or render |
| `motion-hover-lift` | Buttons, clickable cards, selectable tiles | Communicate that the element is interactive |
| `motion-progress-grow` | Progress bars | Reveal learning, reading, or support progress |
| `motion-float` | Hero accents, illustrations, decorative badges | Add calm ambient motion only where it supports the page mood |
| `motion-pulse-soft` | Status icons, celebration icons, live indicators | Draw attention without pressure |
| `motion-orbit` | Hero badges or featured milestone accents | Add a small moment of delight, used sparingly |
| `motion-delay-100`, `motion-delay-200`, `motion-delay-300`, `motion-delay-500` | Elements using entrance animation | Stagger related items so they do not appear all at once |

### Examples

```tsx
<Card className="motion-fade-up">
  <Badge tone="sage">Growing support</Badge>
  <h3>Student support plan</h3>
</Card>
```

```tsx
<div className="motion-float rounded-3xl bg-white p-6">
  <Leaf />
</div>
```

```tsx
<ProgressBar value={68} tone="sage" />
```

`ProgressBar` already applies `motion-progress-grow` internally.

### Rules for design elements

Do:

- Use `motion-fade-up` for first-time content reveal.
- Use `motion-hover-lift` only when an element is clickable or selectable.
- Use `motion-progress-grow` for numeric progress that benefits from visual reveal.
- Keep motion subtle, warm, and short.
- Trust the kit’s reduced-motion support; continuous motion is disabled for users who prefer reduced motion.

Do not:

- Animate long paragraphs, dense tables, or form fields while users are reading or typing.
- Stack multiple continuous animations on one important content area.
- Use motion to create pressure, urgency, or competition.
- Use fast spins, bounces, flashes, or flashy celebratory effects.

See the homepage **Animation kit** section for live animated examples.

---

## 9. Component Usage Guidance

### Buttons

Use buttons consistently by action importance.

| Button type | Usage |
| --- | --- |
| Primary Burgundy | Main action on the page |
| Gold | Celebration or meaningful highlight only |
| Soft | Gentle student-facing or low-pressure action |
| Outline | Secondary action |
| Ghost | Low-emphasis navigation or cancel action |

Good button labels:

- `Continue`
- `Save reflection`
- `Start reading`
- `Submit evidence`
- `Request support`
- `View progress`

Avoid harsh labels:

- `Punish`
- `Reject student`
- `Fail`
- `Terminate`

### Cards

Use cards for grouped information. Each card should have:

- Clear title
- Short description
- Optional icon or badge
- One main action or purpose

Avoid cards with too much mixed content.

### Badges

Badges should describe status in a supportive way.

Good examples:

- `Growing`
- `Guided support`
- `Needs reflection`
- `Evidence ready`
- `Completed`

Avoid:

- `Problem student`
- `Low performer`
- `Failed`
- `Bad behavior`

### Empty states

Empty states should be encouraging and informative.

Good:

> No reflections yet. Once students begin sharing their check-ins, their wellbeing patterns will appear here.

Avoid:

> No data found.

---

## 10. Product-Specific Patterns

### Reading Buddy

Use:

- Sky for calm reading areas
- Gold for progress and joyful milestones
- Burgundy for primary navigation/actions
- Book, star, light, and library icons

Recommended components:

- `BookCard`
- `ReadingProgress`
- `QuizStatusBadge`
- `LibraryShelf`
- `AchievementBadge`

### Daily Check-in

Use:

- Rose for compassion/wellbeing states
- Sky for calm reflection areas
- Burgundy for structure and primary actions

Recommended components:

- `EmotionPicker`
- `CheckInCard`
- `MoodHistoryCard`
- `CompassionPrompt`
- `SupportNeedBadge`

### MTSS System

Use:

- Sage for growth and support
- Sky for calm student context
- Burgundy for app structure

Recommended components:

- `TierBadge`
- `InterventionCard`
- `StrategyCard`
- `ReviewTimeline`
- `MentorAssignmentCard`

Important: MTSS language must not feel punitive. Tiers and strategies should communicate support, not failure.

### Proofpoint

Use:

- Navy for evidence, reports, and leadership views
- Gold for meaningful completion or highlight
- Burgundy for primary actions and official identity

Recommended components:

- `EvidenceCard`
- `AppraisalScoreCard`
- `ApprovalFlow`
- `PerformanceCategoryBadge`
- `ReviewTimeline`

---

## 11. Copywriting Rules

MWS UI copy should sound:

> Warm, clear, truthful, compassionate, and encouraging.

Use words like:

- Discover
- Grow
- Guide
- Reflect
- Support
- Compassion
- Potential
- Purpose
- Community
- Belonging
- Evidence
- Progress

Avoid words and tones linked to:

- Punishment
- Shame
- Fear
- Bullying
- Discrimination
- Elitism
- Academic pressure
- Fixed mindset

### Error messages

Good:

> Please enter a valid school email address.

Avoid:

> Invalid input.

### Loading messages

Good:

> Preparing your dashboard...

Avoid:

> Loading...

### Empty states

Good:

> New activity will appear here once students begin their reflections.

Avoid:

> No records.

---

## 12. Accessibility Requirements

All MWS apps should meet baseline accessibility standards.

Required:

- Text contrast should meet WCG AA where possible.
- Every input must have a visible or screen-reader-accessible label.
- Buttons must have visible focus states.
- Do not use color as the only status indicator.
- Tables must use proper headers.
- Modals and drawers must support keyboard navigation.
- Interactive icons must have accessible names.
- Error messages must be attached to the relevant field.

When using icons:

- Decorative icons can be hidden from screen readers.
- Action icons need `aria-label`.
- Keep icon stroke style consistent.

---

## 13. Implementation Workflow for Developers

When building a new screen:

1. Identify the product context.
   - Reading, wellbeing, MTSS, performance, parent communication, etc.
2. Choose one supporting secondary color.
3. Use Burgundy only for identity and key actions.
4. Build the layout from existing patterns.
5. Use approved typography.
6. Write warm, clear, supportive copy.
7. Check keyboard and screen-reader behavior.
8. Run build/tests.
9. Review against the final design checklist.

---

## 14. Final Design Checklist

Before shipping a screen, ask:

1. Does it feel compassionate?
2. Does it feel human-centered?
3. Does it reflect Truth, Beauty, Goodness, or Happiness?
4. Is Burgundy present but not overpowering?
5. Is at least one secondary color used meaningfully?
6. Is the layout clean and readable?
7. Are colors controlled?
8. Does the copy avoid fear, shame, pressure, and elitism?
9. Can parents, students, or teachers understand it quickly?
10. Does it feel like MWS?

---

## 15. Contribution Guidelines

When adding to this UI kit:

- Keep components small and reusable.
- Prefer existing tokens before adding new colors or spacing.
- Add examples for each new component.
- Include accessible labels and keyboard behavior.
- Avoid adding dependencies unless necessary.
- Keep the visual style calm and warm.
- Document product-specific use cases.

Before submitting changes:

```bash
npm run build
```

If the build fails, fix the issue before publishing.

---

## 16. Practical Rule for Developers

If a design decision is unclear, choose the option that is:

1. More readable
2. More compassionate
3. More spacious
4. More accessible
5. More aligned with MWS values

Do not choose the option that is merely more decorative.
