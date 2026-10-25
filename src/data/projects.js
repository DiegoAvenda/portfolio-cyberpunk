export const projects = [
  {
    slug: "avendcode",
    hex: "0x01A4",
    title: "AvendCodes",
    productType: "Interactive learning product",
    role: "Sole Developer & Product Architect",
    description:
      "An interactive, zero-setup course that teaches JavaScript, DOM, Canvas 2D and core data structures by building a real Pixel Art Editor — 100% in the browser, no install.",
    status: "STATUS: ACTIVE",
    accent: "cyan",
    proves: "INTERACTIVE_LEARNING_RUNTIME",
    capabilities: [
      "Sandboxed code execution",
      "Lesson content delivery",
      "Local progress persistence",
    ],
    placeholder: "[ VISUAL_DATA_UNAVAILABLE ]",
    techs: [
      { label: "SvelteKit", color: "magenta" },
      { label: "JavaScript", color: "yellow" },
      { label: "CodeMirror_6", color: "cyan" },
      { label: "Tailwind_v4", color: "yellow" },
    ],
    links: {
      demo: "https://avencode.vercel.app/",
      repo: "https://github.com/DiegoAvenda/avencode",
    },
    caseStudy: {
      problem:
        "Teach JavaScript, DOM, Canvas 2D, and core data structures by building — not by watching videos. The problem: beginners can read about arrays, typed memory, DFS/BFS and ring buffers, but they do not feel why they matter. I wanted an interactive, zero-setup course where each lesson is a small runnable project (a Pixel Art Editor, lessons 1–18), with HTML/CSS/JS editing, instant visual feedback, and a captured console — all running 100% in the browser with progress in localStorage.",
      architecture: [
        "Client-only SvelteKit app (Svelte 5 runes, ssr = false, no backend, no network requests).",
        "Routes: / (module list + progress + continue) and /lesson/[id] (player with shareable URLs, validated id).",
        "Lab workspace: Playground.svelte = LessonPanel + CodeEditor (CodeMirror 6, one state per tab) + Preview (sandboxed iframe[srcdoc]) + ConsoleDrawer.",
        "Playground bridge: buildSrcDoc.js assembles a single HTML doc — injects a console/error bridge via postMessage, inlines learner CSS/JS, escapes </script>/</style>; iframeProtocol.js parses messages and Preview.svelte only accepts event.source === iframe.",
        "Content model: lessons.js is the single source of truth (modules, phases, lessonList, lazy loaders); heavy prose + starter code live in curriculum/lesson-NN.js and load on demand via loadLesson(id).",
        "Rendering/styling: dependency-free markdown.js (escaped HTML, fixed tag allowlist) + Tailwind v4 utilities with cyberpunk @theme tokens. Lesson starter CSS stays plain CSS on purpose — it is teaching material.",
        "Persistence: versioned localStorage progress (currentLesson, completedLessons, editorContents) with pure migrations; lab layout prefs live in a separate key.",
      ],
      tradeoffs: [
        {
          chose:
            "Sandboxed srcdoc iframe (allow-scripts, no allow-same-origin)",
          over: "eval() / same-origin iframe",
          because:
            "learner code cannot touch the app or leak data; cost is we cannot measure DOM size directly, so the bridge reports its own size for Fit mode.",
        },
        {
          chose: "Lightweight index + import() per lesson",
          over: "bundling all 18 lessons",
          because: "fast shell load; cost is async lesson loading to handle.",
        },
        {
          chose: "Dependency-free markdown renderer",
          over: "marked",
          because:
            "zero deps, XSS-safe by construction (escapeHtml + allowlisted tags/links); cost is only a subset of markdown is supported.",
        },
        {
          chose: "Client-only + localStorage",
          over: "backend DB/auth",
          because:
            "zero infra, offline, private; cost is no cross-device sync.",
        },
        {
          chose: "node:test",
          over: "Vitest/Jest",
          because:
            "no extra deps, curriculum invariants run fast; cost is no browser e2e harness.",
        },
        {
          chose:
            "Tailwind utilities in app UI, plain CSS in lesson starter code",
          over: "one styling approach for both",
          because:
            "app stays consistent, lessons stay readable for beginners learning the cascade.",
        },
      ],
      challenges: [
        {
          issue:
            "Silent empty console: a lesson declared a top-level parent, shadowing window.parent and breaking postMessage inside try/catch.",
          fix: "Captured const bridgeTarget = window.parent before any learner code runs.",
        },
        {
          issue:
            "Run did nothing on identical code: the iframe reused an identical srcdoc without reloading.",
          fix: "Appended a unique build marker comment per build so each run forces a reload.",
        },
        {
          issue:
            "Double execution on mount: the Svelte $effect re-ran the initial onMount build.",
          fix: "Skipped the first effect run.",
        },
        {
          issue:
            "Broken curriculum imports: escaping the opening backtick in lesson template literals silently invalidated the module.",
          fix: "Caught by node --test (JS parse + getElementById / CSS class invariants).",
        },
        {
          issue:
            "Stale per-lesson state: editor, history, and console leaked across lessons.",
          fix: "Deliberate {#key lesson.id} remount + debounced saves that capture the lesson id and flush on destroy.",
        },
      ],
      retrospective:
        "Today I would add adapter-static as the default for portable hosting, a minimal Playwright smoke test (Run → preview executes once → console receives message) alongside node:test, and a formal checker protocol for challenge lessons instead of ad-hoc DOM assertions. I would also version the curriculum from day one — any renumber/insert/move already requires a STORAGE_VERSION bump, and I learned that lesson late.",
    },
  },
  {
    slug: "contaco",
    hex: "0x02B7",
    title: "Contaco",
    productType: "Multi-tenant restaurant operations SaaS",
    role: "Sole Developer & Software Architect",
    description:
      "A multi-tenant SvelteKit app unifying in-store POS, commission-free online ordering with Stripe, expense tracking, and SAT-ready RESICO fiscal estimates for small Mexican restaurants — money in integer cents, never floats.",
    status: "STATUS: ACTIVE",
    accent: "magenta",
    proves: "COMMERCE_AND_FISCAL_SYSTEMS",
    capabilities: [
      "POS and online ordering",
      "Idempotent Stripe payments",
      "SAT-ready fiscal estimates",
    ],
    placeholder: "[ VISUAL_DATA_UNAVAILABLE ]",
    techs: [
      { label: "SvelteKit", color: "magenta" },
      { label: "MongoDB", color: "yellow" },
      { label: "Stripe", color: "cyan" },
      { label: "Cloudflare_R2", color: "magenta" },
    ],
    links: {
      demo: "https://contaco.store",
      repo: "https://github.com/DiegoAvenda/conta",
    },
    caseStudy: {
      problem:
        "Small Mexican restaurants juggle 5 disconnected tools: a POS, WhatsApp/commission-based delivery, Excel for expenses, and a painful month-end scramble for SAT taxes. The technical question: can a single multi-tenant SvelteKit app unify in-store sales, commission-free online ordering, expense tracking, and a useful fiscal estimate for Mexico's RESICO regime — without becoming unmaintainable or financially incorrect? Key constraints: money must never drift (no float errors), online payments must never create duplicate orders, and tax numbers must map to real SAT concepts (effectively-collected income, transferred vs. creditable IVA, tiered RESICO ISR rate).",
      architecture: [
        "Full-stack monolith: SvelteKit (SSR) + MongoDB + Better-Auth + Stripe + Cloudflare R2, deployed on Vercel (adapter-vercel).",
        "Multi-tenant by userId: one MongoDB database, every collection (orders, ventas, facturas, movimientos, menuItems) is scoped by owner userId — no per-restaurant DBs to migrate.",
        "Server-first writes: POS uses SvelteKit form actions (pos/+page.server.js), checkout uses API routes (api/stripe/checkout/+server.js); prices are always re-resolved server-side from the owner's menu — the client cart is untrusted.",
        "Single order schema: POS (dine-in/takeout) and Stripe delivery webhooks produce the same orders document, so Comandas, Dashboard, and SAT closing need zero branching.",
        "Double-write ledger: a paid order creates ventas + an immutable movimientos entry (cobro/devolucion/cancelacion with idempotencyKey); fiscal reports aggregate from those and never mutate orders in place.",
        "Pure fiscal core: lib/server/fiscal.js (buildMonthlyFiscalSummary) is side-effect free — sales minus refunds, CFDI-only creditable IVA, RESICO bracket lookup; UI pages just fetch 3 collections in parallel and call it.",
        "Money in integer cents: all parsing/formatting centralized in lib/server/money.js + lib/utils/money.js (parseMoneyToCents, pesosToCents).",
        "Assets via R2 S3-API: menu images go to R2 (lib/server/r2.js), only imageKey is stored in Mongo, the public URL is derived at read time.",
      ],
      tradeoffs: [
        {
          chose: "Integer cents",
          over: "floats/Decimal128",
          because:
            "avoids 0.1 + 0.2 rounding in IVA/totals and keeps Mongo aggregations ($sum) trivial and exact.",
        },
        {
          chose: "Stripe Checkout + pendingCheckouts draft",
          over: "PaymentIntents custom UI",
          because:
            "less UI control, but PCI scope drops to zero and the webhook always has a draft to materialize even if the client disconnects; a TTL index (expireAfterSeconds: 24h) auto-purges unpaid drafts.",
        },
        {
          chose: "Idempotent webhook + unique index (stripeSessionId)",
          over: "check-then-insert",
          because:
            "Stripe retries deliveries; findOne + unique index + catch 11000 makes double-processing impossible under parallel delivery.",
        },
        {
          chose:
            "CFDI XML parsed on ingest (fast-xml-parser, normalized to cents)",
          over: "storing raw XML",
          because:
            "queries for monthly IVA become simple range scans, at the cost of losing original line-item detail.",
        },
        {
          chose: "Monolith SSR",
          over: "SPA + separate API",
          because:
            "form actions give progressive enhancement and simpler auth (locals.user), at the cost of tighter coupling to SvelteKit.",
        },
      ],
      challenges: [
        {
          issue:
            "CFDI XML shape-shifting: SAT namespaces (cfdi:, tfd:) broke attribute access, and single-concept invoices parse as object instead of array.",
          fix: "Stripped NS prefixes (removeNSPrefix: true) and normalized everything to arrays; hard-fail if TimbreFiscalDigital.UUID is missing (not a stamped invoice).",
        },
        {
          issue: "Duplicate paid orders on Stripe retries.",
          fix: "orders.createIndex({stripeSessionId:1},{unique:true,sparse:true}) + early findOne + swallow duplicate-key error, returning 500 only on transient Mongo failures so Stripe retries correctly.",
        },
        {
          issue:
            "IVA double-counting: cash expenses without invoice were inflating creditable IVA.",
          fix: "Explicit esGastoConCfdi() rule — only CFDI expenses count toward ivaAcreditable; the rest still subtract from operational profit.",
        },
      ],
      retrospective: [
        "Add Mongo transactions around orders → ventas → movimientos creation (currently idempotent but not atomic).",
        "Move fiscal constants (RESICO table, 16% rate) into versioned config with effective dates instead of hardcoded modules.",
        "Add contract tests for the fiscal engine edge cases (refunds > sales, mixed 0%/16% IVA).",
        "Put a queue + signature-verified job behind the Stripe webhook instead of doing all work inline.",
      ],
    },
  },
  {
    slug: "naveddy",
    hex: "0x03C9",
    title: "NAVEDDY",
    productType: "Mobile-first personal finance app for Mexico",
    role: "Sole Developer & Product Architect",
    description:
      "A mobile-first personal finance app for Mexico that turns receipt photos into categorized expenses with AI, compares a monthly plan against real spending, and shows where the money actually went — built with SvelteKit, MongoDB and self-hostable Better Auth.",
    status: "STATUS: ACTIVE",
    accent: "yellow",
    proves: "AI_ASSISTED_PERSONAL_FINANCE",
    capabilities: [
      "AI receipt scanning",
      "Planned vs. actual budgets",
      "Category analytics",
    ],
    placeholder: "[ VISUAL_DATA_UNAVAILABLE ]",
    techs: [
      { label: "SvelteKit", color: "magenta" },
      { label: "Svelte_5", color: "yellow" },
      { label: "MongoDB", color: "magenta" },
      { label: "Better_Auth", color: "cyan" },
    ],
    links: {
      demo: "https://contlana.vercel.app/",
      repo: "https://github.com/DiegoAvenda/svelttergo-fincheck",
    },
    caseStudy: {
      problem:
        "NAVEDDY is a mobile-first personal finance app for Mexico: register income and expenses in seconds, photograph a receipt and let AI break it into categorized items, then plan a monthly budget and compare it with what was actually spent. The product question was how to make receipt capture useful without trusting the model blindly: Mexican receipts use abbreviations and department headers, free vision models hallucinate or return malformed JSON, and a wrong category silently corrupts every downstream chart and budget. The second constraint was local correctness: money in integer cents, America/Mexico_City dates, and a category catalog stable enough for historical analytics while still letting users create their own categories and subcategories.",
      architecture: [
        "Full-stack SvelteKit monolith: SvelteKit 2 + Svelte 5 runes with SSR and adapter-vercel, Tailwind CSS v4, and Better Auth (email/password + Google OAuth) on the official MongoDB adapter. The session is resolved once per request in hooks.server.js into locals.user; every authenticated route is guarded in (app)/+layout.server.js, which also runs ensureIndexes() and the idempotent ensureFixedCategories() migration.",
        "Data access is isolated in src/lib/server/repos/* (movements, budgets, categories, custom catalog, settings, item corrections); routes only authorize, validate and serialize. Movements store integer cents plus embedded ticket items; budgets are one document per user and calendar month with explicit periodStart/periodEndExclusive; custom subcategories live in user_subcategories; categoryKey/subcategoryKey are stable strings so renames never break analytics.",
        "AI pipeline: upload → parseTicketImage (vision call to Groq with OpenRouter fallback, Zod-validated JSON) → classifyItems (the fixed subcategory catalog is the only allowed vocabulary; prior user corrections are applied before calling the model; conservative keyword/department fallbacks when the model is unavailable) → user review → createMovement + upsertItemCorrection. The server derives the parent category from the chosen subcategory, so the model can never invent or reassign the taxonomy.",
        'Budget flow: resolveCurrentPeriod() fixes the calendar month; only the current month is editable and previous months are read-only. A proposal (?/propose) copies the last confirmed budget into a status:"draft" document, excludes hidden catalog entries, and never touches the source; ?/save confirms it. Planned income lives on the budget and never creates a real movement; real spending without a budget line is listed separately instead of being assigned a fictional limit.',
        "Pure, testable core: money.js, periods.js, budget-math.js, spending-math.js, catalog-usage.js and correction-decision.js hold all financial, date and catalog rules as side-effect-free functions covered by node:test. Server analytics (spending by category/subcategory, period comparison, category detail) are MongoDB aggregation pipelines, and only strings, numbers and ISO dates cross to the client.",
        "Learning loop: item_corrections stores only what the user actually changed (an ambiguous item clarified, a description edited, a category or subcategory corrected), keyed by userId + itemCode or userId + store + normalizedDescription. Predictions the AI got right are never persisted, which keeps the table small and makes repeat receipts cheaper and more accurate.",
      ],
      tradeoffs: [
        {
          chose: "Native MongoDB driver",
          over: "ORM (Mongoose/Prisma)",
          because:
            "full control over indexes (including the unique partial index on userId + periodStart), atomic upserts and aggregation pipelines, with no schema layer for a handful of collections; the cost is validating document shape by hand.",
        },
        {
          chose: "SvelteKit form actions + server load",
          over: "separate REST API",
          because:
            "auth and data live on the server, forms work without JavaScript, and there is very little client state; the cost is tighter coupling to SvelteKit and full-page reloads after writes.",
        },
        {
          chose: "Integer cents",
          over: "floats / Decimal128",
          because:
            "sums stay exact and MongoDB $group aggregations are trivial; the cost is parsing and formatting at every boundary.",
        },
        {
          chose: "Fixed category/subcategory keys with AI constrained to them",
          over: "AI-generated labels",
          because:
            "historical analytics stay stable and the taxonomy remains user-owned; the cost is that ambiguous items stay pending until a human reviews them.",
        },
        {
          chose: "Two-stage AI (vision extraction, then text classification)",
          over: "one mega-prompt",
          because:
            "each stage can be retried, validated and degraded independently, and corrections can short-circuit the classifier; the cost is more orchestration and up to two model calls.",
        },
        {
          chose: "Draft proposals",
          over: "auto-copying the previous budget",
          because:
            "no monthly budget is silently overwritten and the user explicitly confirms it; the cost is extra draft state and a replacedConfirmed guard.",
        },
      ],
      challenges: [
        {
          issue:
            "Vision models returned JSON wrapped in prose, fenced code blocks or truncated output, and Zod rejected the whole ticket.",
          fix: "extractJson finds the first { or [, balances brackets with string/escape awareness and retries after stripping trailing commas; the result is Zod-validated and every failure maps to an actionable message with a manual-entry path.",
        },
        {
          issue:
            "The model sometimes assigned a category directly or invented a subcategory key that did not exist.",
          fix: "The fixed subcategory catalog is the single source of truth: keys are validated server-side, the parent category is derived from the key, and unknown values become pending instead of creating data.",
        },
        {
          issue:
            "Users had to reclassify the same products on every receipt, but saving every AI prediction would have polluted the correction memory.",
          fix: "item_corrections is looked up before calling the model (by itemCode or store + normalizedDescription) and only stores fields the user actually changed, guarded by shouldPersistCorrection.",
        },
        {
          issue:
            "Legacy budgets and categories had no month boundaries, so duplicate or ambiguous periods could coexist.",
          fix: "A unique partial index on { userId, periodStart } plus conservative deduplication in ensureIndexes() retires the old unique { userId, monthKey } index and parks duplicates with legacy-<id> instead of deleting amounts.",
        },
        {
          issue:
            "Custom and hidden categories threatened historical data: deleting one could orphan movements, ticket items or budget lines from past months.",
          fix: "Deletion is allowed only with zero references across movements, ticket items and every month of budgets; otherwise the server offers Hide, which preserves names, amounts and budget lines while excluding the category from new assignments.",
        },
        {
          issue:
            "Free-tier AI quotas produced 429s, timeouts and empty responses.",
          fix: "Groq is primary with OpenRouter as fallback, AbortController timeouts bound each call, local keyword/department rules recover what they can, and the UI always falls back to manual entry.",
        },
      ],
      retrospective: [
        "Add Playwright coverage for the two riskiest flows (scan → review → save, and propose → edit → confirm); node:test currently covers only pure utilities.",
        "Move receipt processing to a queued job with retries and persist the original image, instead of running vision + classification inline in one request.",
        "Add per-user AI quotas and rate limiting, and track auto-classification accuracy (accepted vs. corrected) to tune prompts with data.",
        "Finish Zod coverage on the remaining form actions and paginate the movements history.",
        "Replace full-page reloads after manual entry with optimistic updates while keeping server actions as the source of truth.",
        "Enable checkJs / generated JSDoc types at the server boundary to catch ObjectId or Date leaks before runtime.",
      ],
    },
  },
]
