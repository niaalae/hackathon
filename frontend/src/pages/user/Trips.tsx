import { useState } from 'react'
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Coffee,
  Download,
  Filter,
  Hotel,
  Mail,
  MapPin,
  Search,
  Star,
  Ticket,
  Users,
  Wifi,
} from 'lucide-react'

interface Transport {
  id: string
  type: string
  route: string
  from: string
  to: string
  departure: string
  arrival: string
  date: string
  status: 'confirmed' | 'pending' | 'cancelled'
  price: string
  passengers: number
}

interface RiadBooking {
  id: string
  name: string
  image: string
  location: string
  checkIn: string
  checkOut: string
  nights: number
  roomType: string
  status: 'confirmed' | 'pending'
  price: string
  rating: number
  amenities: string[]
}

interface Activity {
  id: string
  name: string
  image: string
  location: string
  date: string
  time: string
  duration: string
  status: 'booked' | 'wishlisted'
  price: string
  category: string
}

const transports: Transport[] = [
  {
    id: '1',
    type: 'Grand Taxi',
    route: 'Fes - Meknes',
    from: 'Fes',
    to: 'Meknes',
    departure: '9:00 AM',
    arrival: '10:00 AM',
    date: 'Mar 15, 2025',
    status: 'confirmed',
    price: '25 MAD',
    passengers: 4,
  },
  {
    id: '2',
    type: 'CTM Bus',
    route: 'Meknes - Volubilis',
    from: 'Meknes',
    to: 'Volubilis',
    departure: '11:00 AM',
    arrival: '11:45 AM',
    date: 'Mar 16, 2025',
    status: 'confirmed',
    price: '20 MAD',
    passengers: 4,
  },
]

const riads: RiadBooking[] = [
  {
    id: '1',
    name: 'Riad Fes Maya',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60',
    location: 'Fes Medina, Morocco',
    checkIn: 'Mar 15, 2025',
    checkOut: 'Mar 18, 2025',
    nights: 3,
    roomType: 'Suite Royale',
    status: 'confirmed',
    price: '2,100 MAD',
    rating: 4.9,
    amenities: ['wifi', 'breakfast', 'hammam', 'terrace'],
  },
]

const activities: Activity[] = [
  {
    id: '1',
    name: 'Chouara Tannery Tour',
    image: 'https://images.unsplash.com/photo-1577195717591-7b4d0e8a0e1a?w=800&auto=format&fit=crop&q=60',
    location: 'Fes Medina',
    date: 'Mar 16, 2025',
    time: '10:00 AM',
    duration: '2 hours',
    status: 'booked',
    price: '150 MAD',
    category: 'Culture',
  },
  {
    id: '2',
    name: 'Moroccan Cooking Class',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=60',
    location: 'Riad Fes Maya',
    date: 'Mar 16, 2025',
    time: '3:00 PM',
    duration: '3 hours',
    status: 'booked',
    price: '350 MAD',
    category: 'Experience',
  },
  {
    id: '3',
    name: 'Volubilis Roman Ruins',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=60',
    location: 'Volubilis',
    date: 'Mar 17, 2025',
    time: '9:00 AM',
    duration: '4 hours',
    status: 'wishlisted',
    price: '70 MAD',
    category: 'History',
  },
]

const statusStyles: Record<string, string> = {
  confirmed: 'bg-orange-500/15 text-orange-600',
  pending: 'bg-amber-500/15 text-amber-700',
  cancelled: 'bg-rose-500/15 text-rose-600',
  booked: 'bg-orange-500/15 text-orange-600',
  wishlisted: 'bg-zinc-200 text-zinc-600',
}

export default function UserTrips() {
  const [activeTab, setActiveTab] = useState<'transport' | 'riads' | 'activities'>('transport')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>Trip Hub</h2>
        <p className='text-sm text-zinc-500'>Manage all your Fes-Meknes bookings</p>
      </div>

      <div className='rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-orange-500/15 p-2 text-orange-500'>
              <Mail className='h-5 w-5' />
            </div>
            <div>
              <p className='font-semibold text-zinc-900'>Import bookings from email</p>
              <p className='text-sm text-zinc-500'>Automatically sync confirmations from your inbox</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <button className='flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600'>
              <Download className='h-4 w-4' />
              Upload PDF
            </button>
            <button className='flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white'>
              <Mail className='h-4 w-4' />
              Connect Email
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap gap-2'>
          {[
            { key: 'transport', label: 'Transport', icon: Car, count: transports.length },
            { key: 'riads', label: 'Riads', icon: Hotel, count: riads.length },
            { key: 'activities', label: 'Activities', icon: Ticket, count: activities.length },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                activeTab === tab.key ? 'bg-orange-500 text-white' : 'bg-white text-zinc-600 border border-zinc-200'
              }`}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
            >
              <tab.icon className='h-4 w-4' />
              {tab.label}
              <span className='rounded-full bg-white/20 px-2 py-0.5 text-[10px]'>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
            <input placeholder='Search bookings...' className='h-10 w-48 rounded-full border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-600' />
          </div>
          <button className='rounded-full border border-zinc-200 p-2 text-zinc-600'>
            <Filter className='h-4 w-4' />
          </button>
        </div>
      </div>

      {activeTab === 'transport' && (
        <div className='space-y-4'>
          {transports.map((transport) => (
            <div key={transport.id} className='rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-center gap-6'>
                  <div className='hidden h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 sm:flex'>
                    <Car className='h-6 w-6' />
                  </div>
                  <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-3'>
                    <div>
                      <p className='text-2xl font-semibold text-zinc-900'>{transport.from}</p>
                      <p className='text-sm text-zinc-500'>Departure</p>
                      <p className='mt-1 text-sm font-semibold text-zinc-900'>{transport.departure}</p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                      <p className='text-xs text-zinc-500'>{transport.type}</p>
                      <div className='flex items-center gap-2'>
                        <span className='h-px flex-1 bg-zinc-200' />
                        <Car className='h-4 w-4 text-orange-500' />
                        <span className='h-px flex-1 bg-zinc-200' />
                      </div>
                      <p className='text-xs text-zinc-500'>{transport.route}</p>
                    </div>
                    <div className='md:text-right'>
                      <p className='text-2xl font-semibold text-zinc-900'>{transport.to}</p>
                      <p className='text-sm text-zinc-500'>Arrival</p>
                      <p className='mt-1 text-sm font-semibold text-zinc-900'>{transport.arrival}</p>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between gap-4 lg:flex-col lg:items-end'>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[transport.status]}`}>
                    {transport.status === 'confirmed' && <CheckCircle2 className='mr-1 inline h-3 w-3' />}
                    {transport.status === 'pending' && <AlertCircle className='mr-1 inline h-3 w-3' />}
                    {transport.status}
                  </span>
                  <div className='text-right'>
                    <p className='text-xl font-semibold text-zinc-900'>{transport.price}</p>
                    <p className='text-xs text-zinc-500'>
                      <Users className='mr-1 inline h-3 w-3' />
                      {transport.passengers} passengers
                    </p>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2 border-t border-zinc-200 pt-4 text-sm text-zinc-500'>
                <Calendar className='h-4 w-4' />
                {transport.date}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'riads' && (
        <div className='space-y-4'>
          {riads.map((riad) => (
            <div key={riad.id} className='overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-sm'>
              <div className='flex flex-col md:flex-row'>
                <img src={riad.image} alt={riad.name} className='h-48 w-full object-cover md:h-auto md:w-64' />
                <div className='flex-1 space-y-4 p-6'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='text-xl font-semibold text-zinc-900'>{riad.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[riad.status]}`}>{riad.status}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-zinc-500'>
                    <MapPin className='h-4 w-4' />
                    {riad.location}
                  </div>
                  <div className='flex items-center gap-1'>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`h-4 w-4 ${idx < Math.floor(riad.rating) ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'}`} />
                    ))}
                    <span className='text-sm text-zinc-500'>{riad.rating}</span>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {riad.amenities.includes('wifi') && (
                      <span className='rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600'>
                        <Wifi className='mr-1 inline h-3 w-3' /> WiFi
                      </span>
                    )}
                    {riad.amenities.includes('breakfast') && (
                      <span className='rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600'>
                        <Coffee className='mr-1 inline h-3 w-3' /> Breakfast
                      </span>
                    )}
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4 text-sm text-zinc-500'>
                    <span>
                      Check-in: <span className='text-zinc-900'>{riad.checkIn}</span>
                    </span>
                    <span>
                      Check-out: <span className='text-zinc-900'>{riad.checkOut}</span>
                    </span>
                    <span className='text-zinc-900 font-semibold'>{riad.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {activities.map((activity) => (
            <div key={activity.id} className='overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-sm'>
              <div className='relative h-40'>
                <img src={activity.image} alt={activity.name} className='h-full w-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[activity.status]}`}>
                  {activity.status}
                </span>
                <span className='absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-600'>{activity.category}</span>
              </div>
              <div className='space-y-3 p-4'>
                <h3 className='font-semibold text-zinc-900'>{activity.name}</h3>
                <div className='space-y-2 text-sm text-zinc-500'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4' />
                    {activity.location}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    {activity.date}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    {activity.time} ({activity.duration})
                  </div>
                </div>
                <div className='flex items-center justify-between border-t border-zinc-200 pt-3'>
                  <span className='text-lg font-semibold text-zinc-900'>{activity.price}</span>
                  <button className='rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600'>
                    {activity.status === 'booked' ? 'View Details' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
