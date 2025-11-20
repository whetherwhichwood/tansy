import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@keeper.app' },
    update: {},
    create: {
      email: 'demo@keeper.app',
      name: 'Demo User',
    },
  })

  console.log('Created demo user:', demoUser.email)

  // Create sample items (warranties)
  const items = [
    {
      name: 'Samsung Refrigerator',
      category: 'APPLIANCE',
      purchaseDate: new Date('2023-01-15'),
      warrantyEndDate: new Date('2026-01-15'),
      purchasePrice: 1299.99,
      vendor: 'Best Buy',
      notes: 'Model RF28K9070SG',
    },
    {
      name: 'MacBook Pro 16"',
      category: 'ELECTRONICS',
      purchaseDate: new Date('2023-06-01'),
      warrantyEndDate: new Date('2024-06-01'),
      purchasePrice: 2499.00,
      vendor: 'Apple Store',
      notes: 'M2 Pro chip, 16GB RAM',
    },
    {
      name: 'Dyson V15 Vacuum',
      category: 'HOME_GOODS',
      purchaseDate: new Date('2023-03-20'),
      warrantyEndDate: new Date('2025-03-20'),
      purchasePrice: 649.99,
      vendor: 'Amazon',
      notes: 'Cordless stick vacuum',
    },
    {
      name: 'DeWalt Drill Set',
      category: 'TOOLS',
      purchaseDate: new Date('2022-11-10'),
      warrantyEndDate: new Date('2024-11-10'),
      purchasePrice: 199.99,
      vendor: 'Home Depot',
      notes: '20V MAX XR brushless',
    },
  ]

  for (const item of items) {
    await prisma.item.create({
      data: {
        ...item,
        userId: demoUser.id,
        status: 'ACTIVE',
      },
    })
  }

  // Create sample maintenance tasks
  const tasks = [
    {
      name: 'HVAC Filter Replacement',
      description: 'Replace air filter for heating/cooling system',
      category: 'HVAC',
      frequency: 'MONTHLY',
      nextDueDate: new Date('2024-02-01'),
      lastCompletedAt: new Date('2024-01-01'),
    },
    {
      name: 'Smoke Detector Battery Check',
      description: 'Test and replace batteries in smoke detectors',
      category: 'GENERAL',
      frequency: 'ANNUAL',
      nextDueDate: new Date('2024-12-01'),
      lastCompletedAt: new Date('2023-12-01'),
    },
    {
      name: 'Water Heater Flush',
      description: 'Drain and flush water heater to remove sediment',
      category: 'PLUMBING',
      frequency: 'ANNUAL',
      nextDueDate: new Date('2024-06-15'),
      lastCompletedAt: new Date('2023-06-15'),
    },
    {
      name: 'Gutter Cleaning',
      description: 'Clean gutters and downspouts',
      category: 'YARD',
      frequency: 'SEMI_ANNUAL',
      nextDueDate: new Date('2024-03-15'),
      lastCompletedAt: new Date('2023-09-15'),
    },
  ]

  for (const task of tasks) {
    await prisma.maintenanceTask.create({
      data: {
        ...task,
        userId: demoUser.id,
      },
    })
  }

  // Create sample documents
  const documents = [
    {
      name: 'Driver\'s License',
      type: 'DRIVERS_LICENSE',
      issuer: 'DMV',
      documentNumber: 'D123456789',
      issueDate: new Date('2022-03-15'),
      expirationDate: new Date('2026-03-15'),
      notes: 'Class C license',
    },
    {
      name: 'Passport',
      type: 'PASSPORT',
      issuer: 'US Department of State',
      documentNumber: '123456789',
      issueDate: new Date('2020-05-01'),
      expirationDate: new Date('2030-05-01'),
      notes: 'US Passport',
    },
    {
      name: 'Car Registration',
      type: 'CAR_REGISTRATION',
      issuer: 'DMV',
      documentNumber: 'ABC123',
      issueDate: new Date('2023-01-01'),
      expirationDate: new Date('2024-12-31'),
      notes: '2020 Honda Civic',
    },
    {
      name: 'Home Insurance',
      type: 'INSURANCE',
      issuer: 'State Farm',
      documentNumber: 'SF-123456',
      issueDate: new Date('2023-01-01'),
      expirationDate: new Date('2024-01-01'),
      notes: 'Homeowners insurance policy',
    },
  ]

  for (const document of documents) {
    await prisma.document.create({
      data: {
        ...document,
        userId: demoUser.id,
      },
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


