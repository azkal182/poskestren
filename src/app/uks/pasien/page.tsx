import React from 'react'
import PatientOptimisticPage from './optimistic'
import prisma from "@/lib/prisma"

async function CheckupPage() {
  const data = await prisma?.checkUp.findMany({
    include: {
      patient: {
        include: {
          hostel: true,
        },
      },
    },
  })
  const hostels = await prisma?.hostel.findMany()
console.log(JSON.stringify(data,null,2))
  return (
    <div>
      <PatientOptimisticPage data={data} hostels={hostels}/>
    </div>
  )
}

export default CheckupPage