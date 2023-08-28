//@ts-ignore
import prisma from '@/lib/prisma'
import Optimistic from "./optimistic"
export default async function Home(){
//@ts-ignore
	const datas = await prisma.hospitalization.findMany({
		include:{
        patient: {
          include: {
            hostel: true
          }
        }
      }
	})
//@ts-ignore
	const hostels = await prisma.hostel.findMany()
	return (
		<>
		<Optimistic datas={datas} hostels={hostels}/>
		</>
		)
}