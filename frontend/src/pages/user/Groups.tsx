import { useState } from 'react'
import { Calendar, Camera, MessageSquare, Plus, Send, Settings, Share2, UserPlus, Users } from 'lucide-react'

interface GroupMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

interface TripGroup {
  id: string
  name: string
  destination: string
  image: string
  dates: string
  members: GroupMember[]
  budget: { target: number; collected: number }
  polls: number
  photos: number
  messages: number
}

const groups: TripGroup[] = [
  {
    id: '1',
    name: 'Fes Medina Discovery',
    destination: 'Fes, Morocco',
    image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=800&auto=format&fit=crop&q=60',
    dates: 'Mar 15 - Mar 18, 2025',
    members: [
      { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', role: 'admin' },
      { id: '2', name: 'Fatima Zahra', email: 'fatima@email.com', role: 'member' },
      { id: '3', name: 'Youssef Amrani', email: 'youssef@email.com', role: 'member' },
      { id: '4', name: 'Karim Idrissi', email: 'karim@email.com', role: 'member' },
    ],
    budget: { target: 8000, collected: 6000 },
    polls: 3,
    photos: 12,
    messages: 89,
  },
  {
    id: '2',
    name: 'Ifrane Nature Trip',
    destination: 'Ifrane, Morocco',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=60',
    dates: 'Apr 5 - Apr 7, 2025',
    members: [
      { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', role: 'admin' },
      { id: '5', name: 'Sara Tazi', email: 'sara@email.com', role: 'member' },
    ],
    budget: { target: 5000, collected: 2500 },
    polls: 2,
    photos: 0,
    messages: 24,
  },
]

const messages = [
  { id: '1', user: 'Fatima', content: 'I found a great guide for the Medina tour!', time: '2 min ago' },
  { id: '2', user: 'Youssef', content: 'Perfect! How much does he charge?', time: '5 min ago' },
  { id: '3', user: 'Karim', content: 'Should we book the cooking class at the riad?', time: '10 min ago' },
]

export default function UserGroups() {
  const [selectedGroup, setSelectedGroup] = useState<TripGroup>(groups[0])
  const [messageInput, setMessageInput] = useState('')

  const progress = Math.round((selectedGroup.budget.collected / selectedGroup.budget.target) * 100)

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-zinc-900'>Group Collaboration</h2>
          <p className='text-sm text-zinc-500'>Plan trips together with friends and family</p>
        </div>
        <button className='flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white'>
          <Plus className='h-4 w-4' />
          Create New Group
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]'>
        <div className='space-y-3'>
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full rounded-[18px] border p-3 text-left ${
                selectedGroup.id === group.id ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-200 bg-white'
              }`}
            >
              <div className='flex gap-3'>
                <img src={group.image} alt={group.name} className='h-16 w-16 rounded-lg object-cover' />
                <div className='flex-1'>
                  <div className='text-sm font-semibold text-zinc-900'>{group.name}</div>
                  <div className='text-xs text-zinc-500'>{group.destination}</div>
                  <div className='mt-2 text-xs text-zinc-400'>{group.members.length} members</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className='space-y-6'>
          <div className='relative overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-sm'>
            <img src={selectedGroup.image} alt={selectedGroup.name} className='h-40 w-full object-cover' />
            <div className='absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent' />
            <div className='absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h3 className='text-xl font-semibold text-zinc-900'>{selectedGroup.name}</h3>
                <div className='mt-1 flex flex-wrap items-center gap-4 text-xs text-zinc-600'>
                  <span className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    {selectedGroup.dates}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='h-4 w-4' />
                    {selectedGroup.members.length} members
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button className='rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs text-zinc-600'>
                  <UserPlus className='h-4 w-4' />
                </button>
                <button className='rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs text-zinc-600'>
                  <Share2 className='h-4 w-4' />
                </button>
                <button className='rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs text-zinc-600'>
                  <Settings className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>

          <div className='grid gap-4 lg:grid-cols-3'>
            <div className='rounded-[18px] border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-2'>
              <div className='text-sm font-semibold text-zinc-900'>Members</div>
              <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {selectedGroup.members.map((member) => (
                  <div key={member.id} className='rounded-xl bg-zinc-50 p-3'>
                    <div className='text-sm font-medium text-zinc-900'>{member.name}</div>
                    <div className='text-xs text-zinc-500'>{member.email}</div>
                    <span className='mt-2 inline-flex rounded-full bg-orange-500/15 px-2 py-1 text-xs text-orange-600'>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='rounded-[18px] border border-zinc-200 bg-white p-4 shadow-sm'>
                <div className='text-sm font-semibold text-zinc-900'>Budget</div>
                <p className='mt-1 text-xs text-zinc-500'>
                  {selectedGroup.budget.collected.toLocaleString()} / {selectedGroup.budget.target.toLocaleString()} MAD
                </p>
                <div className='mt-3 h-2 rounded-full bg-zinc-100'>
                  <div className='h-full rounded-full bg-orange-500' style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className='rounded-[18px] border border-zinc-200 bg-white p-4 shadow-sm'>
                <div className='flex items-center justify-between text-xs text-zinc-500'>
                  <span className='flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' /> Messages
                  </span>
                  <span className='text-zinc-900'>{selectedGroup.messages}</span>
                </div>
                <div className='mt-2 flex items-center justify-between text-xs text-zinc-500'>
                  <span className='flex items-center gap-2'>
                    <Camera className='h-4 w-4' /> Photos
                  </span>
                  <span className='text-zinc-900'>{selectedGroup.photos}</span>
                </div>
                <div className='mt-2 flex items-center justify-between text-xs text-zinc-500'>
                  <span className='flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' /> Polls
                  </span>
                  <span className='text-zinc-900'>{selectedGroup.polls}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[18px] border border-zinc-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div className='text-sm font-semibold text-zinc-900'>Group Chat</div>
              <span className='rounded-full bg-orange-500/15 px-2 py-1 text-xs text-orange-600'>Live</span>
            </div>
            <div className='mt-4 space-y-3'>
              {messages.map((message) => (
                <div key={message.id} className='rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600'>
                  <div className='flex items-center justify-between text-xs text-zinc-400'>
                    <span>{message.user}</span>
                    <span>{message.time}</span>
                  </div>
                  <div className='mt-1 text-zinc-700'>{message.content}</div>
                </div>
              ))}
            </div>
            <div className='mt-4 flex gap-2'>
              <input
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                placeholder='Type a message...'
                className='h-10 flex-1 rounded-full border border-zinc-200 px-4 text-sm text-zinc-600'
              />
              <button className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white'>
                <Send className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
