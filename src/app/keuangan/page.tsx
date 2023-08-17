"use client";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { Loader } from 'lucide-react';

interface IData {
	name?:string,
	address?: string,
	accountNumber?:string
}

function App() {
  const [inputValue, setValue] = useState("");
  const [balance, setBalance] = useState("");
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
    setBalance(data);
    setLoading(false);
  };

  const getBalance = async (rek:any) => {
    const res = await fetch(`/api/sidafa/${rek}`);
    const { data } = await res.json();

    return data.balance;
  };
  // load options using API call
  const loadOptions = async (inputValue:any) => {
    const res = await fetch(`/api/sidafa?query=${inputValue}`);
    //const res =  await fetch(`http://jsonplaceholder.typicode.com/posts?userId=${inputValue}`)
    //const data = await res.json()
    const { data } = await res.json();
    console.log(data);
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
      />
      <div className="mt-8">
        
        {selectedValue && balance && !loading && (
          <div className="grid grid-cols-4">
            <div>Name</div>
            <div className="col-span-3">: {selectedValue?.name || ""}</div>
            <div>Alamat</div>
            <div className="col-span-3">: {selectedValue?.address || ""}</div>
            <div>Saldo</div>
            <div className="col-span-3">: {balance || 0}</div>
          </div>
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
