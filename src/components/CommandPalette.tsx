import {
  type KeyboardEvent,
  type ReactNode,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { cx } from "./classNames";

export type CommandPaletteItem = {
  id: string;
  label: string;
  description?: ReactNode;
  keywords?: string[];
  shortcut?: string;
  icon?: ReactNode;
  group?: string;
  disabled?: boolean;
  onSelect?: () => void;
};

export type CommandPaletteShortcutOptions = {
  enabled?: boolean;
  onOpenChange: (open: boolean) => void;
};

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandPaletteItem[];
  title?: ReactNode;
  description?: ReactNode;
  searchLabel?: ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (item: CommandPaletteItem) => void;
  enableShortcut?: boolean;
};

function getNodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join(" ");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }
  return "";
}

function getItemSearchText(item: CommandPaletteItem) {
  return [item.label, getNodeText(item.description), ...(item.keywords ?? [])]
    .join(" ")
    .toLowerCase();
}

function groupItems(items: CommandPaletteItem[]) {
  const groups: Array<{ group?: string; items: CommandPaletteItem[] }> = [];

  for (const item of items) {
    const existingGroup = groups.find((entry) => entry.group === item.group);
    if (existingGroup) {
      existingGroup.items.push(item);
      continue;
    }

    groups.push({ group: item.group, items: [item] });
  }

  return groups;
}

export function useCommandPaletteShortcut({
  enabled = true,
  onOpenChange,
}: CommandPaletteShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, onOpenChange]);
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  title = "Command palette",
  description = "Search actions and jump quickly through the interface.",
  searchLabel = "Search commands",
  searchPlaceholder = "Search commands…",
  emptyMessage = "No commands found.",
  value,
  onValueChange,
  onSelect,
  enableShortcut = true,
}: CommandPaletteProps) {
  const listboxId = useId();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [internalValue, setInternalValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchValue = value ?? internalValue;

  useCommandPaletteShortcut({ enabled: enableShortcut, onOpenChange });

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return items;

    return items.filter((item) =>
      getItemSearchText(item).includes(normalizedSearch)
    );
  }, [items, searchValue]);

  const groupedItems = useMemo(
    () => groupItems(filteredItems),
    [filteredItems]
  );
  const enabledItems = filteredItems.filter((item) => !item.disabled);
  const activeItem = enabledItems[activeIndex];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, searchValue]);

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [open]);

  const updateSearchValue = (nextValue: string) => {
    onValueChange?.(nextValue);
    if (value === undefined) setInternalValue(nextValue);
  };

  const selectItem = (item: CommandPaletteItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    onSelect?.(item);
    onOpenChange(false);
  };

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      if (!enabledItems.length) return;
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % enabledItems.length);
      return;
    }

    if (event.key === "ArrowUp") {
      if (!enabledItems.length) return;
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + enabledItems.length) % enabledItems.length
      );
      return;
    }

    if (event.key === "Enter" && activeItem) {
      event.preventDefault();
      selectItem(activeItem);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className="grid gap-4">
        <Input
          ref={searchInputRef}
          label={searchLabel}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => updateSearchValue(event.target.value)}
          onKeyDown={onSearchKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-activedescendant={
            activeItem ? `${listboxId}-${activeItem.id}` : undefined
          }
        />

        <div
          id={listboxId}
          className="max-h-80 overflow-y-auto rounded-2xl border border-subtle bg-surface-card p-2"
          role="listbox"
          aria-label="Command results"
        >
          {filteredItems.length ? (
            <div className="grid gap-3">
              {groupedItems.map((group, groupIndex) => (
                <div
                  key={group.group ?? `ungrouped-${groupIndex}`}
                  className="grid gap-1"
                >
                  {group.group ? (
                    <p className="heading-font px-3 pt-2 text-xs font-extrabold uppercase tracking-wide text-tertiary">
                      {group.group}
                    </p>
                  ) : null}
                  {group.items.map((item) => {
                    const enabledIndex = enabledItems.findIndex(
                      (enabledItem) => enabledItem.id === item.id
                    );
                    const active =
                      enabledIndex === activeIndex && !item.disabled;

                    return (
                      <button
                        key={item.id}
                        id={`${listboxId}-${item.id}`}
                        className={cx(
                          "focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                          active && "bg-brand-primary-soft text-brand",
                          !active && "text-primary hover:bg-surface-base",
                          item.disabled && "cursor-not-allowed opacity-50"
                        )}
                        type="button"
                        role="option"
                        aria-selected={active}
                        disabled={item.disabled}
                        onMouseEnter={() => {
                          if (enabledIndex >= 0) setActiveIndex(enabledIndex);
                        }}
                        onClick={() => selectItem(item)}
                      >
                        {item.icon ? (
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-base text-brand">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="min-w-0 flex-1">
                          <span className="heading-font block truncate text-sm font-bold">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="mt-0.5 block truncate text-sm text-tertiary">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                        {item.shortcut ? (
                          <kbd className="heading-font rounded-lg border border-subtle bg-surface-base px-2 py-1 text-xs font-bold text-tertiary">
                            {item.shortcut}
                          </kbd>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <p className="px-3 py-8 text-center text-sm text-tertiary">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
