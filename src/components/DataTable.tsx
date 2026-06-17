import {
  type CSSProperties,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, TriangleAlert } from "lucide-react";
import { Card, EmptyState, Skeleton } from "./UIPrimitives";
import { cx } from "./classNames";

export type DataTableRowId = string;
export type DataTableSortDirection = "asc" | "desc";
export type DataTableDensity = "comfortable" | "compact" | "dense";

export type DataTableSort = {
  columnId: string;
  direction: DataTableSortDirection;
};

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  sortValue?: (
    row: T,
    index: number
  ) => string | number | Date | null | undefined;
  align?: "left" | "center" | "right";
  width?: string;
  hideOnMobile?: boolean;
};

export type DataTableSelectionState = {
  selectedRowIds: DataTableRowId[];
  onSelectedRowIdsChange: (selectedRowIds: DataTableRowId[]) => void;
};

export type DataTableSortingState = {
  sortBy?: DataTableSort;
  defaultSortBy?: DataTableSort;
  onSortByChange?: (sortBy: DataTableSort) => void;
};

export type DataTablePaginationState = {
  pageIndex?: number;
  defaultPageIndex?: number;
  pageSize: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageIndexChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export type DataTableVirtualizationState = {
  enabled: boolean;
  estimateRowHeight?: number;
  overscan?: number;
  maxHeight?: number;
};

export type DataTableStateContent = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

type DataTableRowModel<T> = {
  row: T;
  sourceIndex: number;
  id: DataTableRowId;
};

type DataTableVirtualRow = {
  index: number;
  size: number;
  start: number;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T, index: number) => DataTableRowId;
  selection?: DataTableSelectionState;
  sorting?: DataTableSortingState;
  loading?: boolean;
  loadingLabel?: string;
  emptyState?: DataTableStateContent;
  errorState?: DataTableStateContent | ReactNode;
  pagination?: DataTablePaginationState;
  virtualization?: DataTableVirtualizationState;
  density?: DataTableDensity;
  rowActions?: (row: T, index: number) => ReactNode;
  caption?: string;
  className?: string;
  tableClassName?: string;
  "aria-label"?: string;
};

const densityClasses: Record<DataTableDensity, string> = {
  comfortable: "px-4 py-4 text-sm",
  compact: "px-3 py-3 text-sm",
  dense: "px-2 py-2 text-xs",
};

const densityRowHeight: Record<DataTableDensity, number> = {
  comfortable: 56,
  compact: 48,
  dense: 40,
};

const defaultEmptyState: DataTableStateContent = {
  title: "No records yet",
  description: "Records will appear here once data is available.",
};

const defaultErrorState: DataTableStateContent = {
  title: "Unable to load records",
  description: "Try refreshing the page or check back shortly.",
};

function compareValues(
  aValue: string | number | Date | null | undefined,
  bValue: string | number | Date | null | undefined
) {
  if (aValue == null && bValue == null) return 0;
  if (aValue == null) return -1;
  if (bValue == null) return 1;

  if (aValue instanceof Date || bValue instanceof Date) {
    return (
      new Date(aValue as string | number | Date).getTime() -
      new Date(bValue as string | number | Date).getTime()
    );
  }

  if (typeof aValue === "number" && typeof bValue === "number") {
    return aValue - bValue;
  }

  return String(aValue).localeCompare(String(bValue), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function useControllablePageIndex(pagination?: DataTablePaginationState) {
  const [uncontrolledPageIndex, setUncontrolledPageIndex] = useState(
    pagination?.defaultPageIndex ?? 0
  );
  const pageIndex = pagination?.pageIndex ?? uncontrolledPageIndex;

  const setPageIndex = (nextPageIndex: number) => {
    pagination?.onPageIndexChange?.(nextPageIndex);
    if (pagination?.pageIndex === undefined) {
      setUncontrolledPageIndex(nextPageIndex);
    }
  };

  return [pageIndex, setPageIndex] as const;
}

function renderStateContent(
  state: DataTableStateContent | ReactNode,
  fallback: DataTableStateContent,
  tone: "empty" | "error"
) {
  if (typeof state === "object" && state !== null && "title" in state) {
    return (
      <EmptyState
        icon={
          tone === "error" ? (
            <TriangleAlert aria-hidden="true" size={24} />
          ) : undefined
        }
        title={state.title}
        description={state.description ?? fallback.description ?? ""}
        action={state.action}
      />
    );
  }

  return state;
}

function getVirtualCellStyle<T>(
  column: DataTableColumn<T>,
  useVirtualization: boolean
): CSSProperties | undefined {
  if (!useVirtualization) return undefined;

  return column.width
    ? { flex: `0 0 ${column.width}`, width: column.width }
    : { flex: "1 1 0", minWidth: 0 };
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  selection,
  sorting,
  loading = false,
  loadingLabel = "Loading table data",
  emptyState = defaultEmptyState,
  errorState,
  pagination,
  virtualization,
  density = "comfortable",
  rowActions,
  caption,
  className,
  tableClassName,
  "aria-label": ariaLabel,
}: DataTableProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [uncontrolledSortBy, setUncontrolledSortBy] = useState<
    DataTableSort | undefined
  >(sorting?.defaultSortBy);
  const sortBy = sorting?.sortBy ?? uncontrolledSortBy;
  const [pageIndex, setPageIndex] = useControllablePageIndex(pagination);

  const rowModels = useMemo<DataTableRowModel<T>[]>(
    () =>
      data.map((row, index) => ({
        row,
        sourceIndex: index,
        id: getRowId(row, index),
      })),
    [data, getRowId]
  );

  const sortedRows = useMemo(() => {
    if (!sortBy) return rowModels;

    const column = columns.find((item) => item.id === sortBy.columnId);
    if (!column?.sortable) return rowModels;

    return [...rowModels].sort((a, b) => {
      const aValue = column.sortValue
        ? column.sortValue(a.row, a.sourceIndex)
        : String(column.cell(a.row, a.sourceIndex) ?? "");
      const bValue = column.sortValue
        ? column.sortValue(b.row, b.sourceIndex)
        : String(column.cell(b.row, b.sourceIndex) ?? "");
      const result = compareValues(aValue, bValue);
      return sortBy.direction === "asc" ? result : -result;
    });
  }, [columns, rowModels, sortBy]);

  const pageSize = pagination?.pageSize;
  const totalItems = pagination?.totalItems ?? sortedRows.length;
  const pageCount = pageSize
    ? Math.max(1, Math.ceil(totalItems / pageSize))
    : 1;
  const safePageIndex = pageSize
    ? Math.min(Math.max(pageIndex, 0), pageCount - 1)
    : 0;
  const visibleRows = pageSize
    ? sortedRows.slice(
        safePageIndex * pageSize,
        safePageIndex * pageSize + pageSize
      )
    : sortedRows;
  const visibleRowIds = visibleRows.map((row) => row.id);
  const selectedRowIds = selection?.selectedRowIds ?? [];
  const selectedRowIdSet = new Set(selectedRowIds);
  const selectable = Boolean(selection);
  const selectedVisibleCount = visibleRowIds.filter((id) =>
    selectedRowIdSet.has(id)
  ).length;
  const allVisibleSelected =
    visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;
  const columnCount =
    columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const virtualizationMaxHeight = virtualization?.maxHeight ?? 560;
  const estimatedRowHeight =
    virtualization?.estimateRowHeight ?? densityRowHeight[density];
  const virtualizationOverscan = virtualization?.overscan ?? 5;
  const virtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: virtualizationOverscan,
    getItemKey: (index) => visibleRows[index]?.id ?? index,
    initialRect: { width: 0, height: virtualizationMaxHeight },
  });
  const useVirtualization = Boolean(
    virtualization?.enabled && !loading && visibleRows.length > 0
  );
  const measuredVirtualRows = useVirtualization
    ? virtualizer.getVirtualItems()
    : [];
  const initialVirtualRows = useMemo<DataTableVirtualRow[]>(() => {
    if (!useVirtualization || measuredVirtualRows.length > 0) return [];

    const initialCount = Math.min(
      visibleRows.length,
      Math.ceil(virtualizationMaxHeight / estimatedRowHeight) +
        virtualizationOverscan
    );

    return Array.from({ length: initialCount }, (_, index) => ({
      index,
      size: estimatedRowHeight,
      start: index * estimatedRowHeight,
    }));
  }, [
    estimatedRowHeight,
    measuredVirtualRows.length,
    useVirtualization,
    virtualizationMaxHeight,
    virtualizationOverscan,
    visibleRows.length,
  ]);
  const virtualRows: DataTableVirtualRow[] = measuredVirtualRows.length
    ? measuredVirtualRows
    : initialVirtualRows;

  const updateSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;

    const nextSortBy: DataTableSort = {
      columnId: column.id,
      direction:
        sortBy?.columnId === column.id && sortBy.direction === "asc"
          ? "desc"
          : "asc",
    };

    sorting?.onSortByChange?.(nextSortBy);
    if (sorting?.sortBy === undefined) {
      setUncontrolledSortBy(nextSortBy);
    }
  };

  const updateSelectedRowIds = (nextSelectedRowIds: DataTableRowId[]) => {
    selection?.onSelectedRowIdsChange(nextSelectedRowIds);
  };

  const toggleAllVisibleRows = () => {
    if (!selection) return;

    if (allVisibleSelected) {
      updateSelectedRowIds(
        selectedRowIds.filter((id) => !visibleRowIds.includes(id))
      );
      return;
    }

    updateSelectedRowIds(
      Array.from(new Set([...selectedRowIds, ...visibleRowIds]))
    );
  };

  const toggleRow = (rowId: DataTableRowId) => {
    if (!selection) return;

    updateSelectedRowIds(
      selectedRowIdSet.has(rowId)
        ? selectedRowIds.filter((id) => id !== rowId)
        : [...selectedRowIds, rowId]
    );
  };

  const goToPage = (nextPageIndex: number) => {
    setPageIndex(Math.min(Math.max(nextPageIndex, 0), pageCount - 1));
  };

  const getRowLabelIndex = (rowIndex: number) =>
    safePageIndex * (pageSize ?? visibleRows.length) + rowIndex + 1;

  const renderRow = (
    { row, sourceIndex, id }: DataTableRowModel<T>,
    rowIndex: number,
    virtualStyle?: CSSProperties
  ) => (
    <tr
      key={id}
      data-row-id={id}
      aria-selected={selectable ? selectedRowIdSet.has(id) : undefined}
      className={cx(
        "bg-surface-card transition hover:bg-surface-base",
        useVirtualization && "absolute left-0 flex w-full"
      )}
      style={virtualStyle}
    >
      {selectable ? (
        <td
          className={cx(
            "px-4 py-3",
            useVirtualization && "flex w-12 shrink-0 items-center"
          )}
        >
          <input
            className="focus-ring size-4 accent-[var(--mws-color-brand-primary)]"
            type="checkbox"
            aria-label={`Select row ${getRowLabelIndex(rowIndex)}`}
            checked={selectedRowIdSet.has(id)}
            onChange={() => toggleRow(id)}
          />
        </td>
      ) : null}
      {columns.map((column) => (
        <td
          key={column.id}
          className={cx(
            densityClasses[density],
            "text-primary",
            useVirtualization && "flex items-center",
            column.align === "right" && "text-right",
            column.align === "center" && "text-center",
            column.hideOnMobile &&
              (useVirtualization ? "hidden md:flex" : "hidden md:table-cell")
          )}
          style={getVirtualCellStyle(column, useVirtualization)}
        >
          {column.cell(row, sourceIndex)}
        </td>
      ))}
      {rowActions ? (
        <td
          className={cx(
            densityClasses[density],
            "text-right",
            useVirtualization && "flex w-16 shrink-0 items-center justify-end"
          )}
        >
          {rowActions(row, sourceIndex)}
        </td>
      ) : null}
    </tr>
  );

  if (errorState) {
    return (
      <Card
        padding="none"
        className={cx("overflow-hidden", className)}
        role="alert"
      >
        <div className="p-4">
          {renderStateContent(errorState, defaultErrorState, "error")}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className={cx("overflow-hidden", className)}>
      <div
        ref={scrollContainerRef}
        className={cx(
          "overflow-x-auto",
          useVirtualization && "overflow-y-auto"
        )}
        style={
          useVirtualization
            ? { maxHeight: virtualizationMaxHeight, position: "relative" }
            : undefined
        }
      >
        <table
          className={cx(
            "w-full min-w-[48rem] text-left",
            useVirtualization ? "grid" : "border-collapse",
            tableClassName
          )}
          aria-busy={loading || undefined}
          aria-label={ariaLabel}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead
            className={cx(
              "border-b border-subtle bg-surface-base",
              useVirtualization && "sticky top-0 z-10 grid"
            )}
          >
            <tr className={cx(useVirtualization && "flex w-full")}>
              {selectable ? (
                <th
                  className={cx(
                    "w-12 px-4 py-3",
                    useVirtualization && "flex shrink-0 items-center"
                  )}
                  scope="col"
                >
                  <input
                    ref={(node) => {
                      if (node) node.indeterminate = someVisibleSelected;
                    }}
                    className="focus-ring size-4 accent-[var(--mws-color-brand-primary)]"
                    type="checkbox"
                    aria-label="Select all visible rows"
                    aria-checked={
                      someVisibleSelected ? "mixed" : allVisibleSelected
                    }
                    checked={allVisibleSelected}
                    disabled={loading || visibleRows.length === 0}
                    onChange={toggleAllVisibleRows}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const activeSort = sortBy?.columnId === column.id;
                return (
                  <th
                    key={column.id}
                    className={cx(
                      "heading-font whitespace-nowrap px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-tertiary",
                      useVirtualization && "flex items-center",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.hideOnMobile &&
                        (useVirtualization
                          ? "hidden md:flex"
                          : "hidden md:table-cell")
                    )}
                    style={
                      useVirtualization
                        ? getVirtualCellStyle(column, useVirtualization)
                        : { width: column.width }
                    }
                    scope="col"
                    aria-sort={
                      activeSort
                        ? sortBy.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    {column.sortable ? (
                      <button
                        className={cx(
                          "focus-ring inline-flex items-center gap-1 radius-sm hover:text-brand",
                          column.align === "right" && "ml-auto",
                          column.align === "center" && "mx-auto"
                        )}
                        type="button"
                        onClick={() => updateSort(column)}
                      >
                        {column.header}
                        {activeSort && sortBy.direction === "asc" ? (
                          <ArrowUp aria-hidden="true" className="size-3" />
                        ) : null}
                        {activeSort && sortBy.direction === "desc" ? (
                          <ArrowDown aria-hidden="true" className="size-3" />
                        ) : null}
                        <span className="sr-only">
                          {activeSort
                            ? `Sorted ${
                                sortBy.direction === "asc"
                                  ? "ascending"
                                  : "descending"
                              }`
                            : "Sort column"}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {rowActions ? (
                <th
                  className={cx(
                    "w-16 px-4 py-3",
                    useVirtualization && "flex shrink-0 items-center"
                  )}
                  scope="col"
                >
                  <span className="sr-only">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody
            className={cx(
              "divide-y divide-[var(--mws-color-border-subtle)]",
              useVirtualization && "relative block"
            )}
            style={
              useVirtualization
                ? { height: virtualizer.getTotalSize(), position: "relative" }
                : undefined
            }
          >
            {loading ? (
              Array.from({ length: pagination?.pageSize ?? 5 }).map(
                (_, rowIndex) => (
                  <tr key={rowIndex} className="bg-surface-card">
                    <td className="px-4 py-3" colSpan={columnCount}>
                      <Skeleton
                        className="h-8 w-full"
                        aria-label={rowIndex === 0 ? loadingLabel : undefined}
                      />
                    </td>
                  </tr>
                )
              )
            ) : visibleRows.length === 0 ? (
              <tr>
                <td className="px-4 py-8" colSpan={columnCount}>
                  {renderStateContent(emptyState, defaultEmptyState, "empty")}
                </td>
              </tr>
            ) : useVirtualization ? (
              virtualRows.map((virtualRow) => {
                const rowModel = visibleRows[virtualRow.index];
                return renderRow(rowModel, virtualRow.index, {
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                });
              })
            ) : (
              visibleRows.map((rowModel, visibleIndex) =>
                renderRow(rowModel, visibleIndex)
              )
            )}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div className="flex flex-col gap-3 border-t border-subtle bg-surface-base px-4 py-3 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite">
            Page {safePageIndex + 1} of {pageCount} · {totalItems}{" "}
            {totalItems === 1 ? "row" : "rows"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {pagination.pageSizeOptions?.length ? (
              <label className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  className="focus-ring radius-md border border-subtle bg-surface-card px-2 py-1 text-primary"
                  value={pagination.pageSize}
                  onChange={(event) =>
                    pagination.onPageSizeChange?.(Number(event.target.value))
                  }
                >
                  {pagination.pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <button
              className="focus-ring radius-md border border-subtle bg-surface-card px-3 py-2 font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={() => goToPage(safePageIndex - 1)}
              disabled={safePageIndex === 0 || loading}
            >
              Previous
            </button>
            <button
              className="focus-ring radius-md border border-subtle bg-surface-card px-3 py-2 font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={() => goToPage(safePageIndex + 1)}
              disabled={safePageIndex >= pageCount - 1 || loading}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
