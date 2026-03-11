import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthWrapper, RefreshWrapper, UnauthWrapper, AdminWrapper } from '@/components/wrappers'
import { AdminLayout, Layout } from '@/components/layouts'
import { Login } from '@/pages/auth/'
import { Users, Appointments, Calendar, Contacts, Categories, Services } from '@/pages/admin'
import Home from '@/pages/Home'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import { useGSAP } from '@gsap/react'
import { Flip } from "gsap/all";
import gsap from 'gsap'

gsap.registerPlugin(useGSAP,Flip);

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='contact' element={<Contact />} />
					<Route path='appointment' element={<Appointment />} />
					<Route path='*' element={<>404</>} />
				</Route>

				<Route element={<RefreshWrapper />}>
					<Route element={<AuthWrapper />}>
						<Route element={<AdminWrapper />}>
							<Route path='admin' element={<AdminLayout />}>
								<Route path='users' element={<Users />} />
								<Route path='appointments' element={<Appointments />} />
								<Route path='Calendar' element={<Calendar />} />
								<Route path='contacts' element={<Contacts />} />
								<Route path='categories' element={<Categories />} />
								<Route path='services' element={<Services />} />
							</Route>
						</Route>
					</Route>

					<Route element={<UnauthWrapper />}>
						<Route path='login' element={<Login />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
