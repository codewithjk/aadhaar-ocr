

import './App.css'

import {FileUpload } from "@repo/ui"
// import { FileUpload } from '@repo/ui';

function App() {
  const handleFileUpload = () => {
    
  }

  return (
    <>
    
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>


    </>
  )
}

export default App
