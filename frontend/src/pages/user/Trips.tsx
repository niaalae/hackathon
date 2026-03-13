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
  PartyPopper,
  Search,
  Star,
  Ticket,
  Users,
  Wifi,
  X,
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
  {
    id: '3',
    type: 'ONCF Train',
    route: 'Fes - Rabat',
    from: 'Fes',
    to: 'Rabat',
    departure: '1:15 PM',
    arrival: '3:45 PM',
    date: 'Mar 16, 2025',
    status: 'confirmed',
    price: '85 MAD',
    passengers: 2,
  },
  {
    id: '4',
    type: 'Private Driver',
    route: 'Fes - Ifrane',
    from: 'Fes',
    to: 'Ifrane',
    departure: '8:00 AM',
    arrival: '9:00 AM',
    date: 'Mar 17, 2025',
    status: 'pending',
    price: '220 MAD',
    passengers: 3,
  },
  {
    id: '5',
    type: 'Airport Shuttle',
    route: 'Fes Saiss - Medina',
    from: 'Fes Saiss Airport',
    to: 'Fes Medina',
    departure: '7:30 PM',
    arrival: '8:10 PM',
    date: 'Mar 18, 2025',
    status: 'confirmed',
    price: '60 MAD',
    passengers: 2,
  },
  {
    id: '6',
    type: 'Shared Van',
    route: 'Meknes - Azrou',
    from: 'Meknes',
    to: 'Azrou',
    departure: '2:00 PM',
    arrival: '3:10 PM',
    date: 'Mar 19, 2025',
    status: 'cancelled',
    price: '30 MAD',
    passengers: 4,
  },
  {
    id: '7',
    type: 'Day Excursion Coach',
    route: 'Fes - Chefchaouen',
    from: 'Fes',
    to: 'Chefchaouen',
    departure: '6:30 AM',
    arrival: '9:30 AM',
    date: 'Mar 20, 2025',
    status: 'confirmed',
    price: '110 MAD',
    passengers: 8,
  },
]

const riads: RiadBooking[] = [
  {
    id: '1',
    name: 'Riad Fes Maya',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60',
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
  {
    id: '2',
    name: 'Riad Laaroussa',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
    location: 'Fes el Bali, Morocco',
    checkIn: 'Mar 18, 2025',
    checkOut: 'Mar 21, 2025',
    nights: 3,
    roomType: 'Deluxe Patio Room',
    status: 'confirmed',
    price: '1,780 MAD',
    rating: 4.7,
    amenities: ['wifi', 'breakfast', 'pool', 'terrace'],
  },
  {
    id: '3',
    name: 'Riad Rcif',
    image:
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60',
    location: 'Bab Rcif, Fes',
    checkIn: 'Mar 21, 2025',
    checkOut: 'Mar 23, 2025',
    nights: 2,
    roomType: 'Panorama Suite',
    status: 'pending',
    price: '1,250 MAD',
    rating: 4.5,
    amenities: ['wifi', 'breakfast', 'spa', 'hammam'],
  },
  {
    id: '4',
    name: 'Riad Daria',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
    location: 'Meknes Medina, Morocco',
    checkIn: 'Mar 23, 2025',
    checkOut: 'Mar 25, 2025',
    nights: 2,
    roomType: 'Junior Suite',
    status: 'confirmed',
    price: '980 MAD',
    rating: 4.4,
    amenities: ['wifi', 'breakfast', 'courtyard', 'terrace'],
  },
  {
    id: '5',
    name: 'Dar Roumana',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=60',
    location: 'Talaa Kbira, Fes',
    checkIn: 'Mar 25, 2025',
    checkOut: 'Mar 28, 2025',
    nights: 3,
    roomType: 'Atlas Suite',
    status: 'confirmed',
    price: '2,450 MAD',
    rating: 4.8,
    amenities: ['wifi', 'breakfast', 'spa', 'terrace'],
  },
  {
    id: '6',
    name: 'Riad Le Calife',
    image:
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop&q=60',
    location: 'Fes Medina, Morocco',
    checkIn: 'Mar 28, 2025',
    checkOut: 'Mar 31, 2025',
    nights: 3,
    roomType: 'Terrace Suite',
    status: 'pending',
    price: '1,890 MAD',
    rating: 4.6,
    amenities: ['wifi', 'breakfast', 'hammam', 'terrace'],
  },
]

const activities: Activity[] = [
  {
    id: '1',
    name: 'Chouara Tannery Tour',
    image:
      'https://images.unsplash.com/photo-1577195717591-7b4d0e8a0e1a?w=800&auto=format&fit=crop&q=60',
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
    image:
      'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=60',
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
    image:
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=60',
    location: 'Volubilis',
    date: 'Mar 17, 2025',
    time: '9:00 AM',
    duration: '4 hours',
    status: 'wishlisted',
    price: '70 MAD',
    category: 'History',
  },
  {
    id: '4',
    name: 'Medina Artisan Workshop',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=60',
    location: 'Fes Medina',
    date: 'Mar 17, 2025',
    time: '2:00 PM',
    duration: '2.5 hours',
    status: 'booked',
    price: '120 MAD',
    category: 'Craft',
  },
  {
    id: '5',
    name: 'Meknes Heritage Walk',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60',
    location: 'Meknes',
    date: 'Mar 18, 2025',
    time: '9:30 AM',
    duration: '3 hours',
    status: 'booked',
    price: '90 MAD',
    category: 'Culture',
  },
  {
    id: '6',
    name: 'Atlas Cedar Forest Hike',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=60',
    location: 'Ifrane',
    date: 'Mar 18, 2025',
    time: '1:00 PM',
    duration: '4 hours',
    status: 'wishlisted',
    price: '180 MAD',
    category: 'Nature',
  },
  {
    id: '7',
    name: 'Zellij Tile Studio',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop&q=60',
    location: 'Fes',
    date: 'Mar 19, 2025',
    time: '11:00 AM',
    duration: '1.5 hours',
    status: 'booked',
    price: '140 MAD',
    category: 'Craft',
  },
  {
    id: '8',
    name: 'Night Food Tour',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
    location: 'Fes Medina',
    date: 'Mar 19, 2025',
    time: '7:30 PM',
    duration: '2 hours',
    status: 'wishlisted',
    price: '160 MAD',
    category: 'Food',
  },
  {
    id: '9',
    name: 'Sidi Harazem Thermal Spa',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60',
    location: 'Sidi Harazem',
    date: 'Mar 20, 2025',
    time: '10:30 AM',
    duration: '2 hours',
    status: 'wishlisted',
    price: '130 MAD',
    category: 'Wellness',
  },
]

const statusStyles: Record<string, string> = {
  confirmed: 'bg-orange-500/15 text-orange-600',
  pending: 'bg-amber-500/15 text-amber-700',
  cancelled: 'bg-rose-500/15 text-rose-600',
  booked: 'bg-orange-500/15 text-orange-600',
  wishlisted: 'bg-zinc-200 text-zinc-600',
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4'
      onClick={onClose}
    >
      <div
        className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-zinc-200 bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-zinc-100 px-5 py-4'>
          <h3 className='text-lg font-semibold text-zinc-900'>{title}</h3>
          <button
            onClick={onClose}
            className='rounded-full border border-zinc-200 p-2 text-zinc-500 transition hover:bg-zinc-50'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
        <div className='p-5'>{children}</div>
      </div>
    </div>
  )
}

export default function UserTrips() {
  const [activeTab, setActiveTab] = useState<'transport' | 'riads' | 'activities'>('transport')
  const [transportData] = useState(transports)
  const [riadData] = useState(riads)
  const [activityData, setActivityData] = useState(activities)

  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null)
  const [selectedRiadId, setSelectedRiadId] = useState<string | null>(null)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  const [activeTransportModal, setActiveTransportModal] = useState<Transport | null>(null)
  const [activeRiadModal, setActiveRiadModal] = useState<RiadBooking | null>(null)
  const [activeActivityModal, setActiveActivityModal] = useState<Activity | null>(null)

  const [lastAction, setLastAction] = useState<string | null>(null)

  const [successPopup, setSuccessPopup] = useState<{
    open: boolean
    title: string
    message: string
  } | null>(null)

  const handleActivityBooking = (activityId: string) => {
    const currentActivity = activityData.find((activity) => activity.id === activityId)
    if (!currentActivity) return

    setActivityData((prev) =>
      prev.map((activity) =>
        activity.id === activityId ? { ...activity, status: 'booked' } : activity,
      ),
    )

    const updatedActivity = { ...currentActivity, status: 'booked' as const }

    setActiveActivityModal((prev) =>
      prev && prev.id === activityId ? updatedActivity : prev,
    )

    setSelectedActivityId(activityId)
    setLastAction('Booked activity and added it to your itinerary.')
    setSuccessPopup({
      open: true,
      title: 'Activity booked',
      message: `${updatedActivity.name} has been added to your itinerary.`,
    })
  }

  const handleTransportBooking = (transport: Transport) => {
    setLastAction(`Booking confirmed for ${transport.route}.`)
    setSuccessPopup({
      open: true,
      title: 'Transport booked',
      message: `${transport.route} has been confirmed successfully.`,
    })
  }

  const handleRiadBooking = (riad: RiadBooking) => {
    setLastAction(`Booking confirmed for ${riad.name}.`)
    setSuccessPopup({
      open: true,
      title: 'Stay booked',
      message: `${riad.name} has been confirmed successfully.`,
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>Trip Hub</h2>
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
              <p className='text-sm text-zinc-500'>
                Automatically sync confirmations from your inbox
              </p>
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
            { key: 'transport', label: 'Transport', icon: Car, count: transportData.length },
            { key: 'riads', label: 'Riads', icon: Hotel, count: riadData.length },
            { key: 'activities', label: 'Activities', icon: Ticket, count: activityData.length },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${activeTab === tab.key
                ? 'bg-orange-500 text-white'
                : 'border border-zinc-200 bg-white text-zinc-600'
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
            <input
              placeholder='Search bookings...'
              className='h-10 w-full rounded-full border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-600 sm:w-48'
            />
          </div>
          <button className='rounded-full border border-zinc-200 p-2 text-zinc-600'>
            <Filter className='h-4 w-4' />
          </button>
        </div>
      </div>

      {lastAction && (
        <div className='rounded-[18px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700'>
          {lastAction}
        </div>
      )}

      {activeTab === 'transport' && (
        <div className='space-y-4'>
          {transportData.map((transport) => {
            const isSelected = selectedTransportId === transport.id

            return (
              <div
                key={transport.id}
                className={`cursor-pointer rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md ${isSelected ? 'ring-2 ring-orange-200' : ''
                  }`}
                onClick={() => {
                  setSelectedTransportId(isSelected ? null : transport.id)
                  setLastAction(`Opened transport details for ${transport.route}.`)
                }}
              >
                <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='flex items-center gap-6'>
                    <div className='hidden h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 sm:flex'>
                      <Car className='h-6 w-6' />
                    </div>

                    <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-3'>
                      <div>
                        <p className='text-xl font-semibold text-zinc-900 sm:text-2xl'>
                          {transport.from}
                        </p>
                        <p className='text-sm text-zinc-500'>Departure</p>
                        <p className='mt-1 text-sm font-semibold text-zinc-900'>
                          {transport.departure}
                        </p>
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
                        <p className='text-xl font-semibold text-zinc-900 sm:text-2xl'>
                          {transport.to}
                        </p>
                        <p className='text-sm text-zinc-500'>Arrival</p>
                        <p className='mt-1 text-sm font-semibold text-zinc-900'>
                          {transport.arrival}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-4 lg:flex-col lg:items-end'>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[transport.status]}`}
                    >
                      {transport.status === 'confirmed' && (
                        <CheckCircle2 className='mr-1 inline h-3 w-3' />
                      )}
                      {transport.status === 'pending' && (
                        <AlertCircle className='mr-1 inline h-3 w-3' />
                      )}
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

                <div className='mt-6 flex flex-col gap-4 border-t border-zinc-100 pt-6'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-2 text-sm font-medium text-zinc-500'>
                      <Calendar className='h-4 w-4 text-orange-500' />
                      {transport.date}
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        className='flex-1 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 sm:flex-none'
                        onClick={(event) => {
                          event.stopPropagation()
                          setActiveTransportModal(transport)
                          setLastAction(`Viewing details for ${transport.route}.`)
                        }}
                      >
                        View Details
                      </button>

                      <button
                        className='flex-1 rounded-full bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md sm:flex-none'
                        onClick={(event) => {
                          event.stopPropagation()
                          handleTransportBooking(transport)
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                  {isSelected && (
                    <div className='mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-600'>
                      <button
                        className='rounded-full border border-zinc-200 px-3 py-1'
                        onClick={(event) => {
                          event.stopPropagation()
                          setLastAction(`Viewing ticket for ${transport.route}.`)
                        }}
                      >
                        View Ticket
                      </button>
                      <button
                        className='rounded-full border border-zinc-200 px-3 py-1'
                        onClick={(event) => {
                          event.stopPropagation()
                          setLastAction(`Shared ${transport.route} itinerary.`)
                        }}
                      >
                        Share
                      </button>
                      <button
                        className='rounded-full border border-zinc-200 px-3 py-1'
                        onClick={(event) => {
                          event.stopPropagation()
                          setLastAction(`Added ${transport.route} to calendar.`)
                        }}
                      >
                        Add to Calendar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'riads' && (
        <div className='space-y-4'>
          {riadData.map((riad) => {
            const isSelected = selectedRiadId === riad.id

            return (
              <div
                key={riad.id}
                className={`cursor-pointer overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-sm transition hover:shadow-md ${isSelected ? 'ring-2 ring-orange-200' : ''
                  }`}
                onClick={() => {
                  setSelectedRiadId(isSelected ? null : riad.id)
                  setLastAction(`Opened stay details for ${riad.name}.`)
                }}
              >
                <div className='flex flex-col md:flex-row'>
                  <img
                    src={riad.image}
                    alt={riad.name}
                    className='h-48 w-full object-cover md:h-auto md:w-64'
                  />

                  <div className='flex-1 space-y-4 p-6'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h3 className='text-xl font-semibold text-zinc-900'>{riad.name}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[riad.status]}`}
                      >
                        {riad.status}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-zinc-500'>
                      <MapPin className='h-4 w-4' />
                      {riad.location}
                    </div>

                    <div className='flex items-center gap-1'>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < Math.floor(riad.rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-zinc-300'
                            }`}
                        />
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
                      <div className='flex items-center gap-4 text-sm text-zinc-500'>
                        <span>
                          Check-in: <span className='font-medium text-zinc-900'>{riad.checkIn}</span>
                        </span>
                        <span className='hidden text-zinc-300 sm:inline'>•</span>
                        <span>
                          Check-out:{' '}
                          <span className='font-medium text-zinc-900'>{riad.checkOut}</span>
                        </span>
                      </div>
                    </div>

                    <div className='mt-6 flex flex-col gap-4 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                      <span className='text-2xl font-bold text-zinc-900'>{riad.price}</span>

                      <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                        <button
                          className='flex-1 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 min-[400px]:flex-none'
                          onClick={(event) => {
                            event.stopPropagation()
                            setActiveRiadModal(riad)
                            setLastAction(`Viewing details for ${riad.name}.`)
                          }}
                        >
                          View Details
                        </button>

                        <button
                          className='flex-1 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md min-[400px]:flex-none'
                          onClick={(event) => {
                            event.stopPropagation()
                            handleRiadBooking(riad)
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className='mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-600'>
                        <button
                          className='rounded-full border border-zinc-200 px-3 py-1'
                          onClick={(event) => {
                            event.stopPropagation()
                            setLastAction(`Opened voucher for ${riad.name}.`)
                          }}
                        >
                          View Voucher
                        </button>
                        <button
                          className='rounded-full border border-zinc-200 px-3 py-1'
                          onClick={(event) => {
                            event.stopPropagation()
                            setLastAction(`Messaged host at ${riad.name}.`)
                          }}
                        >
                          Message Host
                        </button>
                        <button
                          className='rounded-full border border-zinc-200 px-3 py-1'
                          onClick={(event) => {
                            event.stopPropagation()
                            setLastAction(`Requested upgrade for ${riad.name}.`)
                          }}
                        >
                          Request Upgrade
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {activityData.map((activity) => {
            const isSelected = selectedActivityId === activity.id

            return (
              <div
                key={activity.id}
                className={`cursor-pointer overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-sm transition hover:shadow-md ${isSelected ? 'ring-2 ring-orange-200' : ''
                  }`}
                onClick={() => {
                  setSelectedActivityId(isSelected ? null : activity.id)
                  setLastAction(`Opened activity details for ${activity.name}.`)
                }}
              >
                <div className='relative h-40'>
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[activity.status]}`}
                  >
                    {activity.status}
                  </span>
                  <span className='absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-600'>
                    {activity.category}
                  </span>
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

                  <div className='mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                    <span className='text-xl font-bold text-zinc-900'>{activity.price}</span>

                    <div className='flex items-center gap-2'>
                      <button
                        className='flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 sm:flex-none'
                        onClick={(event) => {
                          event.stopPropagation()
                          setActiveActivityModal(activity)
                          setLastAction(`Viewing details for ${activity.name}.`)
                        }}
                      >
                        View Details
                      </button>

                      <button
                        className='flex-1 rounded-full bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md sm:flex-none'
                        onClick={(event) => {
                          event.stopPropagation()
                          if (activity.status === 'booked') {
                            setSuccessPopup({
                              open: true,
                              title: 'Already booked',
                              message: `${activity.name} is already in your itinerary.`,
                            })
                            setLastAction(`Viewing booking for ${activity.name}.`)
                          } else {
                            handleActivityBooking(activity.id)
                          }
                        }}
                      >
                        {activity.status === 'booked' ? 'View Booking' : 'Book Now'}
                      </button>
                    </div>
                  </div>

                  {isSelected && (
                    <div className='mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-600'>
                      <button
                        className='rounded-full border border-zinc-200 px-3 py-1'
                        onClick={(event) => {
                          event.stopPropagation()
                          setLastAction(`Added ${activity.name} to favorites.`)
                        }}
                      >
                        Save to Favorites
                      </button>
                      <button
                        className='rounded-full border border-zinc-200 px-3 py-1'
                        onClick={(event) => {
                          event.stopPropagation()
                          setLastAction(`Shared ${activity.name} with your group.`)
                        }}
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={!!activeTransportModal}
        onClose={() => setActiveTransportModal(null)}
        title='Transport Details'
      >
        {activeTransportModal && (
          <div className='space-y-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h4 className='text-2xl font-semibold text-zinc-900'>
                  {activeTransportModal.route}
                </h4>
                <p className='text-sm text-zinc-500'>{activeTransportModal.type}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[activeTransportModal.status]}`}
              >
                {activeTransportModal.status}
              </span>
            </div>

            <div className='grid gap-4 rounded-[20px] bg-zinc-50 p-4 sm:grid-cols-2'>
              <div>
                <p className='text-sm text-zinc-500'>From</p>
                <p className='font-semibold text-zinc-900'>{activeTransportModal.from}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>To</p>
                <p className='font-semibold text-zinc-900'>{activeTransportModal.to}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Departure</p>
                <p className='font-semibold text-zinc-900'>
                  {activeTransportModal.date} • {activeTransportModal.departure}
                </p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Arrival</p>
                <p className='font-semibold text-zinc-900'>{activeTransportModal.arrival}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Passengers</p>
                <p className='font-semibold text-zinc-900'>{activeTransportModal.passengers}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Price</p>
                <p className='font-semibold text-zinc-900'>{activeTransportModal.price}</p>
              </div>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                className='rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700'
                onClick={() => setActiveTransportModal(null)}
              >
                Close
              </button>
              <button
                className='rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white'
                onClick={() => handleTransportBooking(activeTransportModal)}
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!activeRiadModal}
        onClose={() => setActiveRiadModal(null)}
        title='Riad Details'
      >
        {activeRiadModal && (
          <div className='space-y-5'>
            <img
              src={activeRiadModal.image}
              alt={activeRiadModal.name}
              className='h-64 w-full rounded-[20px] object-cover'
            />

            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h4 className='text-2xl font-semibold text-zinc-900'>{activeRiadModal.name}</h4>
                <p className='mt-1 flex items-center gap-2 text-sm text-zinc-500'>
                  <MapPin className='h-4 w-4' />
                  {activeRiadModal.location}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[activeRiadModal.status]}`}
              >
                {activeRiadModal.status}
              </span>
            </div>

            <div className='flex items-center gap-1'>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${idx < Math.floor(activeRiadModal.rating)
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-zinc-300'
                    }`}
                />
              ))}
              <span className='ml-1 text-sm text-zinc-500'>{activeRiadModal.rating}</span>
            </div>

            <div className='grid gap-4 rounded-[20px] bg-zinc-50 p-4 sm:grid-cols-2'>
              <div>
                <p className='text-sm text-zinc-500'>Room Type</p>
                <p className='font-semibold text-zinc-900'>{activeRiadModal.roomType}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Nights</p>
                <p className='font-semibold text-zinc-900'>{activeRiadModal.nights}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Check-in</p>
                <p className='font-semibold text-zinc-900'>{activeRiadModal.checkIn}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Check-out</p>
                <p className='font-semibold text-zinc-900'>{activeRiadModal.checkOut}</p>
              </div>
              <div className='sm:col-span-2'>
                <p className='text-sm text-zinc-500'>Price</p>
                <p className='text-xl font-semibold text-zinc-900'>{activeRiadModal.price}</p>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {activeRiadModal.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className='rounded-full border border-zinc-200 px-3 py-1 text-xs capitalize text-zinc-600'
                >
                  {amenity}
                </span>
              ))}
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                className='rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700'
                onClick={() => setActiveRiadModal(null)}
              >
                Close
              </button>
              <button
                className='rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white'
                onClick={() => handleRiadBooking(activeRiadModal)}
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!activeActivityModal}
        onClose={() => setActiveActivityModal(null)}
        title='Activity Details'
      >
        {activeActivityModal && (
          <div className='space-y-5'>
            <img
              src={activeActivityModal.image}
              alt={activeActivityModal.name}
              className='h-64 w-full rounded-[20px] object-cover'
            />

            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h4 className='text-2xl font-semibold text-zinc-900'>
                  {activeActivityModal.name}
                </h4>
                <p className='text-sm text-zinc-500'>{activeActivityModal.category}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[activeActivityModal.status]}`}
              >
                {activeActivityModal.status}
              </span>
            </div>

            <div className='grid gap-4 rounded-[20px] bg-zinc-50 p-4 sm:grid-cols-2'>
              <div>
                <p className='text-sm text-zinc-500'>Location</p>
                <p className='font-semibold text-zinc-900'>{activeActivityModal.location}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Date</p>
                <p className='font-semibold text-zinc-900'>{activeActivityModal.date}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Time</p>
                <p className='font-semibold text-zinc-900'>{activeActivityModal.time}</p>
              </div>
              <div>
                <p className='text-sm text-zinc-500'>Duration</p>
                <p className='font-semibold text-zinc-900'>{activeActivityModal.duration}</p>
              </div>
              <div className='sm:col-span-2'>
                <p className='text-sm text-zinc-500'>Price</p>
                <p className='text-xl font-semibold text-zinc-900'>{activeActivityModal.price}</p>
              </div>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                className='rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700'
                onClick={() => setActiveActivityModal(null)}
              >
                Close
              </button>

              <button
                className='rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white'
                onClick={() => {
                  if (activeActivityModal.status === 'booked') {
                    setSuccessPopup({
                      open: true,
                      title: 'Already booked',
                      message: `${activeActivityModal.name} is already in your itinerary.`,
                    })
                    setLastAction(`Viewing booking for ${activeActivityModal.name}.`)
                  } else {
                    handleActivityBooking(activeActivityModal.id)
                  }
                }}
              >
                {activeActivityModal.status === 'booked' ? 'View Booking' : 'Book Now'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {successPopup?.open && (
        <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4'>
          <div
            className='w-full max-w-md rounded-[28px] border border-emerald-200 bg-white p-6 shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-end'>
              <button
                onClick={() => setSuccessPopup(null)}
                className='rounded-full border border-zinc-200 p-2 text-zinc-500 transition hover:bg-zinc-50'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='flex flex-col items-center text-center'>
              <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner'>
                <PartyPopper className='h-10 w-10' />
              </div>

              <h3 className='text-2xl font-bold text-zinc-900'>{successPopup.title}</h3>
              <p className='mt-2 text-sm leading-6 text-zinc-500'>{successPopup.message}</p>

              <div className='mt-6 flex w-full flex-col gap-3 sm:flex-row'>
                <button
                  onClick={() => setSuccessPopup(null)}
                  className='flex-1 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50'
                >
                  Close
                </button>

                <button
                  onClick={() => setSuccessPopup(null)}
                  className='flex-1 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600'
                >
                  Perfect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}