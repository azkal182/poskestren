"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ICheckUp {
  name: string;
  address: string;
  hostelId: string;
  requirement: string;
  paymentSource: string;
  paymentTotal: null;
  pinjam: null;
  payment: null;
  description: string;
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
      payment: data.payment,
      payment_total: data.paymentTotal,
      status: data.paymentTotal ? "- " + data.paymentTotal : "",
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
