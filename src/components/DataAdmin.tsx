import { type ReactNode, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Filter,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Select,
  Skeleton,
} from "./UIPrimitives";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------------------------------
 * DataTable
 * -----------------------------------------------------------------------------------------------*/

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  accessor?: keyof T | ((row: T) => ReactNode);
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  hideOnMobile?: boolean;
};

export type DataTableSort = {
  columnId: string;
  direction: "asc" | "desc";
};

export type DataTableDensity = "comfortable" | "compact" | "dense";

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  sort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  density?: DataTableDensity;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  rowActions?: (row: T) => ReactNode;
  caption?: string;
};

export function DataTable<T>({
  columns,
  data,
  getRowId,
  sort,
  onSortChange,
  loading = false,
  emptyTitle = "No records yet",
  emptyDescription = "Records will appear here once there is data for the selected view.",
  density = "comfortable",
  selectedRowIds,
  onSelectedRowIdsChange,
  rowActions,
  caption,
}: DataTableProps<T>) {
  const selectable = Boolean(selectedRowIds && onSelectedRowIdsChange);
  const densityClasses: Record<DataTableDensity, string> = {
    comfortable: "px-4 py-4 text-sm",
    compact: "px-3 py-3 text-sm",
    dense: "px-2 py-2 text-xs",
  };

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const column = columns.find((item) => item.id === sort.columnId);
    if (!column?.accessor) return data;
    return [...data].sort((a, b) => {
      const accessor = column.accessor;
      if (!accessor) return 0;
      const aValue = typeof accessor === "function" ? accessor(a) : a[accessor];
      const bValue = typeof accessor === "function" ? accessor(b) : b[accessor];
      const compare = String(aValue ?? "").localeCompare(
        String(bValue ?? ""),
        undefined,
        { numeric: true }
      );
      return sort.direction === "asc" ? compare : -compare;
    });
  }, [columns, data, sort]);

  const allVisibleRowIds = sortedData.map(getRowId);
  const allSelected =
    selectable &&
    allVisibleRowIds.length > 0 &&
    allVisibleRowIds.every((id) => selectedRowIds?.includes(id));

  const toggleAll = () => {
    if (!selectable || !onSelectedRowIdsChange || !selectedRowIds) return;
    if (allSelected) {
      onSelectedRowIdsChange(
        selectedRowIds.filter((id) => !allVisibleRowIds.includes(id))
      );
      return;
    }
    onSelectedRowIdsChange(
      Array.from(new Set([...selectedRowIds, ...allVisibleRowIds]))
    );
  };

  const toggleRow = (id: string) => {
    if (!selectable || !onSelectedRowIdsChange || !selectedRowIds) return;
    onSelectedRowIdsChange(
      selectedRowIds.includes(id)
        ? selectedRowIds.filter((item) => item !== id)
        : [...selectedRowIds, id]
    );
  };

  const requestSort = (column: DataTableColumn<T>) => {
    if (!column.sortable || !onSortChange) return;
    const nextDirection =
      sort?.columnId === column.id && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ columnId: column.id, direction: nextDirection });
  };

  if (loading) {
    return (
      <Card padding="none" className="overflow-hidden">
        <div className="grid gap-2 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="border-b border-subtle bg-surface-base">
            <tr>
              {selectable ? (
                <th className="w-12 px-4 py-3">
                  <input
                    className="focus-ring size-4 accent-(--mws-color-brand-primary)"
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const activeSort = sort?.columnId === column.id;
                return (
                  <th
                    key={column.id}
                    className={cx(
                      "heading-font whitespace-nowrap px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-tertiary",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.hideOnMobile && "hidden md:table-cell"
                    )}
                    style={{ width: column.width }}
                    scope="col"
                  >
                    {column.sortable ? (
                      <button
                        className="focus-ring inline-flex items-center gap-1 radius-sm hover:text-brand"
                        type="button"
                        onClick={() => requestSort(column)}
                      >
                        {column.header}
                        {activeSort && sort?.direction === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : null}
                        {activeSort && sort?.direction === "desc" ? (
                          <ArrowDown className="size-3" />
                        ) : null}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {rowActions ? (
                <th className="w-16 px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--mws-color-border-subtle)">
            {sortedData.map((row, index) => {
              const rowId = getRowId(row, index);
              return (
                <tr
                  key={rowId}
                  className="bg-surface-card transition hover:bg-surface-base"
                >
                  {selectable ? (
                    <td className="px-4 py-3">
                      <input
                        className="focus-ring size-4 accent-(--mws-color-brand-primary)"
                        type="checkbox"
                        aria-label={`Select row ${index + 1}`}
                        checked={selectedRowIds?.includes(rowId) ?? false}
                        onChange={() => toggleRow(rowId)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const value = column.cell
                      ? column.cell(row)
                      : typeof column.accessor === "function"
                      ? column.accessor(row)
                      : column.accessor
                      ? (row[column.accessor] as ReactNode)
                      : null;
                    return (
                      <td
                        key={column.id}
                        className={cx(
                          densityClasses[density],
                          "text-primary",
                          column.align === "right" && "text-right",
                          column.align === "center" && "text-center",
                          column.hideOnMobile && "hidden md:table-cell"
                        )}
                      >
                        {value}
                      </td>
                    );
                  })}
                  {rowActions ? (
                    <td className={cx(densityClasses[density], "text-right")}>
                      {rowActions(row)}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------------------------------
 * FilterBar
 * -----------------------------------------------------------------------------------------------*/

export type FilterOption = {
  id: string;
  label: string;
  value: string;
};

export type FilterBarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    id: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;
  actions?: ReactNode;
  resultCount?: number;
};

export function FilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records",
  filters = [],
  actions,
  resultCount,
}: FilterBarProps) {
  return (
    <Card className="mb-5" padding="compact">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
          <label className="grid flex-1 gap-2">
            <span className="heading-font text-sm font-bold text-primary">
              Search
            </span>
            <span className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary"
                aria-hidden="true"
              />
              <input
                className="focus-ring min-h-11 w-full radius-md border border-subtle bg-surface-card py-3 pl-10 pr-4 text-primary placeholder:text-placeholder"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                type="search"
              />
            </span>
          </label>
          {filters.map((filter) => (
            <Select
              key={filter.id}
              label={filter.label}
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
              options={filter.options}
              className="min-w-44"
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {typeof resultCount === "number" ? (
            <Badge tone="neutral">{resultCount} results</Badge>
          ) : null}
          <Button variant="outline" leftIcon={<Filter className="size-4" />}>
            Filters
          </Button>
          {actions}
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Pagination
 * -----------------------------------------------------------------------------------------------*/

export type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
};

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, page * pageSize);

  return (
    <div className="mt-4 flex flex-col gap-3 text-sm text-tertiary md:flex-row md:items-center md:justify-between">
      <p>
        Showing <span className="font-bold text-primary">{start}</span>–
        <span className="font-bold text-primary">{end}</span> of{" "}
        <span className="font-bold text-primary">{totalItems}</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {onPageSizeChange ? (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              className="focus-ring radius-md border border-subtle bg-surface-card px-3 py-2 text-primary"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="flex items-center gap-2">
          <IconButton
            icon={<ChevronLeft className="size-4" />}
            label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
          <span className="heading-font font-bold text-primary">
            Page {page} of {totalPages}
          </span>
          <IconButton
            icon={<ChevronRight className="size-4" />}
            label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * MetricCard
 * -----------------------------------------------------------------------------------------------*/

export type MetricCardProps = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  tone?: "burgundy" | "gold" | "sage" | "rose" | "navy" | "sky";
};

export function MetricCard({
  label,
  value,
  detail,
  icon,
  trend,
  tone = "burgundy",
}: MetricCardProps) {
  const toneClasses = {
    burgundy: "bg-brand-primary-soft text-brand",
    gold: "bg-status-warning text-status-warning",
    sage: "bg-status-success text-status-success",
    rose: "bg-status-error text-status-error",
    navy: "bg-brand-navy-soft text-brand-navy",
    sky: "bg-status-info text-status-info",
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="heading-font text-sm font-bold text-tertiary">
            {label}
          </p>
          <p className="heading-font mt-3 text-3xl font-extrabold text-primary">
            {value}
          </p>
        </div>
        {icon ? (
          <div
            className={cx(
              "flex size-11 items-center justify-center radius-lg",
              toneClasses[tone]
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
      {detail ? (
        <p className="mt-3 text-sm leading-6 text-tertiary">{detail}</p>
      ) : null}
      {trend ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Badge
            tone={
              trend.direction === "down"
                ? "warning"
                : trend.direction === "up"
                ? "success"
                : "neutral"
            }
          >
            {trend.value}
          </Badge>
          {trend.label ? (
            <span className="text-tertiary">{trend.label}</span>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

/* -------------------------------------------------------------------------------------------------
 * ChartCard
 * -----------------------------------------------------------------------------------------------*/

export type ChartCardProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
  empty?: boolean;
};

export function ChartCard({
  title,
  description,
  children,
  actions,
  loading = false,
  empty = false,
}: ChartCardProps) {
  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="heading-font text-xl font-bold text-primary">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-tertiary">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {loading ? (
        <div className="grid gap-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : empty ? (
        <EmptyState
          title="No chart data yet"
          description="Chart data will appear once records are available for the selected filters."
        />
      ) : (
        <div className="min-h-56">{children}</div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------------------------------
 * AuditLog
 * -----------------------------------------------------------------------------------------------*/

export type AuditLogItem = {
  id: string;
  actor: string;
  action: string;
  target?: string;
  timestamp: string;
  detail?: ReactNode;
};

export function AuditLog({ items }: { items: AuditLogItem[] }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-subtle p-4">
        <h3 className="heading-font font-bold text-primary">Audit log</h3>
        <p className="mt-1 text-sm text-tertiary">
          A transparent history of important changes.
        </p>
      </div>
      <ol className="divide-y divide-(--mws-color-border-subtle)">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-start"
          >
            <div>
              <p className="text-sm leading-6 text-primary">
                <span className="heading-font font-bold">{item.actor}</span>{" "}
                {item.action}{" "}
                {item.target ? (
                  <span className="font-semibold">{item.target}</span>
                ) : null}
              </p>
              {item.detail ? (
                <div className="mt-1 text-sm leading-6 text-tertiary">
                  {item.detail}
                </div>
              ) : null}
            </div>
            <time className="text-xs font-semibold text-tertiary">
              {item.timestamp}
            </time>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* -------------------------------------------------------------------------------------------------
 * ActivityFeed
 * -----------------------------------------------------------------------------------------------*/

export type ActivityFeedItem = {
  id: string;
  title: string;
  description?: ReactNode;
  timestamp?: string;
  icon?: ReactNode;
  tone?: "info" | "success" | "warning" | "error" | "neutral";
};

export function ActivityFeed({
  items,
  title = "Recent activity",
}: {
  items: ActivityFeedItem[];
  title?: string;
}) {
  const toneClasses = {
    info: "bg-status-info text-status-info",
    success: "bg-status-success text-status-success",
    warning: "bg-status-warning text-status-warning",
    error: "bg-status-error text-status-error",
    neutral: "bg-status-neutral text-tertiary",
  };

  return (
    <Card>
      <h3 className="heading-font text-xl font-bold text-primary">{title}</h3>
      <ol className="mt-5 grid gap-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={cx(
                "mt-1 flex size-9 shrink-0 items-center justify-center radius-full",
                toneClasses[item.tone ?? "neutral"]
              )}
            >
              {item.icon ?? <Circle className="size-3" fill="currentColor" />}
            </span>
            <span className="min-w-0">
              <span className="heading-font block text-sm font-bold text-primary">
                {item.title}
              </span>
              {item.description ? (
                <span className="mt-1 block text-sm leading-6 text-tertiary">
                  {item.description}
                </span>
              ) : null}
              {item.timestamp ? (
                <time className="mt-1 block text-xs font-semibold text-tertiary">
                  {item.timestamp}
                </time>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* -------------------------------------------------------------------------------------------------
 * ApprovalFlow
 * -----------------------------------------------------------------------------------------------*/

export type ApprovalStepStatus =
  | "complete"
  | "current"
  | "pending"
  | "rejected";

export type ApprovalStep = {
  id: string;
  label: string;
  description?: ReactNode;
  owner?: string;
  timestamp?: string;
  status: ApprovalStepStatus;
};

export function ApprovalFlow({
  steps,
  title = "Approval flow",
}: {
  steps: ApprovalStep[];
  title?: string;
}) {
  const statusIcon: Record<ApprovalStepStatus, ReactNode> = {
    complete: <CheckCircle2 className="size-5" />,
    current: <Clock3 className="size-5" />,
    pending: <Circle className="size-4" />,
    rejected: <XCircle className="size-5" />,
  };
  const statusClass: Record<ApprovalStepStatus, string> = {
    complete: "bg-status-success text-status-success border-status-success",
    current: "bg-status-info text-status-info border-status-info",
    pending: "bg-status-neutral text-tertiary border-subtle",
    rejected: "bg-status-error text-status-error border-status-error",
  };

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="heading-font text-xl font-bold text-primary">{title}</h3>
        <SlidersHorizontal
          className="size-5 text-tertiary"
          aria-hidden="true"
        />
      </div>
      <ol className="relative grid gap-5 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-(--mws-color-border-subtle)">
        {steps.map((step) => (
          <li key={step.id} className="relative flex gap-4">
            <span
              className={cx(
                "z-10 flex size-10 shrink-0 items-center justify-center radius-full border bg-surface-card",
                statusClass[step.status]
              )}
            >
              {statusIcon[step.status]}
            </span>
            <span className="min-w-0 pb-1">
              <span className="heading-font block text-sm font-bold text-primary">
                {step.label}
              </span>
              {step.description ? (
                <span className="mt-1 block text-sm leading-6 text-tertiary">
                  {step.description}
                </span>
              ) : null}
              <span className="mt-2 flex flex-wrap gap-2 text-xs text-tertiary">
                {step.owner ? <Badge tone="neutral">{step.owner}</Badge> : null}
                {step.timestamp ? <time>{step.timestamp}</time> : null}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
