/*
  Warnings:

  - A unique constraint covering the columns `[lead_id,targetService,source,rule_key]` on the table `cross_sell_opportunities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cross_sell_opportunities_lead_id_targetService_source_rule__key" ON "cross_sell_opportunities"("lead_id", "targetService", "source", "rule_key");
