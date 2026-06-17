# DataTable

`DataTable` renders typed, accessible table data with optional selection, sorting, pagination, loading, empty/error states, row actions, responsive columns, and virtualization.

## Import

```tsx
import { DataTable, type DataTableColumn } from "mws-ui-kit";
import "mws-ui-kit/style.css";
```

## Basic usage

```tsx
type Student = {
  id: string;
  name: string;
  grade: string;
  supportTier: string;
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
  },
  {
    id: "supportTier",
    header: "Support tier",
    cell: (student) => student.supportTier,
    hideOnMobile: true,
  },
];

<DataTable
  aria-label="Student support table"
  caption="Student support table"
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
/>;
```

## Columns

Each column needs a stable `id`, a `header`, and a `cell` renderer.

| Option | Purpose |
| --- | --- |
| `id` | Stable column identifier used for sorting. |
| `header` | Header label or React node. |
| `cell(row, index)` | Renders cell content for a row. |
| `sortable` | Enables click/keyboard sorting for the column header. |
| `sortValue(row, index)` | Value used for sorting; use this for numbers, dates, and formatted cells. |
| `align` | `left`, `center`, or `right`. |
| `width` | CSS width, especially useful with virtualization. |
| `hideOnMobile` | Hides the column below the medium breakpoint. |

## Sorting

Use uncontrolled sorting with `defaultSortBy`:

```tsx
<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  sorting={{ defaultSortBy: { columnId: "name", direction: "asc" } }}
/>;
```

Use controlled sorting when your app owns state:

```tsx
const [sortBy, setSortBy] = useState<DataTableSort>();

<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  sorting={{ sortBy, onSortByChange: setSortBy }}
/>;
```

Sortable headers expose `aria-sort` and include screen-reader text for the current sort state.

## Selection

Selection is controlled by the consumer. Always use stable row IDs.

```tsx
const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  selection={{ selectedRowIds, onSelectedRowIdsChange: setSelectedRowIds }}
/>;
```

The header checkbox selects all visible rows. With pagination, this means the current page.

## Pagination

```tsx
<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  pagination={{
    pageIndex,
    pageSize,
    pageSizeOptions: [10, 25, 50],
    totalItems: students.length,
    onPageIndexChange: setPageIndex,
    onPageSizeChange: setPageSize,
  }}
/>;
```

`pageIndex` is zero-based. If `pageIndex` is omitted, the table keeps uncontrolled page state starting from `defaultPageIndex` or `0`.

## Loading, empty, and error states

```tsx
<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  loading={isLoading}
  loadingLabel="Loading students"
  emptyState={{
    title: "No students found",
    description: "Try changing filters or adding a student.",
  }}
  errorState={
    error
      ? {
          title: "Unable to load students",
          description: "Refresh the page or try again later.",
        }
      : undefined
  }
/>;
```

When `errorState` is present, the table renders an alert-style error card instead of the table.

## Row actions

```tsx
<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  rowActions={(student) => (
    <Button variant="ghost" size="sm" ariaLabel={`Open ${student.name}`}>
      Open
    </Button>
  )}
/>;
```

Use clear accessible labels for compact row actions.

## Density

Use `density` to control row spacing:

```tsx
<DataTable
  data={students}
  columns={columns}
  getRowId={(student) => student.id}
  density="compact"
/>;
```

Supported values are `comfortable` (default), `compact`, and `dense`.

## Virtualization

Virtualization is **opt-in**. The default `DataTable` renders every visible row so small and medium tables keep normal semantic table layout and browser find/accessibility behavior.

Use virtualization for long client-side row sets, typically 1,000+ rows:

```tsx
<DataTable
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  virtualization={{
    enabled: true,
    estimateRowHeight: 56,
    overscan: 8,
  }}
/>
```

### Options

| Option | Default | Purpose |
| --- | --- | --- |
| `enabled` | `false` | Turns virtual rendering on for non-loading, non-empty tables. |
| `estimateRowHeight` | Based on `density` (`56`, `48`, or `40`) | Estimated row height in pixels. Keep this close to the real row height for smooth scrolling. |
| `overscan` | `5` | Number of extra rows to render before and after the viewport. Increase for smoother fast scrolling; decrease for less DOM work. |
| `maxHeight` | `560` | Maximum scroll viewport height in pixels before the table body scrolls. |

### Supported behavior

- Selection continues to use stable IDs from `getRowId`.
- Sorting is applied before virtualization, so virtualized rows reflect the current sort order.
- Pagination can still be used; virtualization applies to the current page's rows.
- Loading, empty, and error states keep the standard non-virtual rendering path.

### Limitations

- Virtualization only renders the rows near the current scroll position. Browser find, automated queries, and screen readers may not see off-screen rows until they are scrolled into view.
- Use fixed or predictable row heights. Highly variable, expanding, or asynchronously resizing row content can reduce scroll accuracy unless `estimateRowHeight` is tuned carefully.
- Avoid row content that depends on measuring the full table body; most rows do not exist in the DOM at the same time.
- Sticky header behavior is scoped to the internal virtualized scroll container.
- For server-side datasets, combine `pagination` or external data loading with virtualization rather than passing an unbounded dataset to the client.

## Accessibility notes

- Provide `caption` or `aria-label` so the table has an accessible name.
- Use semantic column headers; avoid blank headers except for the built-in actions column.
- Provide `sortValue` when rendered cell text differs from the value users expect to sort by.
- Use stable `getRowId` values for selection, pagination, and virtualization.
- Keep row action labels specific, for example ``ariaLabel={`Open ${student.name}`}``.
- Prefer non-virtualized rendering for tables where screen reader access to every row is more important than rendering performance.
