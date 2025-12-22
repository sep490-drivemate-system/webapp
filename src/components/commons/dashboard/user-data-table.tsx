"use client";

import * as React from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Ban, CheckCircle2, Eye, MoreHorizontal } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as yup from "yup";

import { Badge } from "@/components/ui/badge";
import { IUserManagement } from "@/types/user/manage-user.type";
import { UserRole } from "@/types/auth/user-role.enum";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Using IUserManagement interface from types
export type User = IUserManagement;

interface UserDataTableProps {
  data: User[];
  onView?: (user: User) => void;
  onToggleBlock?: (user: User) => void;
}

// STT column component
function STTCell({ index }: { index: number }) {
  return (
    <div className="flex items-center justify-center font-medium">
      {index + 1}
    </div>
  );
}

// Get status badge variant and className
const getStatusVariant = (status: User["status"]) => {
  switch (status) {
    case "Active":
      return "default";
    case "Inactive":
      return "secondary";
    case "Suspended":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusClassName = (status: User["status"]): string => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
    case "Inactive":
      return "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200";
    case "Suspended":
      return "bg-red-50 text-red-700 hover:bg-red-100 border-red-200";
    default:
      return "";
  }
};

// Get role badge variant and className
const getRoleVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin:
      return "destructive";
    case UserRole.Inspector:
      return "default";
    case UserRole.Instructor:
      return "secondary";
    case UserRole.NoviceDriver:
      return "outline";
    default:
      return "outline";
  }
};

const getRoleClassName = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200";
    case UserRole.Inspector:
      return "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200";
    case UserRole.Instructor:
      return "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
    case UserRole.NoviceDriver:
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
    default:
      return "";
  }
};

// Convert role to Vietnamese
const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return "Quản trị viên";
    case UserRole.Inspector:
      return "Người kiểm duyệt";
    case UserRole.Instructor:
      return "Người hướng dẫn";
    case UserRole.NoviceDriver:
      return "Người lái mới";
    default:
      return UserRole[role] || "Không xác định";
  }
};

// Convert status to Vietnamese
const getStatusLabel = (status: User["status"]): string => {
  switch (status) {
    case "Active":
      return "Hoạt động";
    case "Inactive":
      return "Ngừng hoạt động";
    case "Suspended":
      return "Bị đình chỉ";
    default:
      return status;
  }
};

function UserTableRow({
  row,
  index,
  onView,
  onToggleBlock,
}: {
  row: Row<User>;
  index: number;
  onView?: (user: User) => void;
  onToggleBlock?: (user: User) => void;
}) {
  const isBlocked = row.original.status === "Suspended";

  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "stt") {
          return (
            <TableCell key={cell.id}>
              <STTCell index={index} />
            </TableCell>
          );
        }
        if (cell.column.id === "actions") {
          return (
            <TableCell key={cell.id} className="text-right">
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Thao tác">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onView?.(row.original)}>
                      <Eye className="mr-2 size-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => onToggleBlock?.(row.original)}
                      className={isBlocked ? "text-emerald-600" : "text-red-600"}
                    >
                      {isBlocked ? (
                        <>
                          <CheckCircle2 className="mr-2 size-4" />
                          Bỏ chặn người dùng
                        </>
                      ) : (
                        <>
                          <Ban className="mr-2 size-4" />
                          Chặn người dùng
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          );
        }
        return (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function UserDataTable({
  data: initialData,
  onView,
  onToggleBlock,
}: UserDataTableProps) {
  const [data, setData] = React.useState(() => initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        id: "stt",
        header: () => <div className="text-center">STT</div>,
        cell: () => null, // This will be handled in UserTableRow
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "userName",
        header: "Họ tên",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.userName}</div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-muted-foreground">{row.original.email}</div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Số điện thoại",
        cell: ({ row }) => <div>{row.original.phone}</div>,
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        cell: ({ row }) => (
          <Badge
            variant={getRoleVariant(row.original.role)}
            className={getRoleClassName(row.original.role)}
          >
            {getRoleLabel(row.original.role)}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge
            variant={getStatusVariant(row.original.status)}
            className={getStatusClassName(row.original.status)}
          >
            {getStatusLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Thao tác</div>,
        cell: () => null, // This will be handled in UserTableRow
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row, index) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      index={index}
                      onView={onView}
                      onToggleBlock={onToggleBlock}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <div className="text-muted-foreground hidden flex-1 text-xs sm:text-sm lg:flex">
            Hiển thị {table.getRowModel().rows.length} trong{" "}
            {table.getFilteredRowModel().rows.length} kết quả.
          </div>
          <div className="flex w-full items-center justify-center sm:justify-end gap-4 sm:gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Số hàng mỗi trang
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-xs sm:text-sm font-medium">
              Trang {table.getState().pagination.pageIndex + 1} trong{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                className="hidden h-7 w-7 sm:h-8 sm:w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft className="size-3 sm:size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-7 sm:size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft className="size-3 sm:size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-7 sm:size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight className="size-3 sm:size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-7 sm:size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight className="size-3 sm:size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
