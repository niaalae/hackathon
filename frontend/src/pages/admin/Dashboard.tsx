import {
  Activity,
  Compass,
  DollarSign,
  MapPin,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'

const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 145 },
  { month: 'Mar', users: 168 },
  { month: 'Apr', users: 192 },
  { month: 'May', users: 234 },
  { month: 'Jun', users: 278 },
  { month: 'Jul', users: 310 },
  { month: 'Aug', users: 345 },
  { month: 'Sep', users: 389 },
  { month: 'Oct', users: 420 },
  { month: 'Nov', users: 465 },
  { month: 'Dec', users: 512 },
]

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 14000 },
  { month: 'Apr', revenue: 18000 },
  { month: 'May', revenue: 16000 },
  { month: 'Jun', revenue: 20000 },
  { month: 'Jul', revenue: 22000 },
  { month: 'Aug', revenue: 21000 },
  { month: 'Sep', revenue: 24000 },
  { month: 'Oct', revenue: 26000 },
  { month: 'Nov', revenue: 28000 },
  { month: 'Dec', revenue: 32000 },
]

const tripsByDestination = [
  { name: 'Fes Medina', trips: 180 },
  { name: 'Meknes', trips: 120 },
  { name: 'Volubilis', trips: 95 },
  { name: 'Ifrane', trips: 85 },
  { name: 'Azrou', trips: 60 },
]

const recentUsers = [
  { name: 'Fatima Zahra', email: 'fatima@email.com', joined: '2 hours ago', trips: 3 },
  { name: 'Youssef Amrani', email: 'youssef@email.com', joined: '5 hours ago', trips: 1 },
  { name: 'Sara Tazi', email: 'sara@email.com', joined: '1 day ago', trips: 2 },
  { name: 'Karim Idrissi', email: 'karim@email.com', joined: '2 days ago', trips: 0 },
  { name: 'Nadia Bennani', email: 'nadia@email.com', joined: '3 days ago', trips: 5 },
]

const recentTrips = [
  { destination: 'Fes Medina', user: 'Ahmed Benali', status: 'active', budget: '4,500 MAD' },
  { destination: 'Meknes Heritage', user: 'Fatima Zahra', status: 'planning', budget: '2,800 MAD' },
  { destination: 'Ifrane Nature', user: 'Youssef Amrani', status: 'completed', budget: '3,200 MAD' },
  { destination: 'Volubilis Tour', user: 'Sara Tazi', status: 'active', budget: '1,500 MAD' },
]

const statusStyles: Record<string, string> = {
  active: 'bg-orange-500/15 text-orange-600',
  planning: 'bg-amber-500/15 text-amber-700',
  completed: 'bg-zinc-200 text-zinc-600',
}

export default function AdminDashboard() {
  const maxUsers = Math.max(...userGrowthData.map((d) => d.users))
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue))

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>Admin Dashboard</h2>
        <p className='text-sm text-zinc-500'>Fes-Meknes region platform overview</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            label: 'Total Users',
            value: '512',
            change: '+12.5%',
            icon: Users,
            trend: 'up',
          },
          {
            label: 'Active Trips',
            value: '184',
            change: '+8.2%',
            icon: Compass,
            trend: 'up',
          },
          {
            label: 'Revenue (MTD)',
            value: '32K MAD',
            change: '+18.3%',
            icon: DollarSign,
            trend: 'up',
          },
          {
            label: 'Conversion Rate',
            value: '4.2%',
            change: '-0.3%',
            icon: Activity,
            trend: 'down',
          },
        ].map((item) => (
          <div key={item.label} className='rounded-[20px] border border-zinc-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm text-zinc-500'>{item.label}</p>
                <p className='mt-1 text-3xl font-semibold text-zinc-900'>{item.value}</p>
                <div className={`mt-2 flex items-center gap-1 text-sm ${item.trend === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {item.trend === 'up' ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
                  <span>{item.change}</span>
                  <span className='text-zinc-400'>vs last month</span>
                </div>
              </div>
              <div className='rounded-xl bg-orange-500/15 p-3 text-orange-500'>
                <item.icon className='h-6 w-6' />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='rounded-[22px] border border-zinc-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-2 text-sm font-semibold text-zinc-800'>
            <Users className='h-4 w-4 text-orange-500' />
            User Growth
          </div>
          <div className='mt-4 flex h-56 items-end gap-2'>
            {userGrowthData.map((item) => (
              <div key={item.month} className='flex w-5 flex-col items-center gap-2'>
                <div
                  className='w-full rounded-full bg-orange-500/30'
                  style={{ height: `${Math.round((item.users / maxUsers) * 100)}%` }}
                />
                <span className='text-[10px] text-zinc-400'>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-[22px] border border-zinc-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-2 text-sm font-semibold text-zinc-800'>
            <DollarSign className='h-4 w-4 text-orange-500' />
            Revenue Overview (MAD)
          </div>
          <div className='mt-4 flex h-56 items-end gap-2'>
            {revenueData.map((item) => (
              <div key={item.month} className='flex w-5 flex-col items-center gap-2'>
                <div
                  className='w-full rounded-full bg-orange-500/40'
                  style={{ height: `${Math.round((item.revenue / maxRevenue) * 100)}%` }}
                />
                <span className='text-[10px] text-zinc-400'>{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='rounded-[22px] border border-zinc-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-2 text-sm font-semibold text-zinc-800'>
            <MapPin className='h-4 w-4 text-orange-500' />
            Top Destinations
          </div>
          <div className='mt-4 space-y-3'>
            {tripsByDestination.map((dest) => (
              <div key={dest.name} className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2 text-zinc-600'>
                  <span className='h-2.5 w-2.5 rounded-full bg-orange-500' />
                  {dest.name}
                </div>
                <span className='font-semibold text-zinc-900'>{dest.trips}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-[22px] border border-zinc-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-semibold text-zinc-800'>Recent Users</div>
            <span className='text-xs text-orange-600'>View all</span>
          </div>
          <div className='mt-4 space-y-4'>
            {recentUsers.map((user) => (
              <div key={user.email} className='flex items-center gap-3'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/15 text-xs font-semibold text-orange-600'>
                  {user.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <div className='flex-1'>
                  <div className='text-sm font-medium text-zinc-900'>{user.name}</div>
                  <div className='text-xs text-zinc-500'>{user.joined}</div>
                </div>
                <span className='rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600'>{user.trips} trips</span>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-[22px] border border-zinc-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-semibold text-zinc-800'>Recent Trips</div>
            <span className='text-xs text-orange-600'>View all</span>
          </div>
          <div className='mt-4 space-y-4'>
            {recentTrips.map((trip) => (
              <div key={trip.destination} className='flex items-center justify-between gap-3'>
                <div>
                  <div className='text-sm font-medium text-zinc-900'>{trip.destination}</div>
                  <div className='text-xs text-zinc-500'>{trip.user}</div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[trip.status]}`}>
                    {trip.status}
                  </span>
                  <span className='text-sm font-semibold text-zinc-900'>{trip.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
