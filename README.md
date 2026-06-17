# MWS Heart & Purpose UI Kit

A warm, compassionate, school-ready React UI kit for Millennia World School digital products developed by MAD Labs.

Use this package when building MWS/MAD Labs apps such as `reading-buddy`, `mws-proofpoint`, `mws-mtss-system`, `mws-daily-checkin`, and future school-facing products.

## Installation

Install the kit and its React peer dependencies:

```bash
npm install mws-ui-kit react react-dom
```

If your app already has React installed, install only the kit:

```bash
npm install mws-ui-kit
```

## Peer dependencies

Consumers must provide these packages:

| Package | Supported range | Notes |
| --- | --- | --- |
| `react` | `>=18.2.0 <20` | React 18 and 19 are supported. |
| `react-dom` | `>=18.2.0 <20` | Required for components that portal content, such as `Modal` and `CommandPalette`. |

The package also uses `lucide-react` and `@tanstack/react-virtual` internally. They are regular package dependencies and are installed with `mws-ui-kit`.

## CSS/style import

Import the kit stylesheet once near your application root, before rendering kit components:

```tsx
// src/main.tsx or src/App.tsx
import "mws-ui-kit/style.css";
```

Then import components from the package entrypoint:

```tsx
import { Button, Input, Modal } from "mws-ui-kit";
```

The stylesheet includes:

- MWS design tokens as CSS custom properties.
- Tailwind-generated utility classes used by the kit components.
- Google Font imports for Plus Jakarta Sans, Nunito Sans, and Lora.
- Light and dark theme token values.

## Token setup

The stylesheet defines tokens on `:root` and `[data-theme="light"]`. Dark mode is available by setting `data-theme="dark"` on a parent element, commonly `<html>`:

```tsx
export function App() {
  return (
    <div data-theme="light">
      <Dashboard />
    </div>
  );
}
```

To enable dark mode globally:

```html
<html data-theme="dark">
  <!-- app -->
</html>
```

Use the exported `tokens` object when you need token references in JavaScript or inline styles:

```tsx
import { tokens } from "mws-ui-kit";

export function BrandPanel() {
  return (
    <section style={{ color: tokens.color.text.primary }}>
      MWS tokens resolve to CSS variables.
    </section>
  );
}
```

Prefer semantic CSS variables such as `--mws-color-text-primary`, `--mws-color-surface-card`, and `--mws-color-brand-primary` over hard-coded colors.

## Button usage

```tsx
import { Button } from "mws-ui-kit";

export function Actions() {
  return (
    <div className="flex gap-3">
      <Button onClick={() => console.log("saved")}>Save changes</Button>
      <Button variant="outline">Review</Button>
      <Button variant="ghost" href="/help">
        Help center
      </Button>
      <Button variant="destructive" loading>
        Removing
      </Button>
    </div>
  );
}
```

Common props:

- `variant`: `primary` (default), `gold`, `soft`, `outline`, `ghost`, `destructive`.
- `size`: `sm`, `md` (default), `lg`.
- `loading`: shows a spinner and prevents interaction.
- `fullWidth`: stretches the button to the container width.
- `leftIcon` / `rightIcon`: decorative or labelled React nodes.
- `href`: renders an anchor styled as a button.
- `ariaLabel`: accessible label for icon-only or ambiguous actions.

## Input usage

```tsx
import { Input } from "mws-ui-kit";

export function StudentNameField() {
  return (
    <Input
      label="Student name"
      helperText="Use the name shown in the student information system."
      placeholder="Alya Rahman"
      required
    />
  );
}
```

Show validation errors with `error`; the component wires `aria-invalid` and descriptions automatically:

```tsx
<Input
  label="Family email"
  type="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  error={!email.includes("@") ? "Enter a valid email address." : undefined}
/>
```

## Modal usage

```tsx
import { useState } from "react";
import { Button, Modal } from "mws-ui-kit";

export function ConfirmModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Archive student note?"
        description="Archived notes can still be found in student history."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Archive
            </Button>
          </div>
        }
      >
        <p className="text-sm text-secondary">
          This action removes the note from the active support plan.
        </p>
      </Modal>
    </>
  );
}
```

`Modal` renders through a React portal, traps focus while open, closes on Escape/backdrop click, and restores focus when closed.

## CommandPalette usage

`CommandPalette` provides a searchable command dialog with grouped items and a built-in `Cmd/Ctrl + K` shortcut.

```tsx
import { useState } from "react";
import { CommandPalette, type CommandPaletteItem } from "mws-ui-kit";

const commands: CommandPaletteItem[] = [
  {
    id: "student-search",
    label: "Search students",
    description: "Find a student profile",
    group: "Navigate",
    shortcut: "S",
    keywords: ["learners", "profiles"],
    onSelect: () => console.log("go to student search"),
  },
  {
    id: "new-note",
    label: "Create support note",
    group: "Actions",
    onSelect: () => console.log("create note"),
  },
];

export function AppCommandPalette() {
  const [open, setOpen] = useState(false);

  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      items={commands}
      title="MWS commands"
      searchPlaceholder="Search students, actions, or reports…"
      onSelect={(item) => console.log("selected", item.id)}
    />
  );
}
```

Set `enableShortcut={false}` if your app owns the `Cmd/Ctrl + K` shortcut and opens the palette manually.

## FormWizard usage

`FormWizard` manages multi-step forms with optional per-step validation and controlled or uncontrolled step state.

```tsx
import { useState } from "react";
import { FormWizard, Input, type FormWizardStep } from "mws-ui-kit";

export function IntakeWizard() {
  const [studentName, setStudentName] = useState("");

  const steps: FormWizardStep[] = [
    {
      id: "student",
      title: "Student details",
      description: "Start with the student this support plan is for.",
      content: (
        <Input
          label="Student name"
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          required
        />
      ),
      validate: () => studentName.trim().length > 0,
    },
    {
      id: "goals",
      title: "Support goals",
      content: <Input label="Primary goal" placeholder="Build reading confidence" />,
    },
    {
      id: "review",
      title: "Review",
      content: <p>Confirm the plan before sharing it with the team.</p>,
    },
  ];

  return (
    <FormWizard
      steps={steps}
      completeLabel="Create plan"
      onComplete={async () => console.log("complete")}
      onCancel={() => console.log("cancel")}
    />
  );
}
```

Use `currentStepId` and `onStepChange` to control the active step from app state. Disabled steps are skipped by Next/Back navigation.

## DataTable usage

`DataTable` renders typed table data with accessible sorting, row selection, pagination, loading, empty, error, and optional virtualization states.

```tsx
import { useState } from "react";
import {
  Button,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from "mws-ui-kit";

type Student = {
  id: string;
  name: string;
  grade: string;
  readingLevel: number;
};

const columns: DataTableColumn<Student>[] = [
  {
    id: "name",
    header: "Student",
    cell: (student) => student.name,
    sortable: true,
    sortValue: (student) => student.name,
  },
  {
    id: "grade",
    header: "Grade",
    cell: (student) => student.grade,
    hideOnMobile: true,
  },
  {
    id: "readingLevel",
    header: "Reading level",
    cell: (student) => student.readingLevel,
    sortable: true,
    sortValue: (student) => student.readingLevel,
    align: "right",
  },
];

export function StudentTable({ students }: { students: Student[] }) {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<DataTableSort>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <DataTable
      aria-label="Student reading levels"
      caption="Student reading levels"
      data={students}
      columns={columns}
      getRowId={(student) => student.id}
      selection={{ selectedRowIds, onSelectedRowIdsChange: setSelectedRowIds }}
      sorting={{ sortBy, onSortByChange: setSortBy }}
      pagination={{
        pageIndex,
        pageSize,
        pageSizeOptions: [10, 25, 50],
        totalItems: students.length,
        onPageIndexChange: setPageIndex,
        onPageSizeChange: setPageSize,
      }}
      rowActions={(student) => (
        <Button variant="ghost" size="sm" ariaLabel={`Open ${student.name}`}>
          Open
        </Button>
      )}
      emptyState={{
        title: "No students found",
        description: "Try changing filters or adding a student.",
      }}
    />
  );
}
```

For long client-side row sets, opt in to virtualization:

```tsx
<DataTable
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  virtualization={{ enabled: true, estimateRowHeight: 56, overscan: 8 }}
/>
```

See [`docs/DataTable.md`](docs/DataTable.md) for details and virtualization limitations.

## Accessibility notes

- Import `mws-ui-kit/style.css` so focus rings, color tokens, layout utilities, and hidden text utilities are present.
- Provide visible labels for form controls. `Input` supports `label`, `helperText`, and `error` props and links them with ARIA attributes.
- Use `ariaLabel` on icon-only or ambiguous `Button` actions.
- Give `DataTable` either `caption` or `aria-label`; prefer stable row IDs from `getRowId` for selection.
- Keep `Modal` and `CommandPalette` titles/descriptions meaningful because they label the dialog for assistive technology.
- Do not remove keyboard support. `Modal` closes on Escape, `CommandPalette` uses Arrow Up/Down and Enter, and `FormWizard` moves focus to the active step heading.
- Virtualized tables only render visible rows; screen readers and browser find may not access off-screen rows until they are scrolled into view.
- Preserve color contrast when overriding tokens. Do not rely on color alone for status or validation.

## Semver policy

MWS UI Kit follows Semantic Versioning. See [`docs/semver-policy.md`](docs/semver-policy.md) for the full policy.

Summary:

- **Patch**: backwards-compatible bug fixes, documentation corrections, accessibility fixes that preserve contracts, and internal refactors.
- **Minor**: backwards-compatible new components, props, variants, tokens, utilities, or public exports.
- **Major**: removed/renamed exports, props, variants, tokens, CSS variables, package entrypoints, behavior changes consumers must adapt to, or dropped supported peer versions.

Every user-facing change should include a Changeset that states the intended version bump and any migration notes.

## Changesets release workflow

This repo uses [Changesets](https://github.com/changesets/changesets) for release notes, versioning, and publishing.

For a user-facing change:

```bash
npm run changeset
```

Choose the package (`mws-ui-kit`), select `patch`, `minor`, or `major`, and write a concise summary for consumers.

To prepare a release PR locally:

```bash
npm run version-packages
npm run build
npm run test
```

To publish after the version PR is merged and credentials are configured:

```bash
npm run release
```

See [`docs/release-workflow.md`](docs/release-workflow.md) for the complete process.

## Local development

```bash
npm install
npm run dev
npm run build
npm run test
```

Preview the production build:

```bash
npm run preview
```

Docker helpers are also available:

```bash
npm run docker:build
npm run docker:up
npm run docker:down
```

## Additional docs

- [`docs/DataTable.md`](docs/DataTable.md) — detailed `DataTable` behavior, virtualization, and limitations.
- [`docs/semver-policy.md`](docs/semver-policy.md) — release versioning policy.
- [`docs/release-workflow.md`](docs/release-workflow.md) — Changesets release workflow.
- [`docs/AI_AGENT_GUIDE.md`](docs/AI_AGENT_GUIDE.md) — compact guide for AI coding agents.
- [`docs/DEVELOPER_GUIDELINES.md`](docs/DEVELOPER_GUIDELINES.md) — implementation rules and contribution guidance.

## Brand direction

MWS interfaces should feel:

> Compassionate. Human-centered. Warm. Values-led. Joyful. Clear. Beautiful.

The system is based on the MWS message:

> Growing with Heart and Purpose.

Every MWS design should help people feel that MWS is a place where goodness grows.
