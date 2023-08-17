//@ts-ignore
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
 
export async function GET() {
    //@ts-ignore
  const data = await prisma.hostel.findMany({
    
  })
  return NextResponse.json({ data })
}

export async function POST(req:any) {
  const data = await req.json()
    //@ts-ignore
  const created= await prisma.hostel.create({
    data:{
      name: data.name,
    }
  })
  return NextResponse.json({ data })
}
