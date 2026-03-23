import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Departments from '../components/Departments'
import HowItWorks from '../components/HowItWorks'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <Departments />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home
