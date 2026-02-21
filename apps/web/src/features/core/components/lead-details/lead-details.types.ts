import type { LeadDetailsResult } from "../../queries/get-lead-details";

export type CoreLeadDetailsData = LeadDetailsResult;

export type CoreLeadDetailsLead = CoreLeadDetailsData["lead"];

export type CoreLeadDetailsAuditLog = CoreLeadDetailsData["auditLog"];
export type CoreLeadDetailsAuditLogEntry = CoreLeadDetailsAuditLog[number];
