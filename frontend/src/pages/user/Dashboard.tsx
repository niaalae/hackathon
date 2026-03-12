import { Link } from 'react-router-dom'
import { Compass, MapPin, Users, Wallet, Sparkles, Hotel } from 'lucide-react'

const trips = [
  {
    id: '1',
    title: 'Fes Medina Discovery',
    destination: 'Fes, Morocco',
    image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=800&auto=format&fit=crop&q=60',
    startDate: 'Mar 15',
    endDate: 'Mar 18',
    status: 'upcoming',
    members: ['Ahmed Benali', 'Fatima Zahra', 'Youssef Amrani'],
    budget: '4,500 MAD',
  },
  {
    id: '2',
    title: 'Meknes Heritage Tour',
    destination: 'Meknes, Morocco',
    image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&auto=format&fit=crop&q=60',
    startDate: 'Mar 10',
    endDate: 'Mar 12',
    status: 'ongoing',
    members: ['Ahmed Benali', 'Karim Idrissi'],
    budget: '2,800 MAD',
  },
  {
    id: '3',
    title: 'Ifrane & Azrou Nature',
    destination: 'Ifrane, Morocco',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=60',
    startDate: 'Apr 5',
    endDate: 'Apr 7',
    status: 'planning',
    members: ['Ahmed Benali', 'Fatima Zahra', 'Youssef Amrani', 'Karim Idrissi', 'Sara Tazi'],
    budget: '5,200 MAD',
  },
]

const activities = [
  {
    id: '1',
    type: 'trip',
    title: 'Trip planned',
    description: 'Fes Medina Discovery, Mar 15-18',
    time: '2 hours ago',
    user: 'You',
  },
  {
    id: '2',
    type: 'group',
    title: 'New member joined',
    description: 'Fatima joined "Ifrane Nature" trip',
    time: '5 hours ago',
    user: 'Fatima Zahra',
  },
  {
    id: '3',
    type: 'ai',
    title: 'AI suggestion',
    description: 'Found 3 riads near Bab Boujloud',
    time: 'Yesterday',
  },
  {
    id: '4',
    type: 'riad',
    title: 'Riad confirmed',
    description: 'Riad Fes Maya, 3 nights',
    time: '2 days ago',
    user: 'You',
  },
  {
    id: '5',
    type: 'activity',
    title: 'Activity added',
    description: 'Chouara Tannery visit added',
    time: '3 days ago',
    user: 'Youssef Amrani',
  },
]

const activityStyle: Record<string, string> = {
  trip: 'bg-orange-500/15 text-orange-600',
  riad: 'bg-amber-500/15 text-amber-600',
  activity: 'bg-orange-500/10 text-orange-600',
  group: 'bg-orange-500/20 text-orange-600',
  ai: 'bg-orange-500/10 text-orange-600',
}

const pins = [
  { id: 1, name: 'Fes Medina', x: 55, y: 35, status: 'upcoming' },
  { id: 2, name: 'Meknes', x: 35, y: 50, status: 'planning' },
  { id: 3, name: 'Volubilis', x: 25, y: 30, status: 'planning' },
  { id: 4, name: 'Ifrane', x: 70, y: 60, status: 'completed' },
  { id: 5, name: 'Azrou', x: 65, y: 70, status: 'completed' },
]

const pinStyles: Record<string, string> = {
  upcoming: 'bg-orange-500',
  ongoing: 'bg-orange-500',
  completed: 'bg-zinc-400',
  planning: 'bg-amber-500',
}

export default function UserDashboard() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>Dashboard</h2>
        <p className='text-sm text-zinc-500'>Welcome back! Explore the Fes-Meknes region.</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          { title: 'Total Trips', value: 8, change: '+2 this month', icon: Compass },
          { title: 'Places Visited', value: 15, change: 'Fes-Meknes region', icon: MapPin },
          { title: 'Travel Groups', value: 3, change: '+1 new member', icon: Users },
          { title: 'Total Spent', value: '12,450 MAD', change: '-15% vs last month', icon: Wallet },
        ].map((stat) => (
          <div key={stat.title} className='rounded-[20px] border border-zinc-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div className='space-y-2'>
                <p className='text-sm text-zinc-500'>{stat.title}</p>
                <p className='text-3xl font-semibold text-zinc-900'>{stat.value}</p>
                <p className='text-sm text-zinc-500'>{stat.change}</p>
              </div>
              <div className='rounded-xl bg-orange-500/15 p-3 text-orange-500'>
                <stat.icon className='h-6 w-6' />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-zinc-900'>Your Trips</h3>
            <Link to='/user/trips' className='text-sm text-orange-600 hover:underline'>
              View all
            </Link>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {trips.map((trip) => (
              <div key={trip.id} className='overflow-hidden rounded-[18px] border border-zinc-200 bg-white shadow-sm'>
                <img src={trip.image} alt={trip.title} className='h-32 w-full object-cover' />
                <div className='space-y-2 p-4'>
                  <div className='text-sm font-semibold text-zinc-900'>{trip.title}</div>
                  <div className='text-xs text-zinc-500'>{trip.destination}</div>
                  <div className='flex items-center justify-between text-xs text-zinc-500'>
                    <span>
                      {trip.startDate} - {trip.endDate}
                    </span>
                    <span className='rounded-full bg-orange-500/15 px-2 py-1 text-[10px] text-orange-600'>
                      {trip.status}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-xs text-zinc-500'>
                    <span>{trip.members.length} members</span>
                    <span className='font-semibold text-zinc-900'>{trip.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-[20px] border border-zinc-200 bg-white p-5 shadow-sm'>
          <h3 className='text-lg font-semibold text-zinc-900'>Recent Activity</h3>
          <div className='mt-4 space-y-4'>
            {activities.map((activity) => (
              <div key={activity.id} className='flex items-start gap-3'>
                <div className={`rounded-lg p-2 ${activityStyle[activity.type]}`}>
                  {activity.type === 'trip' && <Compass className='h-4 w-4' />}
                  {activity.type === 'riad' && <Hotel className='h-4 w-4' />}
                  {activity.type === 'activity' && <MapPin className='h-4 w-4' />}
                  {activity.type === 'group' && <Users className='h-4 w-4' />}
                  {activity.type === 'ai' && <Sparkles className='h-4 w-4' />}
                </div>
                <div className='flex-1'>
                  <div className='text-sm font-medium text-zinc-900'>{activity.title}</div>
                  <div className='text-sm text-zinc-500'>{activity.description}</div>
                  <div className='mt-1 text-xs text-zinc-400'>
                    {activity.user ? `${activity.user} - ` : ''}
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='rounded-[20px] border border-zinc-200 bg-white p-5 shadow-sm'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-zinc-900'>Fes-Meknes Region</h3>
          <Link to='/user/maps' className='text-sm text-orange-600 hover:underline'>
            Expand
          </Link>
        </div>
        <div className='mt-4 rounded-[16px] bg-zinc-50 p-4'>
          <div className='relative h-48 overflow-hidden rounded-lg bg-white'>
            <svg className='absolute inset-0 h-full w-full opacity-10' xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
                  <path d='M 40 0 L 0 0 0 40' fill='none' stroke='currentColor' strokeWidth='0.5' />
                </pattern>
              </defs>
              <rect width='100%' height='100%' fill='url(#grid)' />
            </svg>
            {pins.map((pin) => (
              <div
                key={pin.id}
                className='absolute -translate-x-1/2 -translate-y-1/2'
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <div className={`h-3 w-3 rounded-full ${pinStyles[pin.status]} ring-2 ring-white`} />
              </div>
            ))}
          </div>
          <div className='mt-4 flex flex-wrap gap-4 text-xs text-zinc-500'>
            <div className='flex items-center gap-2'>
              <span className='h-2.5 w-2.5 rounded-full bg-orange-500' />
              Upcoming
            </div>
            <div className='flex items-center gap-2'>
              <span className='h-2.5 w-2.5 rounded-full bg-amber-500' />
              Planning
            </div>
            <div className='flex items-center gap-2'>
              <span className='h-2.5 w-2.5 rounded-full bg-zinc-400' />
              Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
