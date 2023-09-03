import { ColumnDef } from "@tanstack/react-table";
export type Hospitalization = {
  id: number;
  complaint: string;
  status: string;
  created_at: any;
  updated_at: any;
  patient: {
    name: string;
    address: string;
    hostel: {
      name: string;
    };
  };
};

export const columns: ColumnDef<Hospitalization>[] = [
  {
    accessorKey: "index",
    header: "No",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
    enableHiding: true,
  },
  {
    accessorKey: "patient.name",
    id: "name",
    header: "Nama",
    cell: ({ row }) => {
      return <div>{row.original.patient.name}</div>;
    },
    enableHiding: true,
  },
  {
    accessorKey: "patient.address",
    header: "Alamat",
    cell: ({ row }) => {
      return row.original.patient.address.split(",")[0].trim();
    },
    enableHiding: true,
  },
  {
    accessorKey: "patient.hostel.name",
    header: "Asrama",
  },
  {
    accessorKey: "complaint",
    header: "Keluhan",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.status}</div>;
    },
    //@ts-ignore
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
];
