"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
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
} from "@tanstack/react-table"
import * as yup from "yup"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const userSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  role: yup.string().oneOf(["Admin", "Manager", "Student", "Instructor"]).required(),
  status: yup.string().oneOf(["Active", "Inactive", "Suspended"]).required(),
  createdAt: yup.string().required(),
})

export type User = yup.InferType<typeof userSchema>

interface UserDataTableProps {
  data: User[]
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
  onAdd?: () => void
}

// STT column component
function STTCell({ index }: { index: number }) {
  return (
    <div className="flex items-center justify-center font-medium">
      {index + 1}
    </div>
  )
}

// Get status badge variant
const getStatusVariant = (status: User["status"]) => {
  switch (status) {
    case "Active":
      return "default"
    case "Inactive":
      return "secondary"
    case "Suspended":
      return "destructive"
    default:
      return "secondary"
  }
}

// Get role badge variant
const getRoleVariant = (role: User["role"]) => {
  switch (role) {
    case "Admin":
      return "destructive"
    case "Manager":
      return "default"
    case "Instructor":
      return "secondary"
    case "Student":
      return "outline"
    default:
      return "outline"
  }
}

function UserTableRow({ 
  row, 
  index,
  onEdit, 
  onDelete 
}: { 
  row: Row<User>
  index: number
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
}) {
  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "stt") {
          return (
            <TableCell key={cell.id}>
              <STTCell index={index} />
            </TableCell>
          )
        }
        if (cell.column.id === "actions") {
          return (
            <TableCell key={cell.id} className="text-right">
              <div className="flex justify-end space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(row.original)}
                  className="h-8 w-8 p-0"
                >
                  <IconPencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(row.original.id)}
                  className="h-8 w-8 p-0"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          )
        }
        return (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export function UserDataTable({ data: initialData, onEdit, onDelete, onAdd }: UserDataTableProps) {
  const [data, setData] = React.useState(() => initialData)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const columns: ColumnDef<User>[] = React.useMemo(() => [
    {
      id: "stt",
      header: () => <div className="text-center">STT</div>,
      cell: () => null, // This will be handled in UserTableRow
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Họ tên",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
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
      cell: ({ row }) => (
        <div>{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => (
        <Badge variant={getRoleVariant(row.original.role)}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <div>{row.original.createdAt}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: () => null, // This will be handled in DraggableRow
      enableSorting: false,
      enableHiding: false,
    },
  ], [])

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
  })

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
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <UserTableRow 
                    key={row.id} 
                    row={row}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
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
                  table.setPageSize(Number(value))
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
  )
}
