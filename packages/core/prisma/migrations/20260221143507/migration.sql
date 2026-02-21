-- CreateEnum
CREATE TYPE "lead_type" AS ENUM ('EVENT', 'CAR', 'CLEANING');

-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('NEW', 'QUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "lead_channel" AS ENUM ('PHONE', 'EMAIL', 'FORM');

-- CreateEnum
CREATE TYPE "cross_sell_opportunity_status" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "cross_sell_source" AS ENUM ('RULE_ENGINE', 'SERVICE_REPORT');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "category" "lead_type" NOT NULL,
    "status" "lead_status" NOT NULL,
    "channel" "lead_channel" NOT NULL,
    "description" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_extensions" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cross_sell_opportunities" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "targetService" "lead_type" NOT NULL,
    "source" "cross_sell_source" NOT NULL,
    "status" "cross_sell_opportunity_status" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "rule_key" TEXT,
    "context" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cross_sell_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT,
    "actor_service" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "correlation_id" TEXT,
    "causation_id" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_category_status_idx" ON "leads"("category", "status");

-- CreateIndex
CREATE INDEX "lead_extensions_namespace_idx" ON "lead_extensions"("namespace");

-- CreateIndex
CREATE UNIQUE INDEX "lead_extensions_lead_id_namespace_key" ON "lead_extensions"("lead_id", "namespace");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_lead_id_status_idx" ON "cross_sell_opportunities"("lead_id", "status");

-- CreateIndex
CREATE INDEX "cross_sell_opportunities_targetService_status_idx" ON "cross_sell_opportunities"("targetService", "status");

-- CreateIndex
CREATE INDEX "audit_log_occurred_at_idx" ON "audit_log"("occurred_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_occurred_at_idx" ON "audit_log"("entity_type", "entity_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_log_lead_id_occurred_at_idx" ON "audit_log"("lead_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_log_correlation_id_idx" ON "audit_log"("correlation_id");

-- AddForeignKey
ALTER TABLE "lead_extensions" ADD CONSTRAINT "lead_extensions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cross_sell_opportunities" ADD CONSTRAINT "cross_sell_opportunities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
