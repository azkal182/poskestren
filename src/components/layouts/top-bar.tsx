import Link from 'next/link'
export default function TopBar(){
  return (
    <nav className="container hidden md:flex items-center justify-between py-4 bg-accent">
    <div>logo</div>
    <div>
    <ul className="flex items-center space-x-4">
    <li><Link href="/pasien">Pasien</Link></li>
    <li><Link href="/keuangan">Keuangan</Link></li>
    </ul>
    
    </div>
    
    </nav>
    )
}