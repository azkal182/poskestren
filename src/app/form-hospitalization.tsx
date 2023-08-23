"use client"

import {useState, useEffect, useRef} from "react"
import { useToast } from "@/components/ui/use-toast";
import axios from "axios"
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


export const formSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
  hostelId: z.string(),
  complaint: z.string().min(2).max(50),
});

export default function FormHospitalization({modalClose}:{modalClose:()=>void}){
	const { data: hostels, error } = useHostel();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef(null);
  const {
    createHospitalization,
    updateHospitalization,
  } = useHospitalization();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      complaint: "",
    },
  });
  
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
  	setIsSubmiting(true)
    await createHospitalization(values);
    //setOpen(false);
    modalClose()
    setIsSubmiting(false)
    setResults([]);
    form.reset();
    toast({
      title: "Data berhasil ditambahkan",
      description: "NAMA " + values.name,
    });
  }

  const handleSearch = async (searchQuery:string) => {
    setQuery(searchQuery);
    console.log(searchQuery)
    if (searchQuery.length <= 2) {
      setLoading(false);
      return setResults([]);
    }
    
    //alert('setQuery')
    setLoading(true);

    try {
      const response = await axios.get(
        `/api/sidafa?query=${searchQuery}`
      );
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
    const handleOutsideClick = (event:any) => {
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
  	<>
  	<Form {...form}>
            <form
              id="addHospitalization"
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
                            !loading
                              ? results.length > 0
                                ? "block"
                                : "hidden"
                              : ""
                          } mt-2 z-50 left-4 right-4 border absolute bg-white max-h-40 overflow-auto`}
                        >
                          {loading ? (
                            <li className="p-2">Loading...</li>
                          ) : (
                            results.map((result:any) => (
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
                name="complaint"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Keluhan</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="Keluhan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-3" />
                    </div>
                  </FormItem>
                )}
              />
            </form>
            <Button disabled={isSubmiting} form="addHospitalization" type="submit">
              Save data
            </Button>
          </Form>
          </>
  	)
  
  
}