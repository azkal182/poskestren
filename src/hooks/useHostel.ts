import axios from "axios";
import useSWR, { mutate } from "swr";

interface Item {
  id: number;
  text: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useHostel = () => {
  const endpoint = "https://encouraging-frog-sari.cyclic.cloud/api/hostels";
  // const { data, error } = useSWR<Item[]>(endpoint, fetcher);
  const { data, error } = useSWR(endpoint, fetcher);

  const createHostel = async (item: any) => {
    await axios.post(endpoint, item);
    mutate(endpoint);
  };

  const updateHostel = async (id: number, updatedItem: any) => {
    await axios.put(`${endpoint}/${id}`, updatedItem);
    mutate(endpoint);
  };

  const deleteHostel = async (id: number) => {
    await axios.delete(`${endpoint}/${id}`);
    mutate(endpoint);
  };

  return { data, error, createHostel, updateHostel, deleteHostel };
};
