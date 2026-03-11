import { useAuthStore } from "@/stores/authStore"
import { ArrowLeft, CalendarDays, ClipboardCheck, Component, Copy, LogOut, ReceiptText, Users } from "lucide-react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

export default function AdminLayout() {
	return (
		<main className="overflow-hidden h-screen w-screen flex bg-gray-300 p-1 gap-1">
			<Sidebar />
			<section className="bg-white h-full w-full oveflow-hidden p-9 rounded-xl">
				<Outlet />
			</section>
		</main>
	)
}
const LINKS = [
	{ to: "users", label: "Utilisateurs", icon: Users },
	{ to: "categories", label: "Catégories", icon: Copy },
	{ to: "services", label: "Services", icon: Component },
	{ to: "contacts", label: "Contacts", icon: ReceiptText },
	{ to: "appointments", label: "Rendez-vous", icon: ClipboardCheck },
	{ to: "calendar", label: "Calendrier", icon: CalendarDays },
]

function Sidebar() {
	const location = useLocation()
	const navigate = useNavigate()
	const { logout } = useAuthStore()
	return (
		<aside className="h-full w-80 overflow-hidden bg-primary rounded-xl flex flex-col gap-9 p-9">
			<div className="aspect-square w-full">
				<img src="/logo.png" alt="logo" className="bg-white rounded-full" />
			</div>
			<div className="flex-1 overflow-y-auto flex flex-col gap-2">
				{LINKS.map((link, idx) => (
					<Link to={link.to} key={"sideLink-" + idx} data-active={location.pathname === "/admin/" + link.to} className="w-full flex items-center pl-8 gap-2 text-white data-[active=true]:bg-accent data-[active=true]:text-black hover:bg-accent hover:text-black rounded-lg h-10 text-lg font-semibold duration-300">
						<link.icon />
						{link.label}
					</Link>
				))}
			</div>
			<button
				onClick={() => {
					navigate("/")
				}}
				className="w-full flex items-center pl-8 gap-2 text-black bg-accent hover:bg-accent/80 rounded-lg h-10 font-semibold duration-300 cursor-pointer">
				<ArrowLeft /> Retourner au site
			</button>
			<button
				onClick={() => {
					logout().then(() => navigate("/"))
				}}
				className="w-full flex items-center pl-8 gap-2 text-white bg-red-600 hover:bg-red-600/80 rounded-lg h-10 font-semibold duration-300 cursor-pointer">
				<LogOut /> Déconnexion
			</button>
		</aside>
	)
}
