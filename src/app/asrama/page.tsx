import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AsramaPage(){
	const session = await getServerSession(authOptions);
	return (
		<>
		<code>
        <pre className="">{JSON.stringify(session, undefined, 2)}</pre>
      </code>
		<div>ASRAMA</div>
	
		</>
		)
}