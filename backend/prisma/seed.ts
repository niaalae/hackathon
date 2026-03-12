import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

async function upsertRoles() {
  await Promise.all(
    ['admin', 'partner', 'user'].map((role) =>
      prisma.role.upsert({
        where: { name: role },
        create: { name: role },
        update: {}
      })
    )
  )

  console.log('roles created')
}

async function upsertUsers() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('secret', 12),
      role: { connect: { name: 'admin' } }
    },
    update: {}
  })

  console.log('admin user created')
  console.log('email : admin@example.com')
  console.log('password : secret')
}

async function main() {
  await upsertRoles()
  await upsertUsers()

  console.log('Seeding completed')

  process.exit(0)
}
main()
