export const projects = [
  {
    slug: 'avendcode',
    hex: '0x01A4',
    title: 'AvendCodes',
    productType: 'Interactive learning product',
    role: 'Sole Developer & Product Architect',
    description:
      'An interactive, zero-setup course that teaches JavaScript, DOM, Canvas 2D and core data structures by building a real Pixel Art Editor — 100% in the browser, no install.',
    status: 'STATUS: ACTIVE',
    accent: 'cyan',
    proves: 'INTERACTIVE_LEARNING_RUNTIME',
    capabilities: ['Sandboxed code execution', 'Lesson content delivery', 'Local progress persistence'],
    placeholder: '[ VISUAL_DATA_UNAVAILABLE ]',
    techs: [
      { label: 'SvelteKit', color: 'magenta' },
      { label: 'JavaScript', color: 'yellow' },
      { label: 'CodeMirror_6', color: 'cyan' },
      { label: 'Tailwind_v4', color: 'yellow' },
    ],
    links: { demo: 'https://avencode.vercel.app/', repo: 'https://github.com/DiegoAvenda/avencode' },
    caseStudy: {
      problem:
        'Teach JavaScript, DOM, Canvas 2D, and core data structures by building — not by watching videos. The problem: beginners can read about arrays, typed memory, DFS/BFS and ring buffers, but they do not feel why they matter. I wanted an interactive, zero-setup course where each lesson is a small runnable project (a Pixel Art Editor, lessons 1–18), with HTML/CSS/JS editing, instant visual feedback, and a captured console — all running 100% in the browser with progress in localStorage.',
      architecture: [
        'Client-only SvelteKit app (Svelte 5 runes, ssr = false, no backend, no network requests).',
        'Routes: / (module list + progress + continue) and /lesson/[id] (player with shareable URLs, validated id).',
        'Lab workspace: Playground.svelte = LessonPanel + CodeEditor (CodeMirror 6, one state per tab) + Preview (sandboxed iframe[srcdoc]) + ConsoleDrawer.',
        'Playground bridge: buildSrcDoc.js assembles a single HTML doc — injects a console/error bridge via postMessage, inlines learner CSS/JS, escapes </script>/</style>; iframeProtocol.js parses messages and Preview.svelte only accepts event.source === iframe.',
        'Content model: lessons.js is the single source of truth (modules, phases, lessonList, lazy loaders); heavy prose + starter code live in curriculum/lesson-NN.js and load on demand via loadLesson(id).',
        'Rendering/styling: dependency-free markdown.js (escaped HTML, fixed tag allowlist) + Tailwind v4 utilities with cyberpunk @theme tokens. Lesson starter CSS stays plain CSS on purpose — it is teaching material.',
        'Persistence: versioned localStorage progress (currentLesson, completedLessons, editorContents) with pure migrations; lab layout prefs live in a separate key.',
      ],
      tradeoffs: [
        {
          chose: 'Sandboxed srcdoc iframe (allow-scripts, no allow-same-origin)',
          over: 'eval() / same-origin iframe',
          because:
            'learner code cannot touch the app or leak data; cost is we cannot measure DOM size directly, so the bridge reports its own size for Fit mode.',
        },
        {
          chose: 'Lightweight index + import() per lesson',
          over: 'bundling all 18 lessons',
          because: 'fast shell load; cost is async lesson loading to handle.',
        },
        {
          chose: 'Dependency-free markdown renderer',
          over: 'marked',
          because:
            'zero deps, XSS-safe by construction (escapeHtml + allowlisted tags/links); cost is only a subset of markdown is supported.',
        },
        {
          chose: 'Client-only + localStorage',
          over: 'backend DB/auth',
          because: 'zero infra, offline, private; cost is no cross-device sync.',
        },
        {
          chose: 'node:test',
          over: 'Vitest/Jest',
          because: 'no extra deps, curriculum invariants run fast; cost is no browser e2e harness.',
        },
        {
          chose: 'Tailwind utilities in app UI, plain CSS in lesson starter code',
          over: 'one styling approach for both',
          because:
            'app stays consistent, lessons stay readable for beginners learning the cascade.',
        },
      ],
      challenges: [
        {
          issue:
            'Silent empty console: a lesson declared a top-level parent, shadowing window.parent and breaking postMessage inside try/catch.',
          fix: 'Captured const bridgeTarget = window.parent before any learner code runs.',
        },
        {
          issue:
            'Run did nothing on identical code: the iframe reused an identical srcdoc without reloading.',
          fix: 'Appended a unique build marker comment per build so each run forces a reload.',
        },
        {
          issue:
            'Double execution on mount: the Svelte $effect re-ran the initial onMount build.',
          fix: 'Skipped the first effect run.',
        },
        {
          issue:
            'Broken curriculum imports: escaping the opening backtick in lesson template literals silently invalidated the module.',
          fix: 'Caught by node --test (JS parse + getElementById / CSS class invariants).',
        },
        {
          issue: 'Stale per-lesson state: editor, history, and console leaked across lessons.',
          fix: 'Deliberate {#key lesson.id} remount + debounced saves that capture the lesson id and flush on destroy.',
        },
      ],
      retrospective:
        'Today I would add adapter-static as the default for portable hosting, a minimal Playwright smoke test (Run → preview executes once → console receives message) alongside node:test, and a formal checker protocol for challenge lessons instead of ad-hoc DOM assertions. I would also version the curriculum from day one — any renumber/insert/move already requires a STORAGE_VERSION bump, and I learned that lesson late.',
    },
  },
  {
    slug: 'contaco',
    hex: '0x02B7',
    title: 'Contaco',
    productType: 'Multi-tenant restaurant operations SaaS',
    role: 'Sole Developer & Software Architect',
    description:
      'A multi-tenant SvelteKit app unifying in-store POS, commission-free online ordering with Stripe, expense tracking, and SAT-ready RESICO fiscal estimates for small Mexican restaurants — money in integer cents, never floats.',
    status: 'STATUS: ACTIVE',
    accent: 'magenta',
    proves: 'COMMERCE_AND_FISCAL_SYSTEMS',
    capabilities: ['POS and online ordering', 'Idempotent Stripe payments', 'SAT-ready fiscal estimates'],
    placeholder: '[ VISUAL_DATA_UNAVAILABLE ]',
    techs: [
      { label: 'SvelteKit', color: 'magenta' },
      { label: 'MongoDB', color: 'yellow' },
      { label: 'Stripe', color: 'cyan' },
      { label: 'Cloudflare_R2', color: 'magenta' },
    ],
    links: { demo: 'https://contaco.store', repo: 'https://github.com/DiegoAvenda/conta' },
    caseStudy: {
      problem:
        "Small Mexican restaurants juggle 5 disconnected tools: a POS, WhatsApp/commission-based delivery, Excel for expenses, and a painful month-end scramble for SAT taxes. The technical question: can a single multi-tenant SvelteKit app unify in-store sales, commission-free online ordering, expense tracking, and a useful fiscal estimate for Mexico's RESICO regime — without becoming unmaintainable or financially incorrect? Key constraints: money must never drift (no float errors), online payments must never create duplicate orders, and tax numbers must map to real SAT concepts (effectively-collected income, transferred vs. creditable IVA, tiered RESICO ISR rate).",
      architecture: [
        'Full-stack monolith: SvelteKit (SSR) + MongoDB + Better-Auth + Stripe + Cloudflare R2, deployed on Vercel (adapter-vercel).',
        'Multi-tenant by userId: one MongoDB database, every collection (orders, ventas, facturas, movimientos, menuItems) is scoped by owner userId — no per-restaurant DBs to migrate.',
        "Server-first writes: POS uses SvelteKit form actions (pos/+page.server.js), checkout uses API routes (api/stripe/checkout/+server.js); prices are always re-resolved server-side from the owner's menu — the client cart is untrusted.",
        'Single order schema: POS (dine-in/takeout) and Stripe delivery webhooks produce the same orders document, so Comandas, Dashboard, and SAT closing need zero branching.',
        'Double-write ledger: a paid order creates ventas + an immutable movimientos entry (cobro/devolucion/cancelacion with idempotencyKey); fiscal reports aggregate from those and never mutate orders in place.',
        'Pure fiscal core: lib/server/fiscal.js (buildMonthlyFiscalSummary) is side-effect free — sales minus refunds, CFDI-only creditable IVA, RESICO bracket lookup; UI pages just fetch 3 collections in parallel and call it.',
        'Money in integer cents: all parsing/formatting centralized in lib/server/money.js + lib/utils/money.js (parseMoneyToCents, pesosToCents).',
        'Assets via R2 S3-API: menu images go to R2 (lib/server/r2.js), only imageKey is stored in Mongo, the public URL is derived at read time.',
      ],
      tradeoffs: [
        {
          chose: 'Integer cents',
          over: 'floats/Decimal128',
          because:
            'avoids 0.1 + 0.2 rounding in IVA/totals and keeps Mongo aggregations ($sum) trivial and exact.',
        },
        {
          chose: 'Stripe Checkout + pendingCheckouts draft',
          over: 'PaymentIntents custom UI',
          because:
            'less UI control, but PCI scope drops to zero and the webhook always has a draft to materialize even if the client disconnects; a TTL index (expireAfterSeconds: 24h) auto-purges unpaid drafts.',
        },
        {
          chose: 'Idempotent webhook + unique index (stripeSessionId)',
          over: 'check-then-insert',
          because:
            'Stripe retries deliveries; findOne + unique index + catch 11000 makes double-processing impossible under parallel delivery.',
        },
        {
          chose: 'CFDI XML parsed on ingest (fast-xml-parser, normalized to cents)',
          over: 'storing raw XML',
          because:
            'queries for monthly IVA become simple range scans, at the cost of losing original line-item detail.',
        },
        {
          chose: 'Monolith SSR',
          over: 'SPA + separate API',
          because:
            'form actions give progressive enhancement and simpler auth (locals.user), at the cost of tighter coupling to SvelteKit.',
        },
      ],
      challenges: [
        {
          issue:
            'CFDI XML shape-shifting: SAT namespaces (cfdi:, tfd:) broke attribute access, and single-concept invoices parse as object instead of array.',
          fix: 'Stripped NS prefixes (removeNSPrefix: true) and normalized everything to arrays; hard-fail if TimbreFiscalDigital.UUID is missing (not a stamped invoice).',
        },
        {
          issue: 'Duplicate paid orders on Stripe retries.',
          fix: 'orders.createIndex({stripeSessionId:1},{unique:true,sparse:true}) + early findOne + swallow duplicate-key error, returning 500 only on transient Mongo failures so Stripe retries correctly.',
        },
        {
          issue: 'IVA double-counting: cash expenses without invoice were inflating creditable IVA.',
          fix: 'Explicit esGastoConCfdi() rule — only CFDI expenses count toward ivaAcreditable; the rest still subtract from operational profit.',
        },
      ],
      retrospective: [
        'Add Mongo transactions around orders → ventas → movimientos creation (currently idempotent but not atomic).',
        'Move fiscal constants (RESICO table, 16% rate) into versioned config with effective dates instead of hardcoded modules.',
        'Add contract tests for the fiscal engine edge cases (refunds > sales, mixed 0%/16% IVA).',
        'Put a queue + signature-verified job behind the Stripe webhook instead of doing all work inline.',
      ],
    },
  },
  {
    slug: 'fincheck',
    hex: '0x03C9',
    title: 'FinCheck',
    productType: 'Personal finance web application',
    role: 'Full-Stack Developer',
    description:
      'A personal finance dashboard that answers where your money goes, flags over-budget spending, scores financial health, and generates savings advice — migrated from AWS Amplify Gen 2 to self-hostable Better Auth + MongoDB.',
    status: 'STATUS: ACTIVE',
    accent: 'yellow',
    proves: 'AUTHENTICATED_FINANCE_PLATFORM',
    capabilities: ['Budget monitoring', 'Financial health scoring', 'Self-hostable authentication'],
    placeholder: '[ VISUAL_DATA_UNAVAILABLE ]',
    techs: [
      { label: 'Next.js_16', color: 'yellow' },
      { label: 'MongoDB', color: 'magenta' },
      { label: 'Better_Auth', color: 'cyan' },
      { label: 'Zustand', color: 'yellow' },
    ],
    links: { demo: 'https://next-fincheck.vercel.app/', repo: 'https://github.com/DiegoAvenda/next-fincheck' },
    caseStudy: {
      problem:
        'FinCheck is a personal finance dashboard that answers: "Where is my money going, am I over budget, and what should I do next?" It tracks income/expenses, breaks spending down by category, fires budget alerts, evaluates the 50/30/20 rule, computes a financial health score, and generates contextual savings/investment advice (including compound-interest projections). A second technical problem was migration: replacing the previous AWS Amplify Gen 2 backend (Cognito + DynamoDB/AppSync) with a self-hostable stack — Google OAuth via Better Auth + MongoDB — without breaking the existing UX.',
      architecture: [
        'Next.js 16 (App Router) + React 19 client dashboard (app/page.js), Tailwind CSS 4, Zustand for shared client state (lib/store.js), a pure memoized finance engine (lib/financeCalculations.js), and thin Route Handler APIs (/api/bootstrap, /api/transactions, /api/budgets, /api/data/reset, /api/auth/[...all]).',
        'Flow: Better Auth session cookie → Route Handler validates via getSessionFromRequest() → server repository (lib/server/finance.js) queries MongoDB scoped by userId → Zustand store updates optimistically → useMemo derived selectors recompute totals, breakdowns, alerts, 50/30/20, health score, and advice.',
        'Why: all financial math is pure, testable functions with zero React coupling; all persistence is user-scoped server-side (transactions { userId, id, ... }, budgets { userId, values } with unique indexes on userId+id and userId); the Mongo connection is a lazily-initialized, globally-cached singleton (lib/mongodb.js) so next build never opens a socket.',
      ],
      tradeoffs: [
        {
          chose: 'Native MongoDB driver',
          over: 'ORM (Mongoose/Prisma)',
          because:
            'full control over indexes, upserts, and document shape with zero schema-migration overhead for a two-collection model.',
        },
        {
          chose: 'Better Auth + MongoDB',
          over: 'AWS Amplify Gen 2',
          because:
            'removes Cognito/DynamoDB/AppSync vendor lock-in; runs locally with mongod or free Atlas, simpler OAuth callback model.',
        },
        {
          chose: 'Optimistic Zustand updates',
          over: 'pessimistic refetch',
          because:
            'instant UI on add/edit/delete with rollback on failure (store.js); better perceived latency at the cost of manual revert logic.',
        },
        {
          chose: 'Route Handlers',
          over: 'Server Actions',
          because:
            'explicit REST surface (lib/apiClient.js), easy error-status propagation (401 → "session expired") and reuse from any client.',
        },
        {
          chose: 'Opt-in MongoDB transactions (MONGODB_TRANSACTIONS=false by default)',
          over: 'always-on transactions',
          because:
            'works on standalone local mongod without a replica set; only Atlas/replica-set deployments enable them.',
        },
      ],
      challenges: [
        {
          issue:
            "MongoDB upsert conflict: repeating id/userId in both $set and $setOnInsert threw \"Updating the path 'id' would create a conflict\".",
          fix: 'Kept them only in the filter + $setOnInsert (lib/server/finance.js).',
        },
        {
          issue: 'Build-time DB connections: importing Mongo at module scope broke next build.',
          fix: 'Lazy connection — new MongoClient() creates no socket until the first query — plus a globalThis cache for dev HMR.',
        },
        {
          issue:
            "Standalone Mongo vs. replica sets: Better Auth's adapter wanted transactions that local mongod doesn't support.",
          fix: 'Made it env-gated (transaction flag in lib/auth.js, enabled only when MONGODB_TRANSACTIONS is true).',
        },
        {
          issue: 'Empty-state UX: first login showed a blank dashboard.',
          fix: 'Added auto-seeding of demo transactions/budgets on the first getFinanceData() call so charts, alerts, and the advisor render immediately.',
        },
      ],
      retrospective: [
        'Move the dashboard shell to React Server Components and keep only modals/tables as Client Components to cut initial JS.',
        'Add Zod validation on API inputs (current normalizeTransaction/normalizeBudgets is hand-rolled).',
        'Add unit tests for financeCalculations.js (pure functions — cheapest high-value coverage) plus integration tests for the userId-scoping invariant.',
        'Paginate /api/bootstrap instead of loading all transactions.',
        'Add rate-limiting and E2E tests for the Google OAuth callback flow.',
      ],
    },
  },
]
