"use client";

import { useState } from "react";
import { returnHospitalization } from "@/actions/hospitalization-action";
import { 
   ArrowDownIcon, 
   ArrowRightIcon, 
   ArrowUpIcon, 
   CheckCircledIcon, 
   CircleIcon, 
   CrossCircledIcon, 
   QuestionMarkCircledIcon, 
   StopwatchIcon, 
 } from "@radix-ui/react-icons"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
    getFacetedRowModel, 
   getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableFacetedFilter } from "./data-table-filter"
import { useHospitalization } from "@/hooks/useHospitalization";
import { useToast } from "@/components/ui/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAdd?: () => void;
  addOptimistic: (newData: any) => void;
  isLoading?: boolean;
  datasOptimistic: any;
}
type THospitalization = {
  id?: number;
  status?: string;
  return_at?: any;
  created_at?: any;
  selisih?: string;
};


export const statuses = [ 
   { 
     value: "inap", 
     label: "inap", 
     icon: QuestionMarkCircledIcon, 
   }, 
   { 
     value: "pulang", 
     label: "pulang", 
     icon: CircleIcon, 
   }
 ]
 
export default function DataTable<TData, TValue>({
  columns,
  data,
  onAdd,
  addOptimistic,
  datasOptimistic,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
		state: {
      columnFilters,
    },
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<THospitalization>({});
  const { toast } = useToast();
  const { updateHospitalization } = useHospitalization();
  const handleUpdate = async () => {
    //@ts-ignore
    const selisih = Math.floor((new Date() - new Date(deleteData.created_at)) / (1000 * 60 * 60 * 24)
    );

    /*
    await updateHospitalization({
      id: deleteData.id,
      status: "pulang",
      return_at: new Date().toISOString(),
      selisih: selisih,
    });
    setModalOpen(false);
    setDeleteData({});
    */
    const data = {
      id: deleteData.id,
      status: "pulang",
      return_at: new Date().toISOString(),
      selisih: selisih,
    };
    // Mencari objek dengan id 2
    const dataUpdate = datasOptimistic.find(
      (obj: any) => obj.id === deleteData.id
    );
    if (dataUpdate) {
      dataUpdate.status = "pulang";
    }
    //alert(JSON.stringify(dataUpdate,null,2))
    addOptimistic(dataUpdate);
    setModalOpen(false);
    //@ts-ignore
    await returnHospitalization(data);
    toast({
      title: "Data berhasil dirubah",
      //@ts-ignore
      description: "NAMA " + deleteData.patient.name,
    });
  };

  return (
    <div>
      
      <AlertDialog
        open={modalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
          {/*@ts-ignore*/}
          apakah <b>{deleteData?.patient?.name}</b> akan pulang ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleUpdate();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center py-4">
       
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
              {table.getColumn("status") && ( 
           <DataTableFacetedFilter 
             column={table.getColumn("status")} 
             title="Status" 
             options={statuses} 
           /> 
         )}

      </div>
      

      
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="even:bg-background odd:bg-accent py-2 focus:bg-slate-300"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="whitespace-nowrap select-none"
                      key={cell.id}
                    >
                      <ContextMenu>
                        <ContextMenuTrigger>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => {
                              //@ts-ignore
                              setDeleteData(row.original);
                              setModalOpen(true);
                            }}
                          >
                            Pulang
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
