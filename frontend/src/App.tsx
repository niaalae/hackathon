import { AdminLayout, UserLayout } from '@/components/layouts'
import { AuthWrapper, RefreshWrapper, UnauthWrapper } from '@/components/wrappers'
import { Login, Register } from '@/pages/auth/'
import { AdminAnalytics, AdminDashboard, AdminSettings, AdminTrips, AdminUsers } from '@/pages/admin'
import Home from '@/pages/Home'
import TripPlanner from '@/pages/planning/TripPlanner'
import Itineraries from '@/pages/planning/Itineraries'
import TravelGuides from '@/pages/planning/TravelGuides'
import BeachEvents from '@/pages/summer-parties/BeachEvents'
import RooftopParties from '@/pages/summer-parties/RooftopParties'
import FestivalGuide from '@/pages/summer-parties/FestivalGuide'
import Pricing from '@/pages/Pricing'
import FAQs from '@/pages/FAQs'
import Maps from '@/pages/Maps'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/all'
import gsap from 'gsap'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserDashboard from './pages/user/Dashboard'
import UserMaps from './pages/user/Maps'
import UserTrips from './pages/user/Trips'
import UserGroups from './pages/user/Groups'
import UserAI from './pages/user/AI'
import UserMatch from './pages/user/Match'

gsap.registerPlugin(useGSAP, Flip)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='*' element={<>404</>} />

        <Route element={<RefreshWrapper />}>
          <Route element={<AuthWrapper />}>
            {/* <Route element={<AdminWrapper />}> */}
            <Route path='admin' element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path='users' element={<AdminUsers />} />
              <Route path='trips' element={<AdminTrips />} />
              <Route path='analytics' element={<AdminAnalytics />} />
              <Route path='settings' element={<AdminSettings />} />
            </Route>
            {/* </Route> */}
            {/* <Route element={<UserWrapper />}> */}
            <Route path='user' element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path='dashboard' element={<UserDashboard />} />
              <Route path='maps' element={<UserMaps />} />
              <Route path='match' element={<UserMatch />} />
              <Route path='trips' element={<UserTrips />} />
              <Route path='groups' element={<UserGroups />} />
              <Route path='ai' element={<UserAI />} />
            </Route>
            {/* </Route> */}
          </Route>

          <Route element={<UnauthWrapper />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
