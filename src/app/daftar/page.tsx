import prisma from '@/lib/prisma'

export default async function HomePage(){
	const data = await prisma.hospitalization.findMany({
		where:{
			status:"inap"
		},
		include:{
			patient:{
				include :{
					hostel:true
				}
			}
		}
	})
	
	const groupByHostel = data.reduce((acc:any, item:any) => {
  const hostelName = item.patient.hostel.name;
  if (!acc[hostelName]) {
    acc[hostelName] = [];
  }
  acc[hostelName].push(item);
  return acc;
}, {});
	//console.log(JSON.stringify(data,null,2))
//	console.log(JSON.stringify(groupByHostel,null,2))
	function hitungSelisihHari(tanggal:string):number {
  // Konversi tanggal "created_at" menjadi objek Date
  const createdAt = new Date(tanggal);

  // Tanggal saat ini
  const currentDate = new Date();

  // Hitung selisih dalam milidetik
//@ts-ignore
  const timeDifference = currentDate - createdAt;

  // Konversi milidetik ke hari
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}
	return (
		<>
		
			<h2 className="text-center text-xl font-bold mb-4">Data anak sakit di poskestren</h2>
      {Object.keys(groupByHostel).map((hostelName:any,i: number) => (
        <div key={hostelName}>
          <h3 className={`font-bold ${i !== 0 ? "mt-4":""}`}># {hostelName}</h3>
          <ul className="list-decimal ml-4">
            {groupByHostel[hostelName].map((item:any) => (
              <li className="" key={item.id}>{item.patient.name} ({item.patient.address.split(",")[0].trim()}) ,{item.patient.hostel.name} {item.patient.class ? ', kelas '+ item.patient.class:''}, {item.complaint} - ({hitungSelisihHari(item.created_at)} hari) </li>
            ))}
          </ul>
        </div>
      ))}
		</>
		)
}