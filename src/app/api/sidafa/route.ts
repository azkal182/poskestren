import {searchUser} from "@/lib/sidafa"
import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
  const query = searchParams.get('search')
  //@ts-ignore
	const data = await searchUser(query)
	
  return NextResponse.json({ data })
}