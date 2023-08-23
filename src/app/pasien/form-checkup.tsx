"use client";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { usePatient } from "@/hooks/usePatient";
import { useHostel } from "@/hooks/useHostel";

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

export default function FormCheckup({
  modalClose,
}: {
  modalClose: () => void;
}) {
  const [pinjam, setPinjam] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
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

  const { data, error, createPatient, updatePatient, deletePatient } =
    usePatient();
  const { data: hostels } = useHostel();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setIsSubmiting(true);
    await createPatient(values);
    form.reset();
    modalClose();
    setIsSubmiting(false);
    toast({
      title: "Data berhasil ditambahkan",
      description: "NAMA " + values.name,
    });
  }

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    console.log(searchQuery);
    if (searchQuery.length <= 2) {
      setLoading(false);
      return setResults([]);
    }
    setLoading(true);

    try {
      const response = await axios.get(`/api/sidafa?query=${searchQuery}`);
      if (response.data.data.length > 0) {
        setResults(response.data.data);
        setShowAutocomplete(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
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
              <div className="" ref={autocompleteRef}>
                <div className="relative grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleSearch(e.target.value);
                      }}
                      placeholder="Name"
                      className="col-span-3"
                      onFocus={() => {
                        if (results.length > 0) {
                          setShowAutocomplete(true);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                  {loading && (
                    <Loader className="w-4 h-4 absolute right-4 animate-spin top-2" />
                  )}
                </div>
                {showAutocomplete && (
                  <ul
                    className={`${
                      !loading ? (results.length > 0 ? "block" : "hidden") : ""
                    } mt-2 z-50 left-4 right-4 border absolute bg-background max-h-40 overflow-auto`}
                  >
                    {loading ? (
                      <li className="p-2">Loading...</li>
                    ) : (
                      results.map((result: any) => (
                        <li
                          key={result.accountNumber}
                          className="p-2 cursor-pointer hover:bg-accent"
                          onClick={() => {
                            setShowAutocomplete(false);
                            form.setValue("name", result.name);
                            form.setValue("address", result.address);
                          }}
                        >
                          {result.name} - {result.address}
                        </li>
                      ))
                    )}
                  </ul>
                )}
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
                    {hostels &&
                      hostels?.data?.map((item: any) => (
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
          name="paymentTotal"
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
                        inputValue === "" ? null : parseInt(inputValue, 10)
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
                          inputValue === "" ? null : parseInt(inputValue, 10)
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
                        inputValue === "" ? null : parseInt(inputValue, 10)
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
      <Button disabled={isSubmiting} form="addPatient" type="submit">
        Save changes
      </Button>
    </Form>
  );
}
