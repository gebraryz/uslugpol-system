-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('NEW', 'QUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "lead_channel" AS ENUM ('PHONE', 'EMAIL', 'FORM');

-- CreateEnum
CREATE TYPE "cross_sell_target_service" AS ENUM ('CAR', 'CLEANING');

-- CreateTable
CREATE TABLE "event_lead_inbox" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "channel" "lead_channel" NOT NULL,
    "status" "lead_status" NOT NULL,
    "description" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_lead_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_details" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "event_date" TIMESTAMP(3),
    "guest_count" INTEGER,
    "budget" INTEGER,
    "is_outdoor" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cross_sell_proposal_inbox" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "opportunity_id" TEXT,
    "target_service" "cross_sell_target_service" NOT NULL,
    "reason" TEXT NOT NULL,
    "rule_key" TEXT,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seen_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cross_sell_proposal_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_reports" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "target_service" "cross_sell_target_service",
    "description" TEXT NOT NULL,
    "context" JSONB,
    "sent_to_core" BOOLEAN NOT NULL DEFAULT false,
    "reported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_lead_inbox_lead_id_key" ON "event_lead_inbox"("lead_id");

-- CreateIndex
CREATE INDEX "event_lead_inbox_status_received_at_idx" ON "event_lead_inbox"("status", "received_at");

-- CreateIndex
CREATE UNIQUE INDEX "event_details_lead_id_key" ON "event_details"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "cross_sell_proposal_inbox_opportunity_id_key" ON "cross_sell_proposal_inbox"("opportunity_id");

-- CreateIndex
CREATE INDEX "cross_sell_proposal_inbox_lead_id_received_at_idx" ON "cross_sell_proposal_inbox"("lead_id", "received_at");

-- CreateIndex
CREATE INDEX "cross_sell_proposal_inbox_target_service_received_at_idx" ON "cross_sell_proposal_inbox"("target_service", "received_at");

-- CreateIndex
CREATE INDEX "opportunity_reports_lead_id_reported_at_idx" ON "opportunity_reports"("lead_id", "reported_at");

-- AddForeignKey
ALTER TABLE "event_details" ADD CONSTRAINT "event_details_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "event_lead_inbox"("lead_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cross_sell_proposal_inbox" ADD CONSTRAINT "cross_sell_proposal_inbox_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "event_lead_inbox"("lead_id") ON DELETE RESTRICT ON UPDATE CASCADE;
