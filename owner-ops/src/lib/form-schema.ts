import { z } from "zod";

export const TOOL_CATEGORIES = [
  "Email",
  "Calendar",
  "Website",
  "Forms",
  "CRM",
  "Phone or texting",
  "Estimating",
  "Proposals",
  "E-signature",
  "Scheduling",
  "Project management",
  "Field-service management",
  "Accounting",
  "Invoicing",
  "Payments",
  "File storage",
  "Spreadsheets",
  "Marketing",
  "Reporting",
  "AI tools",
  "Other",
] as const;

export const PROCESS_CATEGORIES = [
  "Lead generation",
  "Lead qualification",
  "Initial response",
  "Appointment scheduling",
  "Sales discovery",
  "Estimating",
  "Proposal creation",
  "Follow-up",
  "Agreement and signature",
  "Customer onboarding",
  "Job scheduling",
  "Project execution",
  "Field documentation",
  "Photo reporting",
  "Change orders",
  "Customer communication",
  "Invoicing",
  "Collections",
  "Review requests",
  "Referral requests",
  "Customer support",
  "Employee onboarding",
  "Purchasing",
  "Inventory",
  "Reporting",
  "Other",
] as const;

const optionalString = z.string().max(5000).optional().or(z.literal(""));

export const contactCompanySchema = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  jobTitle: optionalString,
  email: z.string().email().max(320),
  phone: optionalString,
  companyName: z.string().min(1).max(200),
  companyWebsite: optionalString,
  primaryLocation: optionalString,
  serviceAreas: optionalString,
  industry: optionalString,
  yearsInBusiness: z.union([z.number().int().min(0).max(200), z.literal("")]).optional(),
  employeeCount: z.union([z.number().int().min(0).max(1_000_000), z.literal("")]).optional(),
  adminEmployeeCount: z.union([z.number().int().min(0).max(1_000_000), z.literal("")]).optional(),
  customersPerMonth: z.union([z.number().int().min(0).max(10_000_000), z.literal("")]).optional(),
  annualRevenueRange: optionalString,
  primaryDecisionMaker: optionalString,
  additionalStakeholders: optionalString,
  howHeard: optionalString,
});

export const businessOverviewSchema = z.object({
  productsServices: optionalString,
  primaryCustomers: optionalString,
  howCustomersFindYou: optionalString,
  inquiryToFollowUp: optionalString,
  differentiators: optionalString,
  threeGoals: optionalString,
  goalBlockers: optionalString,
  timeConsumingWork: optionalString,
  greatestFrustration: optionalString,
  whereValueIsLost: optionalString,
  priorImprovementAttempts: optionalString,
  engagementSuccessLooksLike: optionalString,
});

export const toolEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  category: z.string().max(100).optional().or(z.literal("")),
  usedFor: optionalString,
  whoUses: optionalString,
  informationHeld: optionalString,
  connectsTo: optionalString,
  worksWell: optionalString,
  doesNotWorkWell: optionalString,
  costOptional: optionalString,
  retainDecision: z
    .enum(["retain", "replace", "evaluate", ""])
    .optional()
    .or(z.literal("")),
  notes: optionalString,
});

export const processInventoryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  category: z.string().max(100).optional().or(z.literal("")),
  department: optionalString,
  processOwner: optionalString,
  peopleInvolved: optionalString,
  frequency: optionalString,
  estimatedTime: optionalString,
  businessImportance: optionalString,
  frustrationLevel: optionalString,
  errorReworkFrequency: optionalString,
  affectsRevenue: z.boolean().optional(),
  affectsCustomerExp: z.boolean().optional(),
  affectsCost: z.boolean().optional(),
  affectsRisk: z.boolean().optional(),
  affectsWorkload: z.boolean().optional(),
  wantDetailedMap: z.boolean().optional(),
});

export const processStepSchema = z.object({
  id: z.string().min(1),
  stepNumber: z.number().int().min(1),
  responsibleRole: optionalString,
  exactAction: optionalString,
  toolUsed: optionalString,
  informationReceived: optionalString,
  informationChanged: optionalString,
  outputRecipient: optionalString,
  decisionInvolved: optionalString,
  expectedTime: optionalString,
  waitingTime: optionalString,
  notificationSent: optionalString,
  completionEvidence: optionalString,
  problems: optionalString,
  exceptions: optionalString,
  workaround: optionalString,
});

export const detailedProcessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  businessObjective: optionalString,
  processOwner: optionalString,
  peopleInvolved: optionalString,
  frequency: optionalString,
  averageVolume: optionalString,
  averageCompletionTime: optionalString,
  trigger: optionalString,
  whoFirstAware: optionalString,
  initialInfoSource: optionalString,
  firstAction: optionalString,
  requiredBeforeStart: optionalString,
  steps: z.array(processStepSchema).default([]),
  decisions: optionalString,
  decisionAuthority: optionalString,
  decisionRules: optionalString,
  exceptionsChangeProcess: optionalString,
  whenInfoMissing: optionalString,
  whenNoResponse: optionalString,
  whenProcessFails: optionalString,
  repeatedProblems: optionalString,
  singlePersonKnowledge: optionalString,
  finalStep: optionalString,
  successEvidence: optionalString,
  whoInformed: optionalString,
  finalInfoStored: optionalString,
  followUpRequired: optionalString,
  reportsUpdated: optionalString,
  commonlyUnfinished: optionalString,
  unnecessarilyManual: optionalString,
  doubleEntry: optionalString,
  copyBetweenSystems: optionalString,
  waitingOnPeople: optionalString,
  mistakeProne: optionalString,
  wouldEliminate: optionalString,
  shouldAutomate: optionalString,
  shouldRemainHuman: optionalString,
  ifPerfect: optionalString,
});

export const prioritiesSchema = z.object({
  topThreeProcesses: optionalString,
  improve30Days: optionalString,
  improve60Days: optionalString,
  improve90Days: optionalString,
  greatestFinancialValue: optionalString,
  mostTimeSaved: optionalString,
  bestCustomerExperience: optionalString,
  greatestRiskReduction: optionalString,
  budgetRange: optionalString,
  implementationStart: optionalString,
  timingConstraints: optionalString,
  anythingElse: optionalString,
});

export const confirmationSchema = z.object({
  answersAreHonest: z.literal(true),
  noSensitiveCredentials: z.literal(true),
  mayUseForBlueprint: z.literal(true),
  authorizedToProvide: z.literal(true),
});

export const privacyAckSchema = z.object({
  noticeVersion: z.string().max(64).optional(),
  acknowledged: z.boolean().optional(),
  acknowledgedAt: z.string().max(64).optional(),
});

export const blueprintPayloadSchema = z.object({
  privacy: privacyAckSchema.default({}),
  section1: contactCompanySchema.partial().default({}),
  section2: businessOverviewSchema.partial().default({}),
  section3: z.object({ tools: z.array(toolEntrySchema).default([]) }).default({
    tools: [],
  }),
  section4: z
    .object({ processes: z.array(processInventoryEntrySchema).default([]) })
    .default({ processes: [] }),
  section5: z
    .object({ detailedProcesses: z.array(detailedProcessSchema).default([]) })
    .default({ detailedProcesses: [] }),
  section6: z
    .object({
      notes: optionalString,
      acknowledgedSensitiveWarning: z.boolean().optional(),
    })
    .default({}),
  section7: prioritiesSchema.partial().default({}),
  section8: confirmationSchema.partial().default({}),
});

export type BlueprintPayload = z.infer<typeof blueprintPayloadSchema>;

export const emptyBlueprintPayload = (): BlueprintPayload =>
  blueprintPayloadSchema.parse({});

/** Draft saves allow incomplete nested entries (empty names while typing). */
export const draftPayloadSchema = z.object({
  privacy: privacyAckSchema.default({}),
  section1: contactCompanySchema.partial().default({}),
  section2: businessOverviewSchema.partial().default({}),
  section3: z
    .object({
      tools: z
        .array(
          toolEntrySchema.extend({
            name: z.string().max(200),
          }),
        )
        .default([]),
    })
    .default({ tools: [] }),
  section4: z
    .object({
      processes: z
        .array(
          processInventoryEntrySchema.extend({
            name: z.string().max(200),
          }),
        )
        .default([]),
    })
    .default({ processes: [] }),
  section5: z
    .object({
      detailedProcesses: z
        .array(
          detailedProcessSchema.extend({
            name: z.string().max(200),
          }),
        )
        .default([]),
    })
    .default({ detailedProcesses: [] }),
  section6: z
    .object({
      notes: optionalString,
      acknowledgedSensitiveWarning: z.boolean().optional(),
    })
    .default({}),
  section7: prioritiesSchema.partial().default({}),
  section8: confirmationSchema.partial().default({}),
});

export const submitPayloadSchema = blueprintPayloadSchema.superRefine(
  (data, ctx) => {
    if (data.privacy.acknowledged !== true || !data.privacy.noticeVersion) {
      ctx.addIssue({
        code: "custom",
        message: "Privacy notice must be acknowledged",
        path: ["privacy", "acknowledged"],
      });
    }
    const s1 = data.section1;
    for (const key of ["firstName", "lastName", "email", "companyName"] as const) {
      if (!s1[key] || String(s1[key]).trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: `${key} is required`,
          path: ["section1", key],
        });
      }
    }
    // Section 5 JSON detailed maps are legacy/optional. Increment 2 requires
    // at least one relational process under Your Processes (enforced in submitByToken).
    if (
      data.section5.detailedProcesses.length > 0 &&
      data.section5.detailedProcesses.some((p) => !p.name || !p.name.trim())
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Each detailed process needs a name",
        path: ["section5", "detailedProcesses"],
      });
    }
    const c = data.section8;
    for (const key of [
      "answersAreHonest",
      "noSensitiveCredentials",
      "mayUseForBlueprint",
      "authorizedToProvide",
    ] as const) {
      if (c[key] !== true) {
        ctx.addIssue({
          code: "custom",
          message: `${key} must be confirmed`,
          path: ["section8", key],
        });
      }
    }
  },
);
