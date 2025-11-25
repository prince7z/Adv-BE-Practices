import { getServerSession } from "next-auth";
import NavBar from "./components/NavBar";
import { authOptions } from "./api/auth/[...nextauth]/route";
export default async function Home() {
  const serversession= await getServerSession(authOptions);
console.clear();
 
  return (

    
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <NavBar />
    <br/>
    <br/>

    HEllo here is your sesion info
    <pre>{JSON.stringify(serversession, null, 2)}</pre>
    </div>
    
    
  );
}
