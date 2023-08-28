-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "hostelId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospitalization" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "complaint" TEXT NOT NULL,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_at" TIMESTAMP(3),
    "selisih" INTEGER,

    CONSTRAINT "Hospitalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckUp" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "payment_source" TEXT NOT NULL,
    "payment_total" DOUBLE PRECISION,
    "payment" DOUBLE PRECISION,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_at" TIMESTAMP(3),

    CONSTRAINT "CheckUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BorrowMoneyInCash" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "checkUpId" TEXT NOT NULL,
    "payment" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "payment_date_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_at" TIMESTAMP(3),

    CONSTRAINT "BorrowMoneyInCash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hospitalization_patientId_key" ON "Hospitalization"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckUp_patientId_key" ON "CheckUp"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "BorrowMoneyInCash_patientId_key" ON "BorrowMoneyInCash"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "BorrowMoneyInCash_checkUpId_key" ON "BorrowMoneyInCash"("checkUpId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospitalization" ADD CONSTRAINT "Hospitalization_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckUp" ADD CONSTRAINT "CheckUp_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowMoneyInCash" ADD CONSTRAINT "BorrowMoneyInCash_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowMoneyInCash" ADD CONSTRAINT "BorrowMoneyInCash_checkUpId_fkey" FOREIGN KEY ("checkUpId") REFERENCES "CheckUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
