-- CreateTable
CREATE TABLE `BarangKeluar` (
    `barangkeluarId` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlahBarangKeluar` BIGINT NOT NULL,
    `barangId` BIGINT,
UNIQUE INDEX `BarangKeluar_barangId_unique`(`barangId`),

    PRIMARY KEY (`barangkeluarId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BarangMasuk` (
    `barangmasukId` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlahBarangMasuk` BIGINT NOT NULL,
    `barangId` BIGINT,
UNIQUE INDEX `BarangMasuk_barangId_unique`(`barangId`),

    PRIMARY KEY (`barangmasukId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StokBarang` (
    `stokId` INTEGER NOT NULL AUTO_INCREMENT,
    `stokBarang` BIGINT,
    `barangId` BIGINT,
UNIQUE INDEX `StokBarang_barangId_unique`(`barangId`),

    PRIMARY KEY (`stokId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Barang` (
    `barangId` BIGINT NOT NULL AUTO_INCREMENT,
    `kodeBarang` VARCHAR(20) NOT NULL,
    `namaBarang` VARCHAR(100) NOT NULL,
    `satuanBarang` ENUM('buah', 'lusin', 'dus', 'rim', 'gross') NOT NULL,
    `hargaBarang` BIGINT,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3),
    `deletedAt` DATETIME(3),
UNIQUE INDEX `Barang.kodeBarang_unique`(`kodeBarang`),

    PRIMARY KEY (`barangId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserHasRole` (
    `userhasroleId` BIGINT NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER,
    `userId` BIGINT,
UNIQUE INDEX `UserHasRole_roleId_unique`(`roleId`),
UNIQUE INDEX `UserHasRole_userId_unique`(`userId`),

    PRIMARY KEY (`userhasroleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleHasPermission` (
    `rolehaspermissionId` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER,
    `roleId` INTEGER,

    PRIMARY KEY (`rolehaspermissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `rolesName` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `permissionId` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionName` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` BIGINT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(120) NOT NULL,
    `lastName` VARCHAR(120) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3),
    `deletedAt` DATETIME(3),
UNIQUE INDEX `User.email_unique`(`email`),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BarangKeluar` ADD FOREIGN KEY (`barangId`) REFERENCES `Barang`(`barangId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarangMasuk` ADD FOREIGN KEY (`barangId`) REFERENCES `Barang`(`barangId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StokBarang` ADD FOREIGN KEY (`barangId`) REFERENCES `Barang`(`barangId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasRole` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasRole` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleHasPermission` ADD FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`permissionId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleHasPermission` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE SET NULL ON UPDATE CASCADE;
