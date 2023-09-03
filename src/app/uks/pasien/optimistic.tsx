"use client";
import React, { useState } from "react";
import { usePatient } from "@/hooks/usePatient";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Plus } from "lucide-react";
import FormCheckup from "./form-checkup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { experimental_useOptimistic as useOptimistic } from "react";

export default function PatientOptimisticPage({data,hostels}:{data:any,hostels:any}) {
  const [open, setOpen] = useState(false);
  const [datasOptimistic, addDatasOptimistic] = useOptimistic(
    data,
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

  return (
    <div>
      <h1 className="text-center font-semibold text-2xl">Daftar Periksa UKS</h1>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-full bg-blue-400 w-12 h-12 text-white fixed bottom-[70px] right-[20px] shadow-lg transform active:scale-90 transition-transform"
      >
        <Plus />
      </button>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <DialogContent className="sm:max-w-[400px] max-h-[calc(100vh-10%)] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tambah Daftar Periksa</DialogTitle>
          </DialogHeader>
          <FormCheckup hostels={hostels} modalClose={() => setOpen(!open)} />
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={datasOptimistic}
      />
    </div>
  );
}
