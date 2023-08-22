import { ColumnDef } from "@tanstack/react-table";

// types.ts
// types.ts
export type Payment = {
  id: number;
  name: string;
  address: string;
  requirement: string;
  payment_source: string;
  payment_total: number | null;
  status: string | null;
  
  patient:{
  	name:string;
  	address: string;
  	hostel: {
    	id: number;
    	name: string;
  	}
  }
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "patient.name",
    header: "Nama",
  },
  {
    accessorKey: "patient.address",
    header: "Alamat",
  },
  {
    accessorKey: "patient.hostel.name", // Akses nested property dari objek hostel
    header: "Asrama",
  },
  {
    accessorKey: "requirement",
    header: "Keperluan",
  },
  {
    accessorKey: "payment_source",
    header: "Sumber",
  },
  {
    accessorKey: "payment_total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.original;
      return (
        <div>
          {total.payment_total
          //@ts-ignore
            ? parseInt(total.payment_total).toLocaleString("id-ID")
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
