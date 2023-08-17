"use client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePatient } from "@/hooks/usePatient";
import { useHostel } from "@/hooks/useHostel";
import { Payment, columns } from "./columns";
import { DataTable } from "@/components/dataTable";
import { Checkbox } from "@/components/ui/checkbox";

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
  totalPayment: z.number().nullable(),
  pinjam: z.number().nullable(),
  payment: z.number().nullable(),
  description: z.string(),
});

export default function PatientPage() {
  const [open, setOpen] = useState(false);
  const [pinjam, setPinjam] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      address: "",
      requirement: "",
      paymentSource: "",
      totalPayment: null,
      pinjam: null,
      payment: null,
      description: "",
    },
  });

  const { data, error, createPatient, updatePatient, deletePatient } =
    usePatient();
  const { data: hostels } = useHostel();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    
    
    await createPatient(values);
    form.reset();
    setOpen(false);
    toast({
      title: "Data berhasil ditambahkan",
      description: "NAMA " + values.name,
    });
  }

  if (error) return <div>Error fetching data</div>;
  if (!data || !hostels) return <div>Loading...</div>;

  console.log({ hostels });
  return (
    <div>
      <h1 className="text-center font-semibold text-2xl">Daftar Periksa UKS</h1>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent className="sm:max-w-[400px] max-h-[calc(100vh-10%)] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tambah Pasien</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="addPatient"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Nama</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="Nama"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Alamat</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="Alamat"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hostelId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Asrama</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="col-span-3">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Asrama" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hostels?.data?.map((item: any) => (
                            <SelectItem
                              value={item.id.toString()}
                              key={item.id}
                              className="uppercase"
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirement"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Keperluan</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="Keperluan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentSource"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Sumber</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="Sumber"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalPayment"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Total</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input
                          className="col-span-3"
                          type="number"
                          placeholder="0"
                          {...field}
                          //@ts-ignore
                          value={field.value === "" ? null : field.value}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            field.onChange(
                              inputValue === ""
                                ? null
                                : parseInt(inputValue, 10)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-3 col-start-2 flex items-center space-x-2">
                  <Checkbox
                    checked={pinjam}
                    onCheckedChange={() => setPinjam(!pinjam)}
                    id="pinjam"
                  />
                  <label
                    htmlFor="pinjam"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Pinjam UKS
                  </label>
                </div>
              </div>

              {pinjam && (
                <FormField
                  control={form.control}
                  name="pinjam"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Pinjam</FormLabel>
                        <FormControl>
                          {/*
                <Input className="col-span-3" type="number" placeholder="0" {...field} value={field.value}/>
                */}
                          <Input
                            className="col-span-3"
                            type="number"
                            placeholder="0"
                            {...field}
                            //@ts-ignore
                            value={field.value === "" ? null : field.value}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              field.onChange(
                                inputValue === ""
                                  ? null
                                  : parseInt(inputValue, 10)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage className="col-start-2 col-span-3" />
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Keterangan</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="keterangan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Bayar</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          type="number"
                          placeholder="0"
                          {...field}
                          //@ts-ignore
                          value={field.value === "" ? null : field.value}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            field.onChange(
                              inputValue === ""
                                ? null
                                : parseInt(inputValue, 10)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button form="addPatient" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={data.data}
        //@ts-ignore
        onAdd={() => setOpen(true)}
      />
    </div>
  );
}
