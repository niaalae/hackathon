import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthWrapper, RefreshWrapper, UnauthWrapper, AdminWrapper } from '@/components/wrappers'
import { AdminLayout } from '@/components/layouts'
import { Login, Register } from '@/pages/auth/'
import Home from '@/pages/Home'
import TripPlanner from '@/pages/planning/TripPlanner'
import Itineraries from '@/pages/planning/Itineraries'
import TravelGuides from '@/pages/planning/TravelGuides'
import BeachEvents from '@/pages/summer-parties/BeachEvents'
import RooftopParties from '@/pages/summer-parties/RooftopParties'
import FestivalGuide from '@/pages/summer-parties/FestivalGuide'
import Pricing from '@/pages/Pricing'
import FAQs from '@/pages/FAQs'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/all'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP, Flip)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        {/* Planning */}
        <Route path="planning/trip-planner" element={<TripPlanner />} />
        <Route path="planning/itineraries" element={<Itineraries />} />
        <Route path="planning/travel-guides" element={<TravelGuides />} />

        {/* Summer Parties */}
        <Route path="summer-parties/beach-events" element={<BeachEvents />} />
        <Route path="summer-parties/rooftop-parties" element={<RooftopParties />} />
        <Route path="summer-parties/festival-guide" element={<FestivalGuide />} />

        {/* Standalone */}
        <Route path="pricing" element={<Pricing />} />
        <Route path="faqs" element={<FAQs />} />

        <Route path="*" element={<>404</>} />

        <Route element={<RefreshWrapper />}>
          <Route element={<AuthWrapper />}>
            <Route element={<AdminWrapper />}>
              <Route path="admin" element={<AdminLayout />}></Route>
            </Route>
          </Route>

          <Route element={<UnauthWrapper />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App