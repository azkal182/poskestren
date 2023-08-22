"use client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import { usePatient } from "@/hooks/usePatient";
import { useHostel } from "@/hooks/useHostel";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import FormCheckup from "./form-checkup"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
  hostelId: z.string(),
  requirement: z.string().min(2).max(50),
  paymentSource: z.string().min(2).max(50),
  paymentTotal: z.number().nullable(),
  pinjam: z.number().nullable(),
  payment: z.number().nullable(),
  description: z.string(),
});

export default function PatientPage() {
  const [open, setOpen] = useState(false);
  const { data, error, createPatient, updatePatient, deletePatient } =
    usePatient();
    
    

  if (error) return <div>Error fetching data</div>;
  {/*
  if (!data || !hostels) return <div>Loading...</div>;
*/}
  
  return (
    <div>
      <h1 className="text-center font-semibold text-2xl">Daftar Periksa UKS</h1>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-full bg-blue-400 w-12 h-12 text-white fixed bottom-[70px] right-[20px]"
      >
        <Plus />
      </button>
      <Dialog open={open} onOpenChange={() =>{
       setOpen(!open)
      	//setResults([]);
      	//form.reset()
      }}>
        <DialogContent className="sm:max-w-[400px] max-h-[calc(100vh-10%)] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tambah Daftar Periksa</DialogTitle>
          </DialogHeader>
					<FormCheckup modalClose={()=>setOpen(!open)}/>

          <DialogFooter>
            <Button form="addPatient" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={data?.data }
        //@ts-ignore
				
        isLoading={data ? false:true}
      />
      
    </div>
  );
}
