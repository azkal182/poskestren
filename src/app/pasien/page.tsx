import React from 'react'
import PatientOptimisticPage from './optimistic'

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

  return (
    <div>
      <PatientOptimisticPage data={data} hostels={hostels}/>
    </div>
  )
}

export default CheckupPage