# DataTable

`DataTable` renders typed, accessible table data with optional selection, sorting, pagination, and virtualization.

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
