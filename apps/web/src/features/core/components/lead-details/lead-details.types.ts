import type { LeadDetailsResult } from "../../queries/get-lead-details";

export type LeadDetailsData = LeadDetailsResult;

export type LeadDetailsLead = LeadDetailsData["lead"];

export type LeadDetailsAuditLog = LeadDetailsData["auditLog"];
export type LeadDetailsAuditLogEntry = LeadDetailsAuditLog[number];
