//@ts-ignore

import { NextResponse } from 'next/server'
 import {getBalance} from "@/lib/sidafa"
 export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  //@ts-ignore
  const id = params.id // 'a', 'b', or 'c'
  //@ts-ignore
  const data = await getBalance(id)

  
  return NextResponse.json({ data })
}