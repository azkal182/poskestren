-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "class" TEXT,
    "room" TEXT,
    "hostelId" TEXT NOT NULL,
    CONSTRAINT "Patient_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hospitalization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "complaint" TEXT NOT NULL,
    "status" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_at" DATETIME,
    "selisih" INTEGER,
    CONSTRAINT "Hospitalization_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CheckUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "payment_source" TEXT NOT NULL,
    "payment_total" REAL,
    "payment" REAL,
    "status" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_at" DATETIME,
    CONSTRAINT "CheckUp_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BorrowMoneyInCash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "checkUpId" TEXT NOT NULL,
    "payment" REAL,
    "total" REAL NOT NULL,
    "status" TEXT,
    "payment_date_time" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_at" DATETIME,
    CONSTRAINT "BorrowMoneyInCash_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BorrowMoneyInCash_checkUpId_fkey" FOREIGN KEY ("checkUpId") REFERENCES "CheckUp" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Hospitalization_patientId_key" ON "Hospitalization"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckUp_patientId_key" ON "CheckUp"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "BorrowMoneyInCash_patientId_key" ON "BorrowMoneyInCash"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "BorrowMoneyInCash_checkUpId_key" ON "BorrowMoneyInCash"("checkUpId");
