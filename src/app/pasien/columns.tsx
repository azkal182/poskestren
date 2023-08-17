import { ColumnDef } from "@tanstack/react-table";

// types.ts
// types.ts
export type Payment = {
  id: number;
  name: string;
  address: string;
  requirement: string;
  paymentSource: string;
  totalPayment: number | null;
  paymentStatus: string | null;
  hostelId: number;
  hostel: {
    id: number;
    name: string;
  };
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "address",
    header: "Alamat",
  },
  {
    accessorKey: "hostel.name", // Akses nested property dari objek hostel
    header: "Hostel",
  },
  {
    accessorKey: "requirement",
    header: "Keperluan",
  },
  {
    accessorKey: "paymentSource",
    header: "Sumber",
  },
  {
    accessorKey: "totalPayment",
    header: "Total",
    cell: ({ row }) => {
      const total = row.original;
      return (
        <div>
          {total.totalPayment
          //@ts-ignore
            ? parseInt(total.totalPayment).toLocaleString("id-ID")
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
  },
];
