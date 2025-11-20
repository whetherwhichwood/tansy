import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo HOA
  const hoa = await prisma.hOA.upsert({
    where: { inviteCode: 'DEMO2025' },
    update: {},
    create: {
      name: 'Sunset Ridge HOA',
      address: '1234 Sunset Ridge Drive, Anytown, ST 12345',
      inviteCode: 'DEMO2025',
    },
  })

  // Create sample residents
  const residents = await Promise.all([
    prisma.resident.upsert({
      where: { email: 'sarah.johnson@email.com' },
      update: {},
      create: {
        hoaId: hoa.id,
        email: 'sarah.johnson@email.com',
        name: 'Sarah Johnson',
        address: '1234 Sunset Ridge Dr, Unit 101',
        isVerified: true,
        reputationScore: 85,
        badges: { "👍": 12, "💬": 8, "⏱️": 5 },
        avatar: 'SJ',
      },
    }),
    prisma.resident.upsert({
      where: { email: 'mike.chen@email.com' },
      update: {},
      create: {
        hoaId: hoa.id,
        email: 'mike.chen@email.com',
        name: 'Mike Chen',
        address: '1234 Sunset Ridge Dr, Unit 102',
        isVerified: true,
        reputationScore: 92,
        badges: { "👍": 15, "💬": 12, "⏱️": 8 },
        avatar: 'MC',
      },
    }),
    prisma.resident.upsert({
      where: { email: 'lisa.rodriguez@email.com' },
      update: {},
      create: {
        hoaId: hoa.id,
        email: 'lisa.rodriguez@email.com',
        name: 'Lisa Rodriguez',
        address: '1234 Sunset Ridge Dr, Unit 103',
        isVerified: true,
        reputationScore: 78,
        badges: { "👍": 9, "💬": 6, "⏱️": 4 },
        avatar: 'LR',
      },
    }),
    prisma.resident.upsert({
      where: { email: 'david.kim@email.com' },
      update: {},
      create: {
        hoaId: hoa.id,
        email: 'david.kim@email.com',
        name: 'David Kim',
        address: '1234 Sunset Ridge Dr, Unit 104',
        isVerified: true,
        reputationScore: 88,
        badges: { "👍": 11, "💬": 9, "⏱️": 6 },
        avatar: 'DK',
      },
    }),
    prisma.resident.upsert({
      where: { email: 'emma.wilson@email.com' },
      update: {},
      create: {
        hoaId: hoa.id,
        email: 'emma.wilson@email.com',
        name: 'Emma Wilson',
        address: '1234 Sunset Ridge Dr, Unit 105',
        isVerified: true,
        reputationScore: 95,
        badges: { "👍": 18, "💬": 14, "⏱️": 10 },
        avatar: 'EW',
      },
    }),
  ])

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        authorId: residents[0].id,
        hoaId: hoa.id,
        title: 'Need help moving a couch',
        description: 'Moving a heavy couch from my living room to the basement. Could use an extra pair of hands for about 30 minutes.',
        category: 'HELP_NEEDED',
        status: 'OPEN',
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[1].id,
        hoaId: hoa.id,
        title: 'Borrow a ladder',
        description: 'Need to clean my gutters this weekend. Anyone have a 6-foot ladder I could borrow?',
        category: 'BORROW_LEND',
        status: 'OPEN',
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[2].id,
        hoaId: hoa.id,
        title: 'Group buy: Costco toilet paper',
        description: 'Planning a Costco run for toilet paper. Anyone want to split a bulk pack? Much cheaper per roll.',
        category: 'GROUP_BUY',
        status: 'OPEN',
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[3].id,
        hoaId: hoa.id,
        title: 'Great handyman recommendation',
        description: 'Found an excellent handyman for small repairs. Very reasonable rates and does great work. DM me for contact info.',
        category: 'LOCAL_TIP',
        status: 'OPEN',
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[4].id,
        hoaId: hoa.id,
        title: 'Pet sitting needed',
        description: 'Going out of town next week. Need someone to feed my cat twice daily. Will pay $20/day.',
        category: 'HELP_NEEDED',
        status: 'CLAIMED',
        claimedById: residents[0].id,
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[0].id,
        hoaId: hoa.id,
        title: 'Borrow power drill',
        description: 'Need to hang some shelves. Anyone have a power drill I could borrow for a few hours?',
        category: 'BORROW_LEND',
        status: 'COMPLETED',
        claimedById: residents[1].id,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[1].id,
        hoaId: hoa.id,
        title: 'Group buy: Amazon Prime',
        description: 'Anyone interested in sharing an Amazon Prime membership? We can split the cost.',
        category: 'GROUP_BUY',
        status: 'CANCELLED',
      },
    }),
    prisma.post.create({
      data: {
        authorId: residents[2].id,
        hoaId: hoa.id,
        title: 'Best local pizza place',
        description: 'Mario\'s Pizza on Main Street is amazing! Great prices and they deliver to our complex.',
        category: 'LOCAL_TIP',
        status: 'OPEN',
      },
    }),
  ])

  // Create sample announcements
  await Promise.all([
    prisma.announcement.create({
      data: {
        hoaId: hoa.id,
        title: 'Pool Hours Update',
        content: 'The community pool will be open from 6 AM to 10 PM daily. Please remember to bring your key fob for access.',
        isPinned: true,
      },
    }),
    prisma.announcement.create({
      data: {
        hoaId: hoa.id,
        title: 'Monthly HOA Meeting',
        content: 'Join us for our monthly HOA meeting on the 15th at 7 PM in the community center. All residents welcome!',
        isPinned: true,
      },
    }),
    prisma.announcement.create({
      data: {
        hoaId: hoa.id,
        title: 'Garden Club Meeting',
        content: 'The Sunset Ridge Garden Club meets every Saturday at 9 AM in the community garden. New members always welcome!',
        isPinned: false,
      },
    }),
  ])

  console.log('Seed data created successfully!')
  console.log(`HOA: ${hoa.name}`)
  console.log(`Residents: ${residents.length}`)
  console.log(`Posts: ${posts.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })








