"use client";
import { useState, useRef, useEffect, useTransition } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { searchUser } from "@/lib/sidafa";
import { Loader } from "lucide-react";
import * as React from "react";
import axios from "axios";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  selected?: (data: any) => void;
}
//@ts-ignore
const SearchName = React.forwardRef<HTMLInputElement, InputProps>(
  //@ts-ignore
  ({ selected, className, type, ...props }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cache, setCache] = useState({});
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const autocompleteRef = useRef(null);

    const delayedSearch = debounce(async (value, source) => {
    	//@ts-ignore
      const cachedResults = cache[value];
      if (cachedResults) {
        setSearchResults(cachedResults);
        setShowAutocomplete(true);
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetchData(value, source);

        if (value === inputValue) {
          setSearchResults(response.data);

          setCache({ ...cache, [inputValue]: response.data });
          setShowAutocomplete(true);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("fetch dibatalkan");
        } else {
          // Tangani kesalahan lainnya
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    useEffect(() => {
      if (inputValue.length > 2) {
        const source = axios.CancelToken.source();
        //@ts-ignore
        setCancelTokenSource(source);
        delayedSearch(inputValue, source);
      } else {
        //setShowAutocomplete(false)
        setCache({ ...cache, [inputValue]: [] }); // Simpan input yang tidak valid ke dalam cache
        setSearchResults([]);
      }

      return () => {
        if (cancelTokenSource) {
        	//@ts-ignore
          cancelTokenSource.cancel("Request canceled due to new input");
        }
      };
    }, [inputValue]);

    const handleSearch = (event:any) => {
      
      const query = event.target.value;
      setInputValue(query);
    };

    const fetchData = async (query: string, source: any) => {
      try {
        const response = await axios.get(`/api/sidafa?search=${query}`, {
          cancelToken: source.token,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
    useEffect(() => {
      // Function to close the autocomplete when clicking outside of it
      const handleOutsideClick = (event: any) => {
        if (
          autocompleteRef.current &&
          //@ts-ignore
          !autocompleteRef.current?.contains(event.target)
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
        <div ref={autocompleteRef} className="relative col-start-2 col-span-3">
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            //onChange={(e)=>startTransition(()=>console.log(e.target.value))}
            ref={ref}
            {...props}
            onChange={handleSearch}
          />
          {isLoading && (
            <Loader className="w-4 h-4 absolute right-4 animate-spin top-2" />
          )}

          <ul
            className={`${
              showAutocomplete && searchResults.length > 0
                ? "absolute"
                : "hidden"
            } rounded mt-2 z-50 left-0 right-0 border bg-background max-h-[200px] overflow-auto divide-y`}
          >
            {searchResults.map((result: any) => (
              <li
                onClick={() => {
                  if (selected) {
                    selected(result);
                  }

                  setShowAutocomplete(false);
                  setSearchResults([]);
                }}
                className="p-2 cursor-pointer hover:bg-accent"
                key={result.accountNumber}
              >
                {result.name} - <b>{result.address}</b>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
);
SearchName.displayName = "SearchName";
export { SearchName };
