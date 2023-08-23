"use client";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { Loader } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface IData {
	name?:string,
	address?: string,
	accountNumber?:string
}

function App() {
  const [inputValue, setValue] = useState("");
  const [data, setData] = useState("");
  const [selectedValue, setSelectedValue] = useState<IData | null>(null);
  const [loading, setLoading] = useState(false);

  // handle input change event
  const handleInputChange = (value:any) => {
    setValue(value);
  };

  // handle selection
  const handleChange = async (value:any) => {
    setSelectedValue(value);
    setLoading(true);
    const data = await getBalance(value.accountNumber);
    setData(data);
    setLoading(false);
  };

  const getBalance = async (rek:any) => {
    const res = await fetch(`/api/sidafa/${rek}`);
    const { data } = await res.json();
    console.log(data)

    return data;
  };
  // load options using API call
  const loadOptions = async (inputValue:any) => {
    const res = await fetch(`/api/sidafa?query=${inputValue}`);
    //const res =  await fetch(`http://jsonplaceholder.typicode.com/posts?userId=${inputValue}`)
    //const data = await res.json()
    const { data } = await res.json();
    
    return data;
  };

  return (
    <div className="App">
      <h3 className="font-bold text-center text-lg uppercase">
        Cek Tabungan 
      </h3>
      <pre>Masukan Nama yang akan di cari :</pre>
      <AsyncSelect
        cacheOptions
        defaultOptions
        value={selectedValue}
        getOptionLabel={(e:any) => e.name + " - " + e.address}
        getOptionValue={(e:any) => e.accountNumber}
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        onChange={handleChange}
        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
className="react-select-container"
  classNamePrefix="react-select"
      />
      <div className="mt-4">
        
        {selectedValue && data && !loading && (
        	<>
          <div className="grid grid-cols-4">
            <div>Name</div>
            <div className="col-span-3 font-bold">: {selectedValue?.name || ""}</div>
            <div>Alamat</div>
            <div className="col-span-3 font-bold">: {selectedValue?.address || ""}</div>
            <div>Saldo</div>
            <div className="col-span-3 font-bold">: {/*@ts-ignore */}
            {data?.balance || 0} </div>
          </div>
          <Table className="mt-2">
      <TableCaption>A list of your recent debit.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">#</TableHead>
          <TableHead>type</TableHead>
          <TableHead>description</TableHead>
          <TableHead>date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {/*@ts-ignore*/}
        {data?.transactions?.slice(0,21).map((item:any) => (
          <TableRow className={item.type === "Penarikan Tabungan" ?"bg-blue-100 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200":""} key={item.number}>
            <TableCell className="font-medium">{item.number}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell className="text-right">{item.amount}</TableCell>
            <TableCell className="text-right font-bold">{item.balance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
          </>
        )}
      </div>
      
      {loading && (
      	<div className="mt-8 flex flex-col justify-center items-center"> 
      	<div>loading data </div>
      	<Loader className="animate-spin w-12 h-12"/>
      	</div>
      	)}
    </div>
  );
}

export default App;
