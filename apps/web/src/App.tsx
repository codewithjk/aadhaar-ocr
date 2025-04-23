

import './App.css'
import ImageUploader from './components/imageUploader/ImageUploader'
import Navbar from './components/Navbar'




function App() {
  const handleFileUpload = (image : File) => {
    console.log("this is from app ", image)
  }
  const handleError = () => {
    
  }

  return (
    <>
      
<Navbar/>
      <div className="flex items-center justify-center ">
        <ImageUploader onError={handleError} label='Drop here' onValidFileUpload={handleFileUpload} />
    </div>


    </>
  )
}

export default App
