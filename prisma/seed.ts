import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with test users...');

  // Default password for all test users (change in production!)
  const defaultPassword = 'Test1234!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Test users for each role
  const testUsers = [
    {
      email: 'admin@delta-tms.com',
      phone: '5551000001',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
    {
      email: 'superadmin@delta-tms.com',
      phone: '5551000002',
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
    },
    {
      email: 'dispatcher@delta-tms.com',
      phone: '5551000003',
      firstName: 'Dispatch',
      lastName: 'User',
      role: UserRole.DISPATCHER,
    },
    {
      email: 'operations@delta-tms.com',
      phone: '5551000004',
      firstName: 'Operations',
      lastName: 'Manager',
      role: UserRole.OPERATIONS_MANAGER,
    },
    {
      email: 'driver@delta-tms.com',
      phone: '5551000005',
      firstName: 'Driver',
      lastName: 'User',
      role: UserRole.DRIVER,
    },
    {
      email: 'facility@delta-tms.com',
      phone: '5551000006',
      firstName: 'Facility',
      lastName: 'Staff',
      role: UserRole.FACILITY_STAFF,
    },
    {
      email: 'patient@delta-tms.com',
      phone: '5551000007',
      firstName: 'Patient',
      lastName: 'User',
      role: UserRole.PATIENT,
    },
    {
      email: 'family@delta-tms.com',
      phone: '5551000008',
      firstName: 'Family',
      lastName: 'Member',
      role: UserRole.FAMILY_MEMBER,
    },
  ];

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User ${userData.email} already exists, skipping...`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phoneVerified: true,
      },
    });

    console.log(`Created user: ${user.email} (${user.role})`);

    // Create driver profile for driver user
    if (userData.role === UserRole.DRIVER) {
      await prisma.driver.create({
        data: {
          userId: user.id,
          licenseNumber: 'DL123456789',
          licenseState: 'IL',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        },
      });
      console.log(`  Created driver profile for ${user.email}`);
    }
  }

  console.log('\n========================================');
  console.log('Test users created successfully!');
  console.log('========================================');
  console.log('\nLogin credentials for all users:');
  console.log(`Password: ${defaultPassword}`);
  console.log('\nEmails:');
  testUsers.forEach((u) => {
    console.log(`  ${u.role.toLowerCase().replace('_', '-')}: ${u.email}`);
  });
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
