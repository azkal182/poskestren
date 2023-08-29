"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface HospitalizationFormData {
  id: string;
  patientId: string;
  name: string;
  address: string;
  hostelId: string;
  complaint: string;
}

interface IReturnHospitalization {
  id: string;
  return_at: string;
  selisih: number;
}

export async function addHospitalization(FormData: HospitalizationFormData) {
  const data = FormData;
  await prisma.hospitalization.create({
    data: {
      id: data.id,
      patient: {
        create: {
          id: data.patientId,
          name: data.name,
          address: data.address,
          hostel: {
            connect: {
              id: data.hostelId,
            },
          },
        },
      },
      status: "inap",
      complaint: data.complaint,
    },
  });
  //return result;
  revalidatePath("/hospitalizations");
}

export async function returnHospitalization(
  hospitalization: IReturnHospitalization,
) {
  await prisma.hospitalization.update({
    where: {
      id: hospitalization.id,
    },
    data: {
      return_at: hospitalization.return_at,
      selisih: hospitalization.selisih,
      status: "pulang",
    },
  });
  //return result;
  revalidatePath("/hospitalizations");
}
