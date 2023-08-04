/*
  Warnings:

  - You are about to drop the `Voltage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Voltage` DROP FOREIGN KEY `Voltage_projectId_fkey`;

-- DropTable
DROP TABLE `Voltage`;

-- CreateTable
CREATE TABLE `Voltages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reading` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `projectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Voltages` ADD CONSTRAINT `Voltages_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
