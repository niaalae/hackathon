import { useMemo, useState } from 'react'
import {
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react'

interface UserRow {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
  role: 'user' | 'premium' | 'admin'
  trips: number
  joined: string
  lastActive: string
}

const users: UserRow[] = [
  {
    id: '1',
    name: 'Ahmed Benali',
    email: 'ahmed@email.com',
    status: 'active',
    role: 'premium',
    trips: 12,
    joined: 'Jan 15, 2024',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    email: 'fatima@email.com',
    status: 'active',
    role: 'user',
    trips: 5,
    joined: 'Feb 20, 2024',
    lastActive: '1 day ago',
  },
  {
    id: '3',
    name: 'Youssef Amrani',
    email: 'youssef@email.com',
    status: 'active',
    role: 'premium',
    trips: 8,
    joined: 'Mar 10, 2024',
    lastActive: '5 hours ago',
  },
  {
    id: '4',
    name: 'Sara Tazi',
    email: 'sara@email.com',
    status: 'inactive',
    role: 'user',
    trips: 2,
    joined: 'Apr 5, 2024',
    lastActive: '2 weeks ago',
  },
  {
    id: '5',
    name: 'Karim Idrissi',
    email: 'karim@email.com',
    status: 'suspended',
    role: 'user',
    trips: 0,
    joined: 'May 12, 2024',
    lastActive: '1 month ago',
  },
  {
    id: '6',
    name: 'Nadia Bennani',
    email: 'nadia@email.com',
    status: 'active',
    role: 'admin',
    trips: 15,
    joined: 'Dec 1, 2023',
    lastActive: 'Just now',
  },
  {
    id: '7',
    name: 'Omar Fassi',
    email: 'omar@email.com',
    status: 'active',
    role: 'premium',
    trips: 20,
    joined: 'Nov 15, 2023',
    lastActive: '3 hours ago',
  },
  {
    id: '8',
    name: 'Laila Alami',
    email: 'laila@email.com',
    status: 'active',
    role: 'user',
    trips: 3,
    joined: 'Jun 22, 2024',
    lastActive: '1 day ago',
  },
]

const statusStyles: Record<UserRow['status'], string> = {
  active: 'bg-orange-500/15 text-orange-600',
  inactive: 'bg-zinc-200 text-zinc-600',
  suspended: 'bg-rose-500/15 text-rose-600',
}

const roleStyles: Record<UserRow['role'], string> = {
  user: 'bg-zinc-100 text-zinc-600',
  premium: 'bg-orange-500/15 text-orange-600',
  admin: 'bg-amber-500/20 text-amber-700',
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  )

  const toggleSelectUser = (id: string) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>User Management</h2>
        <p className='text-sm text-zinc-500'>Manage and monitor platform users</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          { label: 'Total Users', value: '512', icon: Users },
          { label: 'Active Users', value: '485', icon: UserCheck },
          { label: 'Premium Users', value: '124', icon: Shield },
          { label: 'New This Month', value: '34', icon: UserPlus },
        ].map((stat) => (
          <div key={stat.label} className='rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='rounded-xl bg-orange-500/15 p-3 text-orange-500'>
                <stat.icon className='h-5 w-5' />
              </div>
              <div>
                <p className='text-sm text-zinc-500'>{stat.label}</p>
                <p className='text-2xl font-semibold text-zinc-900'>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='rounded-[22px] border border-zinc-200 bg-white shadow-sm'>
        <div className='flex flex-col gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-base font-semibold text-zinc-900'>All Users</div>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search users...'
                className='h-10 w-60 rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-700'
              />
            </div>
            <button className='flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-600'>
              <Filter className='h-4 w-4' />
              Filter
            </button>
            <button className='flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-600'>
              <Download className='h-4 w-4' />
              Export
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='bg-zinc-50 text-xs uppercase tracking-wide text-zinc-400'>
              <tr>
                <th className='px-4 py-3'>
                  <input
                    type='checkbox'
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className='h-4 w-4 rounded border-zinc-300'
                  />
                </th>
                <th className='px-4 py-3'>User</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'>Role</th>
                <th className='px-4 py-3'>Trips</th>
                <th className='px-4 py-3'>Joined</th>
                <th className='px-4 py-3'>Last Active</th>
                <th className='px-4 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className='border-t border-zinc-200'>
                  <td className='px-4 py-4'>
                    <input
                      type='checkbox'
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className='h-4 w-4 rounded border-zinc-300'
                    />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-xs font-semibold text-orange-600'>
                        {user.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <div className='font-medium text-zinc-900'>{user.name}</div>
                        <div className='text-xs text-zinc-500'>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className='px-4 py-4 text-zinc-600'>{user.trips}</td>
                  <td className='px-4 py-4 text-zinc-600'>{user.joined}</td>
                  <td className='px-4 py-4 text-zinc-600'>{user.lastActive}</td>
                  <td className='px-4 py-4'>
                    <button className='rounded-full border border-zinc-200 p-2 text-zinc-400 hover:text-zinc-600'>
                      <MoreHorizontal className='h-4 w-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-5 py-4 text-sm text-zinc-500'>
          <div>
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <button className='rounded-full border border-zinc-200 px-3 py-1 text-zinc-500'>Prev</button>
            <button className='rounded-full bg-orange-500 px-3 py-1 text-white'>1</button>
            <button className='rounded-full border border-zinc-200 px-3 py-1 text-zinc-500'>2</button>
            <button className='rounded-full border border-zinc-200 px-3 py-1 text-zinc-500'>3</button>
            <button className='rounded-full border border-zinc-200 px-3 py-1 text-zinc-500'>Next</button>
          </div>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {[
          { label: 'Send email', icon: Mail, desc: 'Reach out with a newsletter or alert.' },
          { label: 'Change role', icon: Shield, desc: 'Upgrade to premium or admin.' },
          { label: 'Suspend user', icon: UserX, desc: 'Temporarily disable accounts.' },
        ].map((action) => (
          <div key={action.label} className='rounded-[20px] border border-zinc-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-orange-500/15 p-3 text-orange-500'>
                <action.icon className='h-5 w-5' />
              </div>
              <div>
                <div className='text-sm font-semibold text-zinc-900'>{action.label}</div>
                <div className='text-xs text-zinc-500'>{action.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
