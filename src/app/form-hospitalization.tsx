"use client";
import { addHospitalization } from "@/actions/hospitalization-action";
import { useState, useEffect, useRef } from "react";
import { SearchName } from "@/components/search-sidafa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useHospitalization } from "@/hooks/useHospitalization";
import { useHostel } from "@/hooks/useHostel";
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

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface HospitalizationFormData {
  id: string;
  patientId: string;
  name: string;
  address: string;
  hostelId: number;
  complaint: string;
}
export const formSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
  hostelId: z.string().min(2),
  complaint: z.string().min(2).max(50),
});

export default function FormHospitalization({
  modalClose,
  addOptimistic,
  hostels,
}: {
  modalClose: () => void;
  addOptimistic: () => void;
  hostels: any;
}) {
  const [loading, setLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      hostelId: "",
      complaint: "",
    },
  });

  const addTest = async (FormData: HospitalizationFormData) => {
    const patientId = uuidv4();
    const id = uuidv4();
    const hostel = hostels.filter(
      (data: any) => data.id === FormData.hostelId,
    )[0];
    FormData.patientId = patientId;

    const data = {
      id: id,
      patientId: patientId,
      complaint: FormData.complaint,
      status: "inap",
      patient: {
        id: patientId,
        name: FormData.name,
        address: FormData.address,
        hostelId: hostel.id,
        hostel: hostel,
      },
    };
    //@ts-ignore
    addOptimistic(data);
    modalClose();
    //@ts-ignore
    await addHospitalization({
      ...FormData,
      patientId,
      id,
      hostelId: hostel.id,
    });
    toast({
      title: "Data berhasil ditambahkan",

      description: "NAMA " + FormData.name,
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        autocompleteRef.current &&
        //@ts-ignore
        !autocompleteRef.current.contains(event.target)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <form
        //@ts-ignore
        onSubmit={handleSubmit(addTest)}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Name
            </Label>
            <SearchName
              {...register("name")}
              placeholder="Nama"
              autoComplete="off"
              id="name"
              name="name"
              className="col-span-3"
              selected={(data: any) => {
                setValue("name", data.name);
                setValue("address", data.address);
              }}
            />
            {errors?.name && (
              <p className="col-start-2 col-span-3 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Alamat
            </Label>
            <Input
              {...register("address")}
              placeholder="Alamat"
              name="address"
              autoComplete="off"
              id="address"
              className="col-span-3"
            />
            {errors?.address && (
              <p className="col-start-2 col-span-3 text-xs text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Asrama
            </Label>
            <Select
              {...register("hostelId")}
              onValueChange={(selectedValue) => {
                setValue("hostelId", selectedValue);
              }}
              name="hostelId"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a Hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels?.map((item: any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.hostelId && (
              <p className="col-start-2 col-span-3 text-xs text-red-500">
                {errors.hostelId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="complaint" className="text-right">
              Keluhan
            </Label>
            <Input
              {...register("complaint")}
              placeholder="Keluhan"
              name="complaint"
              id="complaint"
              className="col-span-3"
            />
            {errors?.complaint && (
              <p className="col-start-2 col-span-3 text-xs text-red-500">
                {errors.complaint.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit">Save Data</Button>
      </form>
    </>
  );
}
