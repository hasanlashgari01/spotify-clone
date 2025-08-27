import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Home/Hero'
const Home: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar/>
        <Hero/>
      </header>
      
    </div>
  )
}

export default Home
