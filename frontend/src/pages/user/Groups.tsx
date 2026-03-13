import { useState } from 'react'
import { MapPin, Users, Check, X, Calendar, UserPlus, Info } from 'lucide-react'

interface Member {
  id: string
  name: string
  avatar: string
  role: 'admin' | 'member'
}

interface Group {
  id: string
  name: string
  destination: string
  image: string
  dates: string
  description: string
  members: Member[]
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Morocco Summer \'25',
    destination: 'Marrakech',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&auto=format&fit=crop&q=60',
    dates: 'Jul 10 - Jul 24, 2025',
    description: 'A two week adventure exploring the red city, staying in traditional riads, and enjoying the vibrant souks.',
    members: [
      { id: 'm1', name: 'Zaki', avatar: 'https://i.pravatar.cc/150?u=zaki', role: 'admin' },
      { id: 'm2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'member' },
      { id: 'm3', name: 'Karim', avatar: 'https://i.pravatar.cc/150?u=karim', role: 'member' },
      { id: 'm4', name: 'Youssef', avatar: 'https://i.pravatar.cc/150?u=youssef', role: 'member' },
    ]
  },
  {
    id: '2',
    name: 'Atlas Hiking Expedition',
    destination: 'Atlas Mountains',
    image: 'https://images.unsplash.com/photo-1552688468-1bd24269eadd?w=800&auto=format&fit=crop&q=60',
    dates: 'Sep 05 - Sep 12, 2025',
    description: 'Summit Mount Toubkal and explore the incredible Berber villages scattered across the High Atlas.',
    members: [
      { id: 'm5', name: 'Amine', avatar: 'https://i.pravatar.cc/150?u=amine', role: 'admin' },
      { id: 'm6', name: 'Omar', avatar: 'https://i.pravatar.cc/150?u=omar', role: 'member' },
      { id: 'm7', name: 'Lina', avatar: 'https://i.pravatar.cc/150?u=lina', role: 'member' },
    ]
  },
  {
    id: '3',
    name: 'Surf Camp Taghazout',
    destination: 'Taghazout',
    image: 'https://images.unsplash.com/photo-1526360341774-633009581ec0?w=800&auto=format&fit=crop&q=60',
    dates: 'Aug 01 - Aug 10, 2025',
    description: 'Catching waves along the Atlantic coast. Beginners and pros all welcome! Surfboards included.',
    members: [
      { id: 'm8', name: 'Tarik', avatar: 'https://i.pravatar.cc/150?u=tarik', role: 'admin' },
      { id: 'm9', name: 'Sophia', avatar: 'https://i.pravatar.cc/150?u=sophia', role: 'member' },
      { id: 'm10', name: 'Nadia', avatar: 'https://i.pravatar.cc/150?u=nadia', role: 'member' },
      { id: 'm11', name: 'Ilias', avatar: 'https://i.pravatar.cc/150?u=ilias', role: 'member' },
      { id: 'm12', name: 'Rania', avatar: 'https://i.pravatar.cc/150?u=rania', role: 'member' },
    ]
  },
  {
    id: '4',
    name: 'Sahara Desert Tour',
    destination: 'Merzouga',
    image: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&auto=format&fit=crop&q=60',
    dates: 'Oct 15 - Oct 20, 2025',
    description: 'Camel trekking, sleeping under the stars in luxury desert camps, and experiencing the majestic dunes.',
    members: [
      { id: 'm13', name: 'Hamza', avatar: 'https://i.pravatar.cc/150?u=hamza', role: 'admin' },
      { id: 'm14', name: 'Fatima', avatar: 'https://i.pravatar.cc/150?u=fatima', role: 'member' },
      { id: 'm15', name: 'Aymane', avatar: 'https://i.pravatar.cc/150?u=aymane', role: 'member' },
    ]
  },
  {
    id: '5',
    name: 'Chefchaouen Photography',
    destination: 'Chefchaouen',
    image: 'https://images.unsplash.com/photo-1553524913-68d37aa6ed2c?w=800&auto=format&fit=crop&q=60',
    dates: 'May 12 - May 16, 2025',
    description: 'A photography-focused trip to the famous Blue Pearl of Morocco. Exploring the medina and nearby waterfalls.',
    members: [
      { id: 'm16', name: 'Salma', avatar: 'https://i.pravatar.cc/150?u=salma', role: 'admin' },
      { id: 'm17', name: 'Kenza', avatar: 'https://i.pravatar.cc/150?u=kenza', role: 'member' },
    ]
  },
]

export default function UserGroups() {
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({})
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const handleJoin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setJoinedGroups(prev => ({ ...prev, [id]: true }))
  }

  const handleCardClick = (group: Group) => {
    setSelectedGroup(group)
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
        <div>
          <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>Discover Groups</h2>
          <p className='text-sm text-zinc-500 mt-1'>Find and join upcoming public travel groups</p>
        </div>
      </div>

      {/* Grid of Groups */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {mockGroups.map((group) => {
          const isJoined = joinedGroups[group.id]

          return (
            <div
              key={group.id}
              onClick={() => handleCardClick(group)}
              className='overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer group flex flex-col h-full'
            >
              {/* Group Image */}
              <div className='h-48 w-full relative overflow-hidden'>
                <img
                  src={group.image}
                  alt={group.name}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className='text-lg font-bold text-white leading-tight'>{group.name}</h3>
                </div>
              </div>

              <div className='p-5 flex flex-col flex-1'>
                <div className='flex items-center justify-between text-sm text-zinc-500 mb-4'>
                  <div className='flex items-center gap-1.5'>
                    <MapPin className='h-4 w-4 text-orange-500 shrink-0' />
                    <span className="truncate">{group.destination}</span>
                  </div>
                </div>

                {/* Avatar stack preview */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 3).map(m => (
                      <img key={m.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src={m.avatar} alt={m.name} />
                    ))}
                    {group.members.length > 3 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-zinc-100 text-xs font-medium text-zinc-600">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{group.members.length} going</span>
                </div>

                <div className='mt-5 pt-4 border-t border-zinc-50'>
                  <button
                    onClick={(e) => {
                      if (isJoined) {
                        e.stopPropagation();
                        // Optional: Unjoin logic if needed, but for presentation we can just leave it as joined
                      } else {
                        handleJoin(e, group.id)
                      }
                    }}
                    disabled={isJoined}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${isJoined
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-transparent'
                      }`}
                  >
                    {isJoined && <Check className="h-4 w-4" />}
                    {isJoined ? 'Joined' : 'Join Group'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Group Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedGroup(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedGroup(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header / Cover Image */}
            <div className="h-64 sm:h-72 w-full relative shrink-0">
              <img src={selectedGroup.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/10">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedGroup.dates}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{selectedGroup.name}</h2>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  {selectedGroup.destination}
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-base font-semibold text-zinc-900 flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-zinc-400" />
                      About this trip
                    </h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {selectedGroup.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      onClick={(e) => handleJoin(e, selectedGroup.id)}
                      disabled={joinedGroups[selectedGroup.id]}
                      className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${joinedGroups[selectedGroup.id]
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
                        }`}
                    >
                      {joinedGroups[selectedGroup.id] ? 'You are going!' : 'Join this Group'}
                    </button>
                  </div>
                </div>

                {/* Right Column - Participants */}
                <div className="w-full md:w-64 shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-zinc-400" />
                      Participants
                    </h4>
                    <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                      {selectedGroup.members.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedGroup.members.map(member => (
                      <div key={member.id} className="flex items-center gap-3 group">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">
                            {member.name}
                          </p>
                          <p className={`text-xs capitalize ${member.role === 'admin' ? 'text-orange-500 font-medium' : 'text-zinc-500'}`}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}

                    <button className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-zinc-200 text-zinc-500 text-xs font-medium hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Invite Friends
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
