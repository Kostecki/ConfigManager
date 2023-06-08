/*
  Warnings:

  - You are about to drop the column `voltage` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `voltage`,
    ADD COLUMN `deviceVoltage` FLOAT NULL;
