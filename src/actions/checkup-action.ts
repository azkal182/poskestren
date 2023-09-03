"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ICheckUp {
  name: string;
  address: string;
  hostelId: string;
  requirement: string;
  paymentSource: string;
  paymentTotal?: string | null;
  pinjam?: string | null;
  payment?: string | null;
  description?: string;
  patientId: string;
  id: string;
}

export async function addCheckUp(FormData: ICheckUp) {
  const data = FormData;
  await prisma?.checkUp.create({
    data: {
      id: data.id,
      payment_source: data.paymentSource,
      requirement: data.requirement,
      payment: parseFloat(data.payment as string),
      payment_total: parseFloat(data.paymentTotal as string),
      status: data.paymentSource.toLowerCase() === "sendiri" || data.paymentSource.toLowerCase() ===  "cash" ? "lunas" : parseFloat(data.paymentTotal as string) ? "- " + parseFloat(data.paymentTotal as string) : "",
      patient: {
        create: {
          name: data.name,
          address: data.address,
          hostel: {
            connect: {
              id: data.hostelId,
            },
          },
        },
      },
    },
  });
  //return result;
  revalidatePath("/checkups");
}

export async function addTotalCheckUp(data:any){
	await prisma.checkUp.update({
		where:{
			id:data.id
		},
		data:{
			payment_total: parseFloat(data.paymentTotal),
			status: (parseFloat(data.paymentTotal) * -1).toString()
		}
	})
	revalidatePath("/checkups");
}

// export async function returnHospitalization(
//   hospitalization: IReturnHospitalization,
// ) {
//   await prisma.hospitalization.update({
//     where: {
//       id: hospitalization.id,
//     },
//     data: {
//       return_at: hospitalization.return_at,
//       selisih: hospitalization.selisih,
//       status: "pulang",
//     },
//   });
//   //return result;
//   revalidatePath("/hospitalizations");
// }
