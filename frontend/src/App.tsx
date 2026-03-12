import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthWrapper, RefreshWrapper, UnauthWrapper, AdminWrapper } from '@/components/wrappers'
import { AdminLayout, Layout } from '@/components/layouts'
import { Login } from '@/pages/auth/'
import Home from '@/pages/Home'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/all'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP, Flip)

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='*' element={<>404</>} />
				</Route>

				<Route element={<RefreshWrapper />}>
					<Route element={<AuthWrapper />}>
						<Route element={<AdminWrapper />}>
							<Route path='admin' element={<AdminLayout />}></Route>
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