import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import MidSection from '../Components/MidSection'
import Footersection from '../Components/Footersection'


const Dashboard = () => {
  return (
    <div className='min-h-screen pt-16 w-full overflow-x-hidden  bg-[rgb(11,15,25)]'>
      <Navbar />
      <HeroSection />
      <MidSection />
      <Footersection />
    </div>
  )
}

export default Dashboard