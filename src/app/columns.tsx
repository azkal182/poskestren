import {
  ColumnDef
} from "@tanstack/react-table";
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
    header: 'No',
    accessorKey: 'id',
    Cell: ({ row, flatRows }) => {
      return flatRows.indexOf(row) + 1;
    },
  },
  {
    accessorKey: "patient.name",
    header: "Nama",
    cell: ({ row }) => {
      return <div>{row.original.patient.name}</div>;
    },
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
  },
];
