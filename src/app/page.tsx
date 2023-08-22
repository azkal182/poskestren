"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {Hospitalization, columns} from "./columns"

import FormHospitalization from "./form-hospitalization"
import DataTable from "./data-table"
import * as XLSX from "xlsx";
import { useHospitalization } from "@/hooks/useHospitalization";






export default function Home() {
  const [open, setOpen] = useState(false);
  const {
    data,
    createHospitalization,
    updateHospitalization,
    deleteHospitalization,
  } = useHospitalization();
  
  function formatDate(dateString:any) {
  const originalDate = new Date(dateString);
  
  const day = String(originalDate.getDate()).padStart(2, "0");
  const month = String(originalDate.getMonth() + 1).padStart(2, "0");
  const year = originalDate.getFullYear();
  
  return `${day}-${month}-${year}`;

}
  const handleExportExcel = async ()=>{
  	const rows = data?.data?.map((item:any,index:number) => ({
  		no: index,
      nama: item.patient.name,
      alamat: item.patient.address,
      asrama: item.patient.hostel.name,
      keluhan : item.complaint,
      masuk: formatDate(item.created_at),
      pulang: formatDate(item.return_at),
      lama : item.selisih,
      
      
    }));
  	//alert(JSON.stringify(rows))
  	// create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    //@ts-ignore
    const worksheet = XLSX.utils.json_to_sheet(rows, {origin:"A4", skipHeader:false});

  // Merge cells for the header title
  worksheet["A1"] = { t: "s", v: "Daftar Santri" }; // Change title as desired
  worksheet["A1"].s = { font: { bold: true }, alignment: { horizontal: "center" , vertical:"center"} };
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
  worksheet["A2"] = { t: "s", v: "POSKESTREN AMTSILATI" }; // Change title as desired
  worksheet["A2"].s = { font: { bold: true }, alignment: { horizontal: "center" , vertical:"center"} };
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];


    XLSX.utils.book_append_sheet(workbook, worksheet, "Data UKS");
    XLSX.writeFile(workbook, "DataUKS.xlsx", { compression: true });


  }

  /*
  if (error) return <div>Error fetching data</div>;

  if (!hostels && !data) return <div>Loading...</div>;
  */
  
  return (
    <div>
      <h1 className="text-center font-semibold text-2xl">
        Daftar Rawat Inap UKS
      </h1>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-full bg-blue-400 w-12 h-12 text-white fixed bottom-[70px] right-[20px]"
      >
        <Plus />
      </button>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukan nama santri!</DialogTitle>
          </DialogHeader>
          <FormHospitalization modalClose={() => setOpen(!open)}/>
          <DialogFooter>
            <Button form="addHospitalization" type="submit">
              Save data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button onClick={handleExportExcel}>
      export Excel
      </Button>
<div className="mt-2">
      <DataTable
        columns={columns}
        data={data?.data}
        //@ts-ignore
        //onAdd={() => setOpen(true)}
        isLoading={data ? false : true}
      />
      
    </div>
    </div>
  );
}

