import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
  type DataTableRowId,
  type DataTableSort,
} from "./DataTable";

type Student = {
  id: string;
  name: string;
  grade: number;
  house: string;
};

const students: Student[] = [
  { id: "student-2", name: "Zara", grade: 9, house: "Austen" },
  { id: "student-1", name: "Amir", grade: 7, house: "Brontë" },
  { id: "student-3", name: "Mina", grade: 11, house: "Curie" },
];

const manyStudents: Student[] = Array.from({ length: 1_000 }, (_, index) => ({
  id: `student-${String(index + 1).padStart(4, "0")}`,
  name: `Student ${String(1_000 - index).padStart(4, "0")}`,
  grade: 6 + (index % 7),
  house: ["Austen", "Brontë", "Curie", "Darwin"][index % 4],
}));

const columns: DataTableColumn<Student>[] = [
  {
    id: "name",
    header: "Name",
    cell: (student) => student.name,
    sortable: true,
    sortValue: (student) => student.name,
  },
  {
    id: "grade",
    header: "Grade",
    cell: (student) => student.grade,
    sortable: true,
    sortValue: (student) => student.grade,
  },
  {
    id: "house",
    header: "House",
    cell: (student) => student.house,
  },
];

function renderStudentTable(props: Partial<DataTableProps<Student>> = {}) {
  return render(
    <DataTable
      aria-label="Students"
      data={students}
      columns={columns}
      getRowId={(student) => student.id}
      {...props}
    />
  );
}

function rowText(row: HTMLElement) {
  return within(row)
    .getAllByRole("cell")
    .map((cell) => cell.textContent)
    .join(" ");
}

describe("DataTable", () => {
  it("renders typed columns with accessible table markup", () => {
    renderStudentTable({ caption: "Student roster" });

    expect(screen.getByRole("table", { name: "Students" })).toBeInTheDocument();
    expect(screen.getByText("Student roster")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /grade/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Zara" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "7" })).toBeInTheDocument();
  });

  it("uses getRowId for stable row identity", () => {
    renderStudentTable();

    expect(
      screen.getByRole("cell", { name: "Amir" }).closest("tr")
    ).toHaveAttribute("data-row-id", "student-1");
  });

  it("sorts uncontrolled columns and exposes aria-sort", async () => {
    const user = userEvent.setup();
    renderStudentTable();

    await user.click(screen.getByRole("button", { name: /name/i }));

    const bodyRows = screen.getAllByRole("row").slice(1);
    expect(rowText(bodyRows[0])).toContain("Amir");
    expect(rowText(bodyRows[1])).toContain("Mina");
    expect(rowText(bodyRows[2])).toContain("Zara");
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );

    await user.click(screen.getByRole("button", { name: /name/i }));
    expect(rowText(screen.getAllByRole("row")[1])).toContain("Zara");
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "descending"
    );
  });

  it("supports controlled sorting callbacks", async () => {
    const user = userEvent.setup();
    const onSortByChange = vi.fn();

    function ControlledSortTable() {
      const [sortBy, setSortBy] = useState<DataTableSort | undefined>();
      return (
        <DataTable
          aria-label="Students"
          data={students}
          columns={columns}
          getRowId={(student) => student.id}
          sorting={{
            sortBy,
            onSortByChange: (nextSortBy) => {
              onSortByChange(nextSortBy);
              setSortBy(nextSortBy);
            },
          }}
        />
      );
    }

    render(<ControlledSortTable />);

    await user.click(screen.getByRole("button", { name: /grade/i }));

    expect(onSortByChange).toHaveBeenCalledWith({
      columnId: "grade",
      direction: "asc",
    });
    expect(rowText(screen.getAllByRole("row")[1])).toContain("Amir");
  });

  it("supports row selection and select-all for visible rows", async () => {
    const user = userEvent.setup();
    const onSelectedRowIdsChange = vi.fn();

    function ControlledSelectionTable() {
      const [selectedRowIds, setSelectedRowIds] = useState<DataTableRowId[]>(
        []
      );
      return (
        <DataTable
          aria-label="Students"
          data={students}
          columns={columns}
          getRowId={(student) => student.id}
          selection={{
            selectedRowIds,
            onSelectedRowIdsChange: (nextSelectedRowIds) => {
              onSelectedRowIdsChange(nextSelectedRowIds);
              setSelectedRowIds(nextSelectedRowIds);
            },
          }}
        />
      );
    }

    render(<ControlledSelectionTable />);

    await user.click(screen.getByRole("checkbox", { name: "Select row 2" }));
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith(["student-1"]);
    expect(
      screen.getByRole("cell", { name: "Amir" }).closest("tr")
    ).toHaveAttribute("aria-selected", "true");

    await user.click(
      screen.getByRole("checkbox", { name: "Select all visible rows" })
    );
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith([
      "student-1",
      "student-2",
      "student-3",
    ]);
  });

  it("renders loading, empty, and error states", () => {
    const { rerender } = render(
      <DataTable
        aria-label="Students"
        data={[]}
        columns={columns}
        getRowId={(student) => student.id}
        loading
      />
    );

    expect(screen.getByRole("table", { name: "Students" })).toHaveAttribute(
      "aria-busy",
      "true"
    );

    rerender(
      <DataTable
        aria-label="Students"
        data={[]}
        columns={columns}
        getRowId={(student) => student.id}
        emptyState={{
          title: "No students",
          description: "Add a student to begin.",
        }}
      />
    );
    expect(screen.getByText("No students")).toBeInTheDocument();
    expect(screen.getByText("Add a student to begin.")).toBeInTheDocument();

    rerender(
      <DataTable
        aria-label="Students"
        data={students}
        columns={columns}
        getRowId={(student) => student.id}
        errorState={{
          title: "Could not load students",
          description: "Try again.",
        }}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load students"
    );
  });

  it("supports optional pagination and page-size changes", async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();

    renderStudentTable({
      pagination: {
        pageSize: 2,
        pageSizeOptions: [2, 3],
        onPageSizeChange,
      },
    });

    expect(screen.getByText("Page 1 of 2 · 3 rows")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Zara" })).toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: "Mina" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 2 · 3 rows")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Mina" })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Rows per page"), "3");
    expect(onPageSizeChange).toHaveBeenCalledWith(3);
  });

  it("virtualizes 1,000+ rows only when explicitly enabled", () => {
    const { rerender } = renderStudentTable({ data: manyStudents });

    expect(
      screen.getByRole("cell", { name: "Student 1000" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Student 0001" })
    ).toBeInTheDocument();

    rerender(
      <DataTable
        aria-label="Students"
        data={manyStudents}
        columns={columns}
        getRowId={(student) => student.id}
        virtualization={{
          enabled: true,
          estimateRowHeight: 56,
          overscan: 8,
        }}
      />
    );

    expect(
      screen.getByRole("cell", { name: "Student 1000" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: "Student 0001" })
    ).not.toBeInTheDocument();
  });

  it("supports selection in virtualized tables", async () => {
    const user = userEvent.setup();
    const onSelectedRowIdsChange = vi.fn();

    function VirtualizedSelectionTable() {
      const [selectedRowIds, setSelectedRowIds] = useState<DataTableRowId[]>(
        []
      );
      return (
        <DataTable
          aria-label="Students"
          data={manyStudents}
          columns={columns}
          getRowId={(student) => student.id}
          selection={{
            selectedRowIds,
            onSelectedRowIdsChange: (nextSelectedRowIds) => {
              onSelectedRowIdsChange(nextSelectedRowIds);
              setSelectedRowIds(nextSelectedRowIds);
            },
          }}
          virtualization={{ enabled: true, estimateRowHeight: 56, overscan: 8 }}
        />
      );
    }

    render(<VirtualizedSelectionTable />);

    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }));

    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith(["student-0001"]);
    expect(
      screen.getByRole("cell", { name: "Student 1000" }).closest("tr")
    ).toHaveAttribute("aria-selected", "true");
  });

  it("supports sorting in virtualized tables", async () => {
    const user = userEvent.setup();

    renderStudentTable({
      data: manyStudents,
      virtualization: { enabled: true, estimateRowHeight: 56, overscan: 8 },
    });

    expect(
      screen.getByRole("cell", { name: "Student 1000" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /name/i }));

    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    expect(
      screen.getByRole("cell", { name: "Student 0001" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: "Student 1000" })
    ).not.toBeInTheDocument();
  });

  it("keeps loading, empty, and error states working when virtualization is enabled", () => {
    const { rerender } = render(
      <DataTable
        aria-label="Students"
        data={[]}
        columns={columns}
        getRowId={(student) => student.id}
        loading
        virtualization={{ enabled: true }}
      />
    );

    expect(screen.getByRole("table", { name: "Students" })).toHaveAttribute(
      "aria-busy",
      "true"
    );

    rerender(
      <DataTable
        aria-label="Students"
        data={[]}
        columns={columns}
        getRowId={(student) => student.id}
        emptyState={{
          title: "No students",
          description: "Add a student to begin.",
        }}
        virtualization={{ enabled: true }}
      />
    );
    expect(screen.getByText("No students")).toBeInTheDocument();

    rerender(
      <DataTable
        aria-label="Students"
        data={manyStudents}
        columns={columns}
        getRowId={(student) => student.id}
        errorState={{
          title: "Could not load students",
          description: "Try again.",
        }}
        virtualization={{ enabled: true }}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load students"
    );
  });
});
