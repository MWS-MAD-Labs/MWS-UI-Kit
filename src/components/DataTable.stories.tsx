import { useMemo, useState } from "react";
import { Badge, Button } from "./UIPrimitives";
import {
  DataTable,
  type DataTableColumn,
  type DataTableRowId,
  type DataTableSort,
} from "./DataTable";

type Student = {
  id: string;
  name: string;
  grade: number;
  house: "Austen" | "Brontë" | "Curie" | "Darwin";
  attendance: number;
  status: "Active" | "Needs support" | "Alumni";
};

const students: Student[] = [
  {
    id: "stu-001",
    name: "Amir Khan",
    grade: 7,
    house: "Brontë",
    attendance: 96,
    status: "Active",
  },
  {
    id: "stu-002",
    name: "Mina Patel",
    grade: 11,
    house: "Curie",
    attendance: 91,
    status: "Needs support",
  },
  {
    id: "stu-003",
    name: "Zara Ali",
    grade: 9,
    house: "Austen",
    attendance: 98,
    status: "Active",
  },
  {
    id: "stu-004",
    name: "Noah Wright",
    grade: 12,
    house: "Darwin",
    attendance: 88,
    status: "Alumni",
  },
  {
    id: "stu-005",
    name: "Eleanor Brooks",
    grade: 8,
    house: "Curie",
    attendance: 93,
    status: "Active",
  },
];

const houses: Student["house"][] = ["Austen", "Brontë", "Curie", "Darwin"];
const statuses: Student["status"][] = ["Active", "Needs support", "Alumni"];

const manyStudents: Student[] = Array.from({ length: 1_000 }, (_, index) => ({
  id: `stu-${String(index + 1).padStart(4, "0")}`,
  name: `Student ${String(index + 1).padStart(4, "0")}`,
  grade: 6 + (index % 7),
  house: houses[index % houses.length],
  attendance: 82 + (index % 19),
  status: statuses[index % statuses.length],
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
    align: "right",
  },
  {
    id: "house",
    header: "House",
    cell: (student) => student.house,
  },
  {
    id: "attendance",
    header: "Attendance",
    cell: (student) => `${student.attendance}%`,
    sortable: true,
    sortValue: (student) => student.attendance,
    align: "right",
  },
  {
    id: "status",
    header: "Status",
    cell: (student) => (
      <Badge
        tone={
          student.status === "Needs support"
            ? "warning"
            : student.status === "Alumni"
            ? "neutral"
            : "success"
        }
      >
        {student.status}
      </Badge>
    ),
  },
];

export default {
  title: "Components/DataTable",
  component: DataTable,
};

export function Basic() {
  return (
    <div className="bg-surface-base p-6">
      <DataTable
        aria-label="Students"
        caption="Student roster"
        data={students}
        columns={columns}
        getRowId={(student) => student.id}
      />
    </div>
  );
}

export function ControlledSelectionAndSorting() {
  const [selectedRowIds, setSelectedRowIds] = useState<DataTableRowId[]>([
    "stu-002",
  ]);
  const [sortBy, setSortBy] = useState<DataTableSort | undefined>({
    columnId: "name",
    direction: "asc",
  });

  return (
    <div className="grid gap-4 bg-surface-base p-6">
      <p className="text-sm text-secondary">
        Selected rows:{" "}
        {selectedRowIds.length ? selectedRowIds.join(", ") : "None"}
      </p>
      <DataTable
        aria-label="Selectable students"
        data={students}
        columns={columns}
        getRowId={(student) => student.id}
        selection={{
          selectedRowIds,
          onSelectedRowIdsChange: setSelectedRowIds,
        }}
        sorting={{
          sortBy,
          onSortByChange: setSortBy,
        }}
      />
    </div>
  );
}

export function Loading() {
  return (
    <div className="bg-surface-base p-6">
      <DataTable
        aria-label="Loading students"
        data={[]}
        columns={columns}
        getRowId={(student) => student.id}
        loading
      />
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="bg-surface-base p-6">
      <DataTable
        aria-label="Empty students"
        data={[]}
        columns={columns}
        getRowId={(student) => student.id}
        emptyState={{
          title: "No students found",
          description: "Try widening your filters or add a new student record.",
          action: <Button>Add student</Button>,
        }}
      />
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="bg-surface-base p-6">
      <DataTable
        aria-label="Students error"
        data={students}
        columns={columns}
        getRowId={(student) => student.id}
        errorState={{
          title: "Students could not be loaded",
          description:
            "Refresh the page or contact support if this keeps happening.",
          action: <Button variant="outline">Retry</Button>,
        }}
      />
    </div>
  );
}

export function Paginated() {
  const [pageSize, setPageSize] = useState(2);
  const [pageIndex, setPageIndex] = useState(0);

  const pageSizeOptions = useMemo(() => [2, 3, 5], []);

  return (
    <div className="bg-surface-base p-6">
      <DataTable
        aria-label="Paginated students"
        data={students}
        columns={columns}
        getRowId={(student) => student.id}
        pagination={{
          pageIndex,
          pageSize,
          pageSizeOptions,
          onPageIndexChange: setPageIndex,
          onPageSizeChange: (nextPageSize) => {
            setPageSize(nextPageSize);
            setPageIndex(0);
          },
        }}
      />
    </div>
  );
}

export function Virtualized() {
  const [selectedRowIds, setSelectedRowIds] = useState<DataTableRowId[]>([]);
  const [sortBy, setSortBy] = useState<DataTableSort | undefined>({
    columnId: "name",
    direction: "asc",
  });

  return (
    <div className="grid gap-4 bg-surface-base p-6">
      <p className="text-sm text-secondary">
        Virtualized rendering is opt-in and intended for long, fixed-height row
        lists.
      </p>
      <DataTable
        aria-label="Virtualized students"
        data={manyStudents}
        columns={columns}
        getRowId={(student) => student.id}
        selection={{
          selectedRowIds,
          onSelectedRowIdsChange: setSelectedRowIds,
        }}
        sorting={{
          sortBy,
          onSortByChange: setSortBy,
        }}
        virtualization={{
          enabled: true,
          estimateRowHeight: 56,
          overscan: 8,
        }}
      />
    </div>
  );
}
