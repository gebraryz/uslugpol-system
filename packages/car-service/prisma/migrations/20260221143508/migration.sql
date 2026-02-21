-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('NEW', 'QUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "lead_channel" AS ENUM ('PHONE', 'EMAIL', 'FORM');

-- CreateEnum
CREATE TYPE "CrossSellDecisionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "car_lead_inbox" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "channel" "lead_channel" NOT NULL,
    "status" "lead_status" NOT NULL,
    "description" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_lead_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cross_sell_inbox" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "opportunity_id" TEXT,
    "reason" TEXT NOT NULL,
    "rule_key" TEXT,
    "context" JSONB,
    "status" "CrossSellDecisionStatus" NOT NULL DEFAULT 'PENDING',
    "decision_note" TEXT,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cross_sell_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "car_lead_inbox_lead_id_key" ON "car_lead_inbox"("lead_id");

-- CreateIndex
CREATE INDEX "car_lead_inbox_status_received_at_idx" ON "car_lead_inbox"("status", "received_at");

-- CreateIndex
CREATE UNIQUE INDEX "cross_sell_inbox_opportunity_id_key" ON "cross_sell_inbox"("opportunity_id");

-- CreateIndex
CREATE INDEX "cross_sell_inbox_lead_id_received_at_idx" ON "cross_sell_inbox"("lead_id", "received_at");

-- CreateIndex
CREATE INDEX "cross_sell_inbox_status_received_at_idx" ON "cross_sell_inbox"("status", "received_at");
