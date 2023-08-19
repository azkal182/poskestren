"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
const InputSearch = ({props}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef(null);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.length <= 2) {
    	setLoading(false);
    	return setResults([])
    } 
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/api/sidafa?query=${searchQuery}`);
      if (response.data.data.length > 0){
      setResults(response.data.data);
      setShowAutocomplete(true); 
      } else {
      setResults([]);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Function to close the autocomplete when clicking outside of it
    const handleOutsideClick = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };

    // Attach the outside click event listener
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="" ref={autocompleteRef}>
      <div className="flex items-center relative w-64">
      <Input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className=""
        onFocus={()=>{
        	if (results.length > 0) {
        	setShowAutocomplete(true)
        	}
        	
        }}
      />
      {loading && (
      <Loader className="w-4 h-4 absolute right-2 animate-spin"/>
      )}
      </div>
      {showAutocomplete && (
        <ul className={`${!loading ? (results.length > 0 ? "block":"hidden"):""} mt-2 border w-64 absolute bg-white max-h-40 overflow-auto`}>
          {loading ? (
            <li className="p-2">Loading...</li>
          ) : (
            results.map((result) => (
              <li
                key={result.accountNumber}
                className="p-2 cursor-pointer hover:bg-accent"
                onClick={() => {
                	setShowAutocomplete(false)
                	alert(JSON.stringify(result))
                }}
              >
                {result.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default InputSearch;
