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


export default function UserDashboard() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>Dashboard</h2>
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
                <p className='text-2xl font-semibold text-zinc-900 sm:text-3xl'>{stat.value}</p>
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


    </div>
  )
}
