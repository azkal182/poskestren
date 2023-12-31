"use client";
import React, { useState } from "react";
import { experimental_useOptimistic as useOptimistic } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import {columns } from "./columns";

import FormHospitalization from "./form-hospitalization";
import DataTable from "./data-table";
import * as XLSX from "xlsx";

export default function Optimistic({
  datas,
  hostels,
}: {
  datas: any;
  hostels: any;
}) {
  const [open, setOpen] = useState(false);
  const [datasOptimistic, addDatasOptimistic] = useOptimistic(
    datas,
    (state, newData) => {
      const updatedIndex = state.findIndex(
        //@ts-ignore
        (data: any) => data.id === newData.id,
      );

      if (updatedIndex !== -1) {
        const newState = [...state];
        newState[updatedIndex] = newData;

        return newState;
      }

      return [...state, newData];
    },
  );

  function formatDate(dateString: any) {
    const originalDate = new Date(dateString);

    const day = String(originalDate.getDate()).padStart(2, "0");
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const year = originalDate.getFullYear();

    return `${day}-${month}-${year}`;
  }
  const handleExportExcel = async () => {
    const rows = datasOptimistic?.map((item: any, index: number) => ({
      no: index + 1,
      nama: item.patient.name,
      alamat: item.patient.address,
      asrama: item.patient.hostel.name,
      keluhan: item.complaint,
      masuk: formatDate(item.created_at),
      pulang: formatDate(item.return_at),
      lama: item.selisih,
    }));
    //alert(JSON.stringify(rows))
    // create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      //@ts-ignore
      origin: "A4",
      skipHeader: false,
    });

    // Merge cells for the header title
    worksheet["A1"] = { t: "s", v: "Daftar Santri" }; // Change title as desired
    worksheet["A1"].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
    };
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
    worksheet["A2"] = { t: "s", v: "POSKESTREN AMTSILATI" }; // Change title as desired
    worksheet["A2"].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
    };
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data UKS");
    XLSX.writeFile(workbook, "DataUKS.xlsx", { compression: true });
  };

  return (
    <div>
      <h1 className="text-center font-semibold text-2xl">
        Daftar Rawat Inap UKS
      </h1>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-full bg-blue-400 w-12 h-12 text-white fixed bottom-[70px] right-[20px] shadow-lg transform active:scale-90 transition-transform"
      >
        <Plus />
      </button>

      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukan nama santri!</DialogTitle>
          </DialogHeader>
          <FormHospitalization
            hostels={hostels}
            modalClose={() => setOpen(!open)}
            //@ts-ignore
            addOptimistic={(data) => {
              addDatasOptimistic(data);
            }}
          />
        </DialogContent>
      </Dialog>
      {/*
      <Button onClick={handleExportExcel}>
      export Excel
      </Button>
      */}
      <div className="mt-2">
        <DataTable
          columns={columns}
          data={datasOptimistic}
          datasOptimistic={datasOptimistic}
          //@ts-ignore
          addOptimistic={(data) => {
            addDatasOptimistic(data);
          }}
          //@ts-ignore
          //onAdd={() => setOpen(true)}
          isLoading={false}
        />
      </div>
    </div>
  );
}
