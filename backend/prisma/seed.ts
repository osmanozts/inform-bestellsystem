import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const DEMO_USER_1 = '00000000-0000-0000-0000-000000000001';
const DEMO_USER_2 = '00000000-0000-0000-0000-000000000002';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = [
    { id: '10000000-0000-0000-0000-000000000001', name: 'MacBook Pro 14"', price: 1999.99, stock: 15 },
    { id: '10000000-0000-0000-0000-000000000002', name: 'iPhone 15 Pro', price: 999.99, stock: 40 },
    { id: '10000000-0000-0000-0000-000000000003', name: 'AirPods Pro', price: 249.99, stock: 80 },
    { id: '10000000-0000-0000-0000-000000000004', name: 'iPad Air', price: 799.99, stock: 25 },
    { id: '10000000-0000-0000-0000-000000000005', name: 'Magic Mouse', price: 79.99, stock: 60 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: product,
      update: { name: product.name, price: product.price, stock: product.stock },
    });
  }

  console.log('Seed complete.');
  console.log(`Demo users: ${DEMO_USER_1} | ${DEMO_USER_2}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
