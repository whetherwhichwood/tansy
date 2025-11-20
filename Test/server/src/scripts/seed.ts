import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ichra.com' },
    update: {},
    create: {
      email: 'admin@ichra.com',
      password_hash: hashedPassword,
      name: 'Administrator',
      role: 'administrator'
    }
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create sample plans
  const samplePlans = [
    {
      carrier_name: 'Blue Cross Blue Shield',
      plan_name: 'Silver PPO 2500',
      plan_type: 'PPO',
      metal_tier: 'Silver',
      state: 'NY',
      zip_codes: ['10001', '10002', '10003', '10004', '10005'],
      monthly_premium: 485.00,
      annual_deductible: 2500.00,
      oop_maximum: 7000.00,
      pcp_copay: 25.00,
      specialist_copay: 50.00,
      er_copay: 250.00,
      urgent_care_copay: 75.00,
      generic_rx_copay: 15.00,
      network_type: 'PPO',
      network_size: 'Large',
      hsa_eligible: false,
      provider_list: ['Dr. Smith', 'NYC General Hospital', 'Mount Sinai'],
      is_active: true
    },
    {
      carrier_name: 'Aetna',
      plan_name: 'Gold HMO 1500',
      plan_type: 'HMO',
      metal_tier: 'Gold',
      state: 'NY',
      zip_codes: ['10001', '10002', '10003', '10004', '10005'],
      monthly_premium: 520.00,
      annual_deductible: 1500.00,
      oop_maximum: 6000.00,
      pcp_copay: 20.00,
      specialist_copay: 40.00,
      er_copay: 200.00,
      urgent_care_copay: 50.00,
      generic_rx_copay: 10.00,
      network_type: 'HMO',
      network_size: 'Large',
      hsa_eligible: false,
      provider_list: ['Dr. Johnson', 'NYC General Hospital', 'Lenox Hill'],
      is_active: true
    },
    {
      carrier_name: 'Cigna',
      plan_name: 'Bronze HDHP 4000',
      plan_type: 'HDHP',
      metal_tier: 'Bronze',
      state: 'NY',
      zip_codes: ['10001', '10002', '10003', '10004', '10005'],
      monthly_premium: 350.00,
      annual_deductible: 4000.00,
      oop_maximum: 8000.00,
      pcp_copay: null,
      specialist_copay: null,
      er_copay: null,
      urgent_care_copay: null,
      generic_rx_copay: null,
      network_type: 'PPO',
      network_size: 'Large',
      hsa_eligible: true,
      provider_list: ['Dr. Brown', 'NYC General Hospital', 'Bellevue'],
      is_active: true
    },
    {
      carrier_name: 'UnitedHealth',
      plan_name: 'Silver EPO 2000',
      plan_type: 'EPO',
      metal_tier: 'Silver',
      state: 'NY',
      zip_codes: ['10001', '10002', '10003', '10004', '10005'],
      monthly_premium: 450.00,
      annual_deductible: 2000.00,
      oop_maximum: 6500.00,
      pcp_copay: 30.00,
      specialist_copay: 60.00,
      er_copay: 300.00,
      urgent_care_copay: 80.00,
      generic_rx_copay: 20.00,
      network_type: 'EPO',
      network_size: 'Medium',
      hsa_eligible: false,
      provider_list: ['Dr. Wilson', 'NYC General Hospital'],
      is_active: true
    },
    {
      carrier_name: 'Kaiser Permanente',
      plan_name: 'Gold HMO 1000',
      plan_type: 'HMO',
      metal_tier: 'Gold',
      state: 'CA',
      zip_codes: ['90210', '90211', '90212', '94102', '94103'],
      monthly_premium: 580.00,
      annual_deductible: 1000.00,
      oop_maximum: 5000.00,
      pcp_copay: 15.00,
      specialist_copay: 30.00,
      er_copay: 150.00,
      urgent_care_copay: 40.00,
      generic_rx_copay: 8.00,
      network_type: 'HMO',
      network_size: 'Large',
      hsa_eligible: false,
      provider_list: ['Dr. Garcia', 'Kaiser Oakland', 'Kaiser San Francisco'],
      is_active: true
    },
    {
      carrier_name: 'Anthem',
      plan_name: 'Silver PPO 3000',
      plan_type: 'PPO',
      metal_tier: 'Silver',
      state: 'CA',
      zip_codes: ['90210', '90211', '90212', '94102', '94103'],
      monthly_premium: 420.00,
      annual_deductible: 3000.00,
      oop_maximum: 7500.00,
      pcp_copay: 35.00,
      specialist_copay: 70.00,
      er_copay: 400.00,
      urgent_care_copay: 100.00,
      generic_rx_copay: 25.00,
      network_type: 'PPO',
      network_size: 'Large',
      hsa_eligible: false,
      provider_list: ['Dr. Martinez', 'UCLA Medical Center', 'Cedars-Sinai'],
      is_active: true
    }
  ]

  for (const planData of samplePlans) {
    await prisma.plan.create({
      data: planData
    })
  }

  console.log('✅ Created sample plans')

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
