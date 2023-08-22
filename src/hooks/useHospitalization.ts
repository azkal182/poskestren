import axios from "axios"
import useSWR, { mutate } from "swr"

interface Item {
  id: number
  text: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const useHospitalization = () => {
  const endpoint = "https://encouraging-frog-sari.cyclic.cloud/api/hospitalizations"
  // const { data, error } = useSWR<Item[]>(endpoint, fetcher);
  const { data, error } = useSWR(endpoint, fetcher)

  const createHospitalization = async (item: any) => {
    await axios.post(endpoint, item)
    mutate(endpoint)
  }

  const updateHospitalization = async (updatedItem: any) => {
    await axios.patch(`${endpoint}`, updatedItem)
    mutate(endpoint)
  }

  const deleteHospitalization = async (id: number) => {
    await axios.delete(`${endpoint}/${id}`)
    mutate(endpoint)
  }

  return { data, error, createHospitalization, updateHospitalization, deleteHospitalization }
}
