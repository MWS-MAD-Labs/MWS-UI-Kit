import {
  type KeyboardEvent,
  type ReactNode,
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
  disabled?: boolean;
  onSelect?: () => void;
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
};

function getItemSearchText(item: CommandPaletteItem) {
  return [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase();
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
}: CommandPaletteProps) {
  const listboxId = useId();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [internalValue, setInternalValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchValue = value ?? internalValue;

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return items;

    return items.filter((item) =>
      getItemSearchText(item).includes(normalizedSearch)
    );
  }, [items, searchValue]);

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
    if (!enabledItems.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % enabledItems.length);
      return;
    }

    if (event.key === "ArrowUp") {
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
            <div className="grid gap-1">
              {filteredItems.map((item) => {
                const enabledIndex = enabledItems.findIndex(
                  (enabledItem) => enabledItem.id === item.id
                );
                const active = enabledIndex === activeIndex && !item.disabled;

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
