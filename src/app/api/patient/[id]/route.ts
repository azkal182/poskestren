//@ts-ignore
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
 
 export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  //@ts-ignore
  const id = params.id // 'a', 'b', or 'c'
  //@ts-ignore
  const created= await prisma.patient.delete({
    where:{
      id:parseInt(id)
    },

  })
  
  return NextResponse.json({ data:"oke" })
}