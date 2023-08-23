import axios from "axios"
import useSWR, { mutate } from "swr"

interface Item {
  id: number
  text: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const usePatient = () => {
  const endpoint = (process.env.API_URL || "http://localhost:8000") + "/api/checkups"
  // const { data, error } = useSWR<Item[]>(endpoint, fetcher);
  const { data, error } = useSWR(endpoint, fetcher)

  const createPatient = async (item: any) => {
    await axios.post(endpoint, item)
    mutate(endpoint)
  }

  const updatePatient = async (id: number, updatedItem: any) => {
    await axios.put(`${endpoint}/${id}`, updatedItem)
    mutate(endpoint)
  }

  const deletePatient = async (id: number) => {
    await axios.delete(`${endpoint}/${id}`)
    mutate(endpoint)
  }

  return { data, error, createPatient, updatePatient, deletePatient }
}
