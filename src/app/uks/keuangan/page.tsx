"use client";
import React, { useState, useEffect } from "react";
import { SearchName } from "@/components/search-sidafa";
import { getBalance as getSaldo, getBalance2 } from "@/lib/sidafa";
import AsyncSelect from "react-select/async";
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IData {
  name?: string;
  address?: string;
  accountNumber?: string;
}

function App() {
  const [inputValue, setValue] = useState("");
  const [data, setData] = useState("");
  const [selectedValue, setSelectedValue] = useState<IData | null>(null);
  const [loading, setLoading] = useState(false);


  

  return (
    <div className="App">
      <h3 className="font-bold text-center text-lg uppercase">Cek Tabungan</h3>
      <pre>Masukan Nama yang akan di cari :</pre>

      <SearchName
        placeholder="Nama"
        autoComplete="off"
        id="name"
        name="name"
        className="mt-2 w-full border border-slate-300"
        selected={async (data: any) => {
          setLoading(true);
          
          const result = await getBalance2(data.accountNumber);
          
          
          //@ts-ignore
          setData(result);
          //@ts-ignore
          setValue(result.name)
          setSelectedValue(data);
          setLoading(false);
        }}
      />
      <div className="mt-4">
        {selectedValue && data && !loading && (
          <>
            <div className="grid grid-cols-4">
              <div>Name</div>
              <div className="col-span-3 font-bold">
                : {selectedValue?.name || ""}
              </div>
              <div>Alamat</div>
              <div className="col-span-3 font-bold">
                : {selectedValue?.address || ""}
              </div>
              <div>Saldo</div>
              <div className="col-span-3 font-bold">
                : {/*@ts-ignore */}
                {data?.balance || 0}{" "}
              </div>
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
                {data?.transactions?.slice(0, 21).map((item: any) => (
                  <TableRow
                    className={
                      item.type === "Penarikan Tabungan"
                        ? "bg-blue-100 hover:bg-blue-200 dark:bg-slate-700 dark:text-slate-200"
                        : ""
                    }
                    key={item.number}
                  >
                    <TableCell className="font-medium">{item.number}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">{item.amount}</TableCell>
                    <TableCell className="text-right font-bold">
                      {item.balance}
                    </TableCell>
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
          <Loader className="animate-spin w-12 h-12" />
        </div>
      )}
    </div>
  );
}

export default App;
