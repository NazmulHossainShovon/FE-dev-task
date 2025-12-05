import { useEffect } from 'react' 
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import './App.css'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const COMMIT_SHA = import.meta.env.VITE_COMMIT_SHA || "local";


function App() {
  useEffect(() => {  
    console.log(`Backend URL: ${BACKEND_URL}`);  
    console.log(`Frontend Version: ${COMMIT_SHA}`);  
  }, []);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App
