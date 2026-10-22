import type { Lang } from './site';
import type { ProjectKey } from './projects';

export type InspectorLayerKey = 'interface' | 'logic' | 'data' | 'commands' | 'runtime';
export type InspectorText = Record<Lang, string>;

export interface InspectorRole {
  key: InspectorLayerKey;
  label: InspectorText;
  description: InspectorText;
  stack: string[];
}

export interface ProjectExcerpt {
  key: InspectorLayerKey;
  label: InspectorText;
  description: InspectorText;
  language: 'vue' | 'typescript' | 'rust' | 'sql';
  file: string;
  source: string;
  code: string;
  startLine: number;
  endLine: number;
}

export interface ProjectInspector {
  key: ProjectKey;
  repo: string;
  commit: string;
  roles: [InspectorRole, InspectorRole, InspectorRole];
  excerpts: [ProjectExcerpt, ProjectExcerpt, ProjectExcerpt];
}

// Public source at immutable commits; only common leading indentation is removed.
// Provenance and verification: docs/inspector-sources.md.
export const projectInspectors: Record<ProjectKey, ProjectInspector> = {
  "pos": {
    "key": "pos",
    "repo": "https://github.com/DwennK/004-Nuxt",
    "commit": "d4a2ae39c6c8ae82fa13f621b733a186b78d6f92",
    "roles": [
      {
        "key": "interface",
        "label": {
          "fr": "Interface",
          "en": "Interface"
        },
        "description": {
          "fr": "L’écran permet de saisir et de suivre les paiements.",
          "en": "The screen lets users enter and track payments."
        },
        "stack": [
          "Nuxt",
          "Vue",
          "Nuxt UI"
        ]
      },
      {
        "key": "logic",
        "label": {
          "fr": "Serveur",
          "en": "Server"
        },
        "description": {
          "fr": "L’API contrôle les droits et valide les données avant l’enregistrement.",
          "en": "The API checks permissions and validates data before saving."
        },
        "stack": [
          "Nuxt server",
          "TypeScript",
          "Cloudflare Workers"
        ]
      },
      {
        "key": "data",
        "label": {
          "fr": "Données",
          "en": "Data"
        },
        "description": {
          "fr": "Les paiements sont reliés aux documents dans la base de données.",
          "en": "Payments are linked to documents in the database."
        },
        "stack": [
          "Drizzle",
          "Turso / libSQL"
        ]
      }
    ],
    "excerpts": [
      {
        "key": "interface",
        "label": {
          "fr": "Encaisser le solde",
          "en": "Record the remaining payment"
        },
        "description": {
          "fr": "Le bouton affiche le solde à encaisser et se désactive pendant l’enregistrement.",
          "en": "The button shows the outstanding amount and is disabled while a payment is being recorded."
        },
        "language": "vue",
        "file": "app/components/pos/DocumentPaymentsEditor.vue",
        "source": "https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/app/components/pos/DocumentPaymentsEditor.vue#L546-L554",
        "code": "<UButton\n  type=\"button\"\n  :label=\"`Encaisser le solde · ${formatCurrency(balanceDue)}`\"\n  icon=\"i-lucide-wallet\"\n  :loading=\"creatingMethod === quickPaymentMethod\"\n  :disabled=\"!canCreatePayment || mutationPending\"\n  block\n  @click=\"createQuickPayment(quickPaymentMethod)\"\n/>",
        "startLine": 546,
        "endLine": 554
      },
      {
        "key": "logic",
        "label": {
          "fr": "Vérifier la demande",
          "en": "Validate the request"
        },
        "description": {
          "fr": "Le serveur vérifie les droits, valide la saisie et exige une clé pour reconnaître une demande répétée.",
          "en": "The server checks permissions, validates input and requires a key to recognize a repeated request."
        },
        "language": "typescript",
        "file": "server/api/documents/[id]/mark-paid.post.ts",
        "source": "https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/server/api/documents/[id]/mark-paid.post.ts#L8-L14",
        "code": "export default eventHandler(async (event) => {\n  await requireCapability(event, 'financial:record')\n  const idempotencyKey = requireIdempotencyKey(event)\n  const params = await getValidatedRouterParams(event, numericIdParamsSchema.parse)\n  const body = await readValidatedBody(event, markDocumentPaidSchema.parse)\n  return markDocumentAsPaid(params.id, body, idempotencyKey, readDossierWriteContext(event))\n})",
        "startLine": 8,
        "endLine": 14
      },
      {
        "key": "data",
        "label": {
          "fr": "Relier paiement et facture",
          "en": "Link payment and invoice"
        },
        "description": {
          "fr": "Chaque paiement conserve son montant, son statut et le lien vers son document ; un remboursement peut référencer l’encaissement d’origine.",
          "en": "Each payment stores its amount, status and document link; a refund can reference the original receipt."
        },
        "language": "typescript",
        "file": "server/db/schema.ts",
        "source": "https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/server/db/schema.ts#L294-L305",
        "code": "export const payments = sqliteTable('payments', {\n  id: integer('id').primaryKey({ autoIncrement: true }),\n  customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }),\n  documentId: integer('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),\n  kind: text('kind', { enum: ['receipt', 'refund'] }).notNull().default('receipt'),\n  originalPaymentId: integer('original_payment_id').references((): AnySQLiteColumn => payments.id, { onDelete: 'restrict' }),\n  recordedBy: text('recorded_by'),\n  voidedAt: text('voided_at'),\n  voidReason: text('void_reason'),\n  method: text('method', { enum: ['cash', 'card_twint', 'bank_transfer', 'stripe', 'shopify'] }).notNull(),\n  status: text('status', { enum: ['pending', 'paid', 'refunded', 'cancelled'] }).notNull().default('pending'),\n  amount: integer('amount').notNull(),",
        "startLine": 294,
        "endLine": 305
      }
    ]
  },
  "salaires": {
    "key": "salaires",
    "repo": "https://github.com/DwennK/Easy-Salaires",
    "commit": "09a59f8b3b078e52b4143ad18271cbd82277580f",
    "roles": [
      {
        "key": "interface",
        "label": {
          "fr": "Interface",
          "en": "Interface"
        },
        "description": {
          "fr": "Une interface Vue pour consulter l’année de paie et les montants enregistrés.",
          "en": "A Vue interface for reviewing the payroll year and recorded amounts."
        },
        "stack": [
          "Vue 3",
          "TypeScript"
        ]
      },
      {
        "key": "logic",
        "label": {
          "fr": "Calculs",
          "en": "Calculations"
        },
        "description": {
          "fr": "Les règles de paie sont calculées en TypeScript, avec des utilitaires monétaires utilisant Decimal.js.",
          "en": "Payroll rules are calculated in TypeScript, with monetary helpers using Decimal.js."
        },
        "stack": [
          "TypeScript",
          "Decimal.js"
        ]
      },
      {
        "key": "data",
        "label": {
          "fr": "Données locales",
          "en": "Local data"
        },
        "description": {
          "fr": "La couche native Rust utilise SQLite pour conserver les données et les révisions de fiches sur l’ordinateur.",
          "en": "The native Rust layer uses SQLite to store data and payslip revisions on the computer."
        },
        "stack": [
          "Tauri 2",
          "Rust",
          "SQLite",
          "rusqlite"
        ]
      }
    ],
    "excerpts": [
      {
        "key": "interface",
        "label": {
          "fr": "Les totaux de la vue annuelle",
          "en": "Annual-view totals"
        },
        "description": {
          "fr": "La vue Vue additionne les salaires enregistrés et suit séparément les montants payés.",
          "en": "The Vue view totals recorded payroll and tracks paid amounts separately."
        },
        "language": "typescript",
        "file": "src/components/AnnualWorkspace.vue",
        "source": "https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src/components/AnnualWorkspace.vue#L99-L108",
        "code": "const totals = computed(() => ({\n  net: sum(saved.value.map((p) => p.result.net)),\n  gross: sum(saved.value.map((p) => p.result.gross)),\n  deductions: sum(saved.value.map((p) => p.result.deductions)),\n  paid: sum(\n    rows.value.map(\n      (r) => r.p?.paidAmount ?? (r.p?.paidDate ? r.p.result.net : 0),\n    ),\n  ),\n}));",
        "startLine": 99,
        "endLine": 108
      },
      {
        "key": "logic",
        "label": {
          "fr": "Le calcul du salaire net",
          "en": "Net pay calculation"
        },
        "description": {
          "fr": "Le calcul additionne les retenues, puis les déduit du brut et ajoute les remboursements.",
          "en": "The calculation totals deductions, subtracts them from gross pay and adds reimbursements."
        },
        "language": "typescript",
        "file": "src/domain/payroll.ts",
        "source": "https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src/domain/payroll.ts#L411-L422",
        "code": "const deductions = sum(\n    lines.filter((l) => l.category === \"contribution\").map((l) => l.amount),\n  ),\n  employerCost = sum(lines.map((l) => l.employer));\nif (base + absence < 0) errors.push(\"absenceTooHigh\");\nreturn {\n  ...(smallSalary ? { smallSalary } : {}),\n  lines,\n  gross,\n  deductions,\n  reimbursements,\n  net: gross - deductions + reimbursements,",
        "startLine": 411,
        "endLine": 422
      },
      {
        "key": "data",
        "label": {
          "fr": "L’enregistrement d’une révision",
          "en": "Saving a payslip revision"
        },
        "description": {
          "fr": "La couche Rust enregistre une révision de fiche et son PDF dans une transaction SQLite.",
          "en": "The Rust layer saves a payslip revision and its PDF within a SQLite transaction."
        },
        "language": "rust",
        "file": "src-tauri/src/storage.rs",
        "source": "https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src-tauri/src/storage.rs#L361-L371",
        "code": "tx.execute(\n    \"INSERT INTO revisions VALUES(?1,?2,?3,?4,?5)\",\n    params![\n        id,\n        row[\"payrollId\"].as_str().ok_or(\"invalidState\")?,\n        row[\"number\"].as_i64().ok_or(\"invalidState\")?,\n        row.to_string(),\n        pdf\n    ],\n)\n.map_err(err)?;",
        "startLine": 361,
        "endLine": 371
      }
    ]
  },
  "canapey": {
    "key": "canapey",
    "repo": "https://github.com/DwennK/canapey-launcher",
    "commit": "7fdbc66e6a1f672842b51d1779a6015f2e766f7f",
    "roles": [
      {
        "key": "interface",
        "label": {
          "fr": "Interface",
          "en": "Interface"
        },
        "stack": [
          "Vue 3",
          "TypeScript"
        ],
        "description": {
          "fr": "Affiche les applications et gère leur sélection.",
          "en": "Displays applications and handles selection."
        }
      },
      {
        "key": "commands",
        "label": {
          "fr": "Commandes",
          "en": "Commands"
        },
        "stack": [
          "Tauri 2",
          "TypeScript"
        ],
        "description": {
          "fr": "Transmet les actions de l’interface au code natif.",
          "en": "Passes interface actions to native code."
        }
      },
      {
        "key": "runtime",
        "label": {
          "fr": "Windows",
          "en": "Windows"
        },
        "stack": [
          "Rust",
          "Windows APIs"
        ],
        "description": {
          "fr": "Lance les applications et suit leurs processus.",
          "en": "Launches applications and tracks their processes."
        }
      }
    ],
    "excerpts": [
      {
        "key": "interface",
        "label": {
          "fr": "Activer une application",
          "en": "Activate an application"
        },
        "description": {
          "fr": "La carte transmet le clic à l’application, en évitant un déclenchement en double après un appui prolongé.",
          "en": "The card forwards a click while preventing a duplicate action after a long press."
        },
        "language": "typescript",
        "file": "src/components/AppCard.vue",
        "startLine": 52,
        "endLine": 58,
        "source": "https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src/components/AppCard.vue#L52-L58",
        "code": "function click(event: MouseEvent) {\n  if (suppressClick && event.detail !== 0) {\n    suppressClick = false;\n    return;\n  }\n  emit(\"activate\");\n}"
      },
      {
        "key": "commands",
        "label": {
          "fr": "Appeler le code natif",
          "en": "Call native code"
        },
        "description": {
          "fr": "L’interface transmet les demandes de lancement, de reprise et de fermeture à Tauri.",
          "en": "The interface sends launch, resume and close requests to Tauri."
        },
        "language": "typescript",
        "file": "src/lib/bridge.ts",
        "startLine": 73,
        "endLine": 78,
        "source": "https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src/lib/bridge.ts#L73-L78",
        "code": "export const launch = (id: string): Promise<Session> =>\n  native ? invoke(\"launch_app\", { id }) : unavailable();\nexport const resume = (id: string): Promise<void> =>\n  native ? invoke(\"resume_app\", { id }) : unavailable();\nexport const closeApp = (id: string, force = false): Promise<void> =>\n  native ? invoke(\"close_app\", { id, force }) : unavailable();"
      },
      {
        "key": "runtime",
        "label": {
          "fr": "Lancer ou retrouver",
          "en": "Launch or find"
        },
        "description": {
          "fr": "Le code natif retrouve un processus déjà ouvert ou lance l’application demandée.",
          "en": "The native code finds an existing process or launches the requested application."
        },
        "language": "rust",
        "file": "src-tauri/src/runtime.rs",
        "startLine": 468,
        "endLine": 477,
        "source": "https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src-tauri/src/runtime.rs#L468-L477",
        "code": "let existing = path.as_ref().and_then(|p| {\n    before.iter().find(|process| {\n        process.path.eq_ignore_ascii_case(p) && windows.iter().any(|w| w.process == process.key)\n    })\n});\nlet key = if let Some(p) = existing {\n    Some(p.key)\n} else {\n    platform::launch(&item)?\n};"
      }
    ]
  }
};
