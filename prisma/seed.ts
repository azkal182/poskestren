// Seeder for Prisma schema data

// Import PrismaClient
const { PrismaClient } = require("@prisma/client");
const { v4 } = require("uuid");
// Create an instance of PrismaClient
//@ts-ignore
const prisma = new PrismaClient();

async function main() {
  const patients = [
    {
      id: v4(),
      name: "NA'IM",
    },
    {
      id: v4(),
      name: "TAKHOSUS",
    },
    {
      id: v4(),
      name: "MUSA",
    },
    {
      id: v4(),
      name: "PASCA",
    },
    {
      id: v4(),
      name: "DARUSSALAM",
    },
    {
      id: v4(),
      name: "TASAWUF",
    },
    // Add more patient data here if needed
  ];

  for (const patient of patients) {
    await prisma.hostel.create({
      data: patient,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    // Close the PrismaClient connection
    await prisma.$disconnect();
  });
