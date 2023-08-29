"use client";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { SearchName } from "@/components/search-sidafa";
import { addCheckUp } from "@/actions/checkup-action";

const formSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().optional(),
  name: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
  hostelId: z.string(),
  requirement: z.string().min(2).max(50),
  paymentSource: z.string().min(2).max(50),
  paymentTotal: z.string().nullable(),
  pinjam: z.string().nullable(),
  payment: z.string().nullable(),
  description: z.string(),
});

export default function FormCheckup({
  modalClose,
  hostels,
}: {
  modalClose: () => void;
  hostels: any;
}) {
  const [pinjam, setPinjam] = useState(false);

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef(null);
  const { toast } = useToast();
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
      requirement: "",
      paymentSource: "",
      paymentTotal: null,
      pinjam: null,
      payment: null,
      description: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    // setIsSubmiting(true);
    // await createPatient(values);
    // form.reset();
    // modalClose();
    // setIsSubmiting(false);
    // toast({
    //   title: "Data berhasil ditambahkan",
    //   description: "NAMA " + values.name,
    // });

    values.patientId = uuidv4();
    values.id = uuidv4();
    console.log(JSON.stringify(values, null, 2));
    alert(JSON.stringify(values, null, 2));
    await addCheckUp(values);
  }

  useEffect(() => {
    // Function to close the autocomplete when clicking outside of it
    const handleOutsideClick = (event: any) => {
      if (
        autocompleteRef.current &&
        //@ts-ignore
        !autocompleteRef.current.contains(event.target)
      ) {
        setShowAutocomplete(false);
      }
    };

    // Attach the outside click event listener
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  console.log(hostels);
  return (
    <>
      <form
        id="addPatient"
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 py-4"
      >
        {/* {errors && (
          <p>{JSON.stringify(errors,null,2)}</p>
        )} */}

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
          <Label htmlFor="requirement" className="text-right">
            Keperluan
          </Label>
          <Input
            {...register("requirement")}
            placeholder="Keperluan"
            name="requirement"
            autoComplete="off"
            id="requirement"
            className="col-span-3"
          />
          {errors?.requirement && (
            <p className="col-start-2 col-span-3 text-xs text-red-500">
              {errors.requirement.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="paymentSource" className="text-right">
            Sumber
          </Label>
          <Input
            {...register("paymentSource")}
            placeholder="Sumber"
            name="paymentSource"
            autoComplete="off"
            id="paymentSource"
            className="col-span-3"
          />
          {errors?.paymentSource && (
            <p className="col-start-2 col-span-3 text-xs text-red-500">
              {errors.paymentSource.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="paymentTotal" className="text-right">
            Total
          </Label>
          <Input
            {...register("paymentTotal")}
            placeholder="Total"
            name="paymentTotal"
            autoComplete="off"
            id="paymentTotal"
            className="col-span-3"
          />
          {errors?.paymentTotal && (
            <p className="col-start-2 col-span-3 text-xs text-red-500">
              {errors.paymentTotal.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Keterangan
          </Label>
          <Input
            {...register("description")}
            placeholder="Keterangan"
            name="description"
            autoComplete="off"
            id="description"
            className="col-span-3"
          />
          {errors?.description && (
            <p className="col-start-2 col-span-3 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-start-2 col-span-3">
            <Checkbox
              id="payment-check"
              onCheckedChange={(checked) => {
                if (checked) {
                  setPinjam(true);
                } else {
                  setPinjam(false);
                }
              }}
            />
            <label
              htmlFor="payment-check"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Pinjam UKS
            </label>
          </div>
        </div>

        {pinjam && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pinjam" className="text-right">
              Pinjam
            </Label>
            <Input
              {...register("pinjam")}
              placeholder="Pinjam"
              name="pinjam"
              autoComplete="off"
              id="pinjam"
              className="col-span-3"
            />
            {errors?.pinjam && (
              <p className="col-start-2 col-span-3 text-xs text-red-500">
                {errors.pinjam.message}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="payment" className="text-right">
            Bayar
          </Label>
          <Input
            {...register("payment")}
            placeholder="Bayar"
            name="payment"
            autoComplete="off"
            id="payment"
            className="col-span-3"
          />
          {errors?.payment && (
            <p className="col-start-2 col-span-3 text-xs text-red-500">
              {errors.payment.message}
            </p>
          )}
        </div>

        <Button disabled={isSubmiting} form="addPatient" type="submit">
          Save changes
        </Button>
      </form>
    </>
  );
}
