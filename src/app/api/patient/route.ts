//@ts-ignore
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
 
export async function GET() {
    //@ts-ignore
  const data = await prisma.patient.findMany({
    include: {
      hostel: true,
    },
  })
  return NextResponse.json({ data })
}

export async function POST(req:any) {
  const data = await req.json()
    //@ts-ignore
  const created= await prisma.patient.create({
    data:{
      name: data.name,
    address: data.address,
    requirement: data.requirement,
    totalPayment: data.totalPayment,
    remainingPayment: data.remainingPayment,
    paymentSource: data.paymentSource,
    paymentStatus: data.paymentStatus,
      hostel: {
        connect: { id: data.hostelId } 
      }
      
    }
    
  })
  return NextResponse.json({ data })
}

export async function PUT(req:any) {
  const data = await req.json()
    //@ts-ignore
  const created= await prisma.patient.update({
    where:{
      id:data.id
    },
    data:{
      name: data.name,
    address: data.address,
    requirement: data.requirement,
    totalPayment: data.totalPayment,
    remainingPayment: data.remainingPayment,
    paymentSource: data.paymentSource,
    paymentStatus: data.paymentStatus,
      hostel: {
        connect: { id: parseInt(data.hostelId) } 
      }
      
    }
    
  })
  return NextResponse.json({ data })
}

