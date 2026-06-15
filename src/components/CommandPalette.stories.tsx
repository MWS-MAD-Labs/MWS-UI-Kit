import { useState } from "react";
import {
  BarChart3,
  FileText,
  GraduationCap,
  Home,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "./Button";
import { CommandPalette, type CommandPaletteItem } from "./CommandPalette";

const baseItems: CommandPaletteItem[] = [
  {
    id: "home",
    label: "Open dashboard",
    description: "Return to the main overview",
    keywords: ["home", "overview"],
    shortcut: "⌘D",
  },
  {
    id: "students",
    label: "Open students",
    description: "Go to the student directory",
    keywords: ["learners", "directory"],
    shortcut: "⌘S",
  },
  {
    id: "reports",
    label: "Open reports",
    description: "Review analytics and exports",
    keywords: ["analytics", "insights"],
    shortcut: "⌘R",
  },
];

const groupedItems: CommandPaletteItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "School-wide overview",
    group: "Navigation",
  },
  {
    id: "students",
    label: "Students",
    description: "Student records and profiles",
    group: "Navigation",
  },
  {
    id: "new-note",
    label: "New note",
    description: "Create a pastoral care note",
    group: "Actions",
  },
  {
    id: "export-report",
    label: "Export report",
    description: "Download the current report",
    group: "Actions",
  },
];

const iconItems: CommandPaletteItem[] = [
  {
    id: "home",
    label: "Open dashboard",
    description: "Return to the main overview",
    icon: <Home className="size-4" />,
  },
  {
    id: "students",
    label: "Open students",
    description: "Go to student records",
    icon: <Users className="size-4" />,
  },
  {
    id: "reports",
    label: "Open reports",
    description: "Review analytics",
    icon: <BarChart3 className="size-4" />,
  },
  {
    id: "settings",
    label: "Open settings",
    description: "Manage workspace preferences",
    icon: <Settings className="size-4" />,
  },
];

function CommandPaletteDemo({
  items,
  initialOpen = true,
  emptyMessage,
}: {
  items: CommandPaletteItem[];
  initialOpen?: boolean;
  emptyMessage?: string;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  return (
    <div className="min-h-[28rem] bg-surface-base p-6 text-primary">
      <div className="mx-auto grid max-w-xl gap-4 rounded-3xl border border-subtle bg-surface-card p-6">
        <div>
          <p className="heading-font text-sm font-bold text-brand">
            CommandPalette demo
          </p>
          <h3 className="heading-font mt-2 text-2xl font-extrabold">
            Press Cmd/Ctrl+K or use the button
          </h3>
          {lastCommand ? (
            <p className="mt-2 text-sm text-tertiary">
              Last selected: {lastCommand}
            </p>
          ) : null}
        </div>
        <Button leftIcon={<Search className="size-4" />} onClick={() => setOpen(true)}>
          Open command palette
        </Button>
      </div>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items.map((item) => ({
          ...item,
          onSelect: () => setLastCommand(item.label),
        }))}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

export default {
  title: "Components/CommandPalette",
  component: CommandPalette,
};

export function Basic() {
  return <CommandPaletteDemo items={baseItems} />;
}

export function Grouped() {
  return <CommandPaletteDemo items={groupedItems} />;
}

export function WithIcons() {
  return <CommandPaletteDemo items={iconItems} />;
}

export function EmptyState() {
  return (
    <CommandPaletteDemo
      items={[]}
      emptyMessage="No matching school actions. Try a different search."
    />
  );
}

export function DisabledItems() {
  return (
    <CommandPaletteDemo
      items={[
        ...baseItems,
        {
          id: "archive-year",
          label: "Archive academic year",
          description: "Unavailable until the year-end checklist is complete",
          disabled: true,
        },
      ]}
    />
  );
}

export function ShortcutDemo() {
  return (
    <CommandPaletteDemo
      items={[
        {
          id: "new-student",
          label: "New student",
          description: "Create a new student profile",
          icon: <GraduationCap className="size-4" />,
          shortcut: "⌘N",
        },
        {
          id: "new-note",
          label: "New note",
          description: "Add a pastoral care note",
          icon: <FileText className="size-4" />,
          shortcut: "⌘⇧N",
        },
        {
          id: "search",
          label: "Search everywhere",
          description: "Find records across school apps",
          icon: <Search className="size-4" />,
          shortcut: "⌘K",
        },
      ]}
    />
  );
}
