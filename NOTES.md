# Actelis Price Quote Tool — Project Notes
> Agregar este archivo al repo: `git add NOTES.md && git commit -m "Add project notes"`

---

## 🌐 Links

| | |
|---|---|
| **Live app** | https://dalejandri.github.io/actelis-price-tool/ |
| **Repo** | https://github.com/dalejandri/actelis-price-tool |
| **Actions** | https://github.com/dalejandri/actelis-price-tool/actions |

---

## 🏢 Actelis Contact Info

```
Actelis Networks, Inc.
710 Lakeway Drive, Ste 200
Sunnyvale, CA 94085
Tel: (510) 545-1045
Tel: (866) 228-3547  [866-ACTELIS]
Fax: (510) 657-8006
```

---

## 🏗 Architecture

- **100% static** — React + Vite, no backend, no auth, no database
- **Deployed** on GitHub Pages via GitHub Actions (~60 sec on every push)
- **Prices** loaded from `public/prices.json` on startup; falls back to embedded
  `PRICE_LIST_FALLBACK` constant (~line 9 of App.jsx) if fetch fails
- **No data stored server-side** — quotes live in browser session only

### File map
```
src/App.jsx          ← Main app + all modals + NodeWizard (~2300 lines)
src/pdfExport.js     ← PDF generation (jsPDF + autotable)
src/AdminUpload.jsx  ← Admin price list upload panel
src/assets/
  actelis-logo.png   ← Logo for PDF export (copy from public/ or re-download)
public/
  prices.json        ← Live price data (update via Admin panel → Export JSON)
.github/workflows/
  deploy.yml         ← CI/CD pipeline
vite.config.js       ← base: '/actelis-price-tool/'
```

---

## 💰 Pricing Architecture

### Region IDs (in EMEA_IDS_MAIN array)
```
4 = EMEA
6 = NA          ← default
5 = Enterprise
2 = APAC
3 = CALA
```
EMEA regions: `[4, 2, 3]` — used to determine whether to show Sales Tax option.

### Discount structure in prices.json
Each discount object has:
```json
{
  "cat": "A2. ML600 Family",
  "naReseller":   0.40,
  "naEndUser":    0.35,
  "regBonus":     0.07,
  "emeaReseller": 0.40,
  "emeaEndUser":  0.30
}
```
`regBonus` = Deal Registration bonus, applied on top for NA only (+7%).

### getDiscMain() signature
```js
getDiscMain(cat, regionId, custType, dealReg, discountsArray)
```

### Service pricing (Category D)
- `listPrice < 1` = percentage of HW total (e.g. 0.05 = 5%)
- `listPrice2` = fixed dollar amount (Prof. Services)

---

## 📦 Product Categories (from Access DB)

From the original Access `Price List` table — categories used in discount rules:

| Code | Category |
|---|---|
| A1.x | GL Solutions (GL800, GL900, GL9000) |
| A2 | ML600 Family |
| A2.1 | ML600D Family |
| A2.2 | ML600 Configurations |
| A3.x | Power Supplies & Accessories |
| A4.x | ML230/ML2300 (Shelves, SDU, MLU, cables) |
| A5.x | Fiber Switches (DIN Rail, Rackmount, In-Pole) |
| A6 | Repeater Related Products ⚠️ wizard not built yet |
| A8.x | BBA Cards & Enclosures ⚠️ wizard not built yet |
| A9 | L3 CPEs |
| B2.x | MetaASSIST EMS Licenses |
| C1 | SFP Transceivers |
| C3 | Power Supply |
| C4.x | DSL Cables, Service cables, Power cables |
| C6 | Remote Line Powered System (X-Pod/Tyco) |
| D2.x | Services (% of HW or fixed $) |

---

## 🔧 Node Configurator Wizard

### Deployment types built
| Type | Status |
|---|---|
| PTP ML600 | ✅ Complete |
| PTMP GL800 | ✅ Complete |
| PTMP GL900 | ✅ Complete |
| PTMP GL9000 | ✅ Complete |
| ML230 / ML2300 | ✅ Complete (custom + bundles) |
| Fiber Switches | ✅ Complete (50+ models) |
| BBA | ❌ Not built |
| Repeater | ❌ Not built |

### Key wizard logic notes
- `makeLines(bomItems, rid, custType, dealReg, replacements)` converts BOM to quote lines
- The wizard uses its own embedded `PRICE_LIST` constant (line ~9), separate from the
  main app fallback on line ~1600
- `bomLines = useMemo(() => makeLines(bom, ...), [bom, ...])`
- `bom = useMemo(() => {...}, [sel, type])` — pure derivation from selections

### ML230/ML2300 Cable logic
- **CHS-2000B** → 64-pair DIN connector cables:
  - US 25ft: `504R60060`, US 100ft: `504R60062`, US 150ft: `504R60063`
  - EU 100ft: `504R60088`
  - qty = MLU qty × node count
- **CHS-200** → RJ-45 DSL cables:
  - Quad 10ft: `504R20110`, Quad 100ft: `504R20140`
  - Octal 10ft: `504R20120`, Octal 100ft: `504R20160`, Octal 150ft: `504R20180`
  - qty = manual input

---

## 📋 Original Access DB — What Was Migrated

### Tables in the original .mdb files
```
Addresses               → Embedded as Actelis address in PDF export
CustContacts            → Not migrated (no customer DB in web version)
CustomerDefaultDiscounts→ Migrated as discount tiers in prices.json
Defaults                → Embedded as defaults in React state
PQuote Summary          → Not migrated (partner quote workflow)
QuoteDiscount           → Implemented as per-line discount override
QuoteTable              → Implemented as lines[] state in React
QuoteTable-Part D       → Implemented as svc_lines[] (% of HW)
QuoteTable-Part D$      → Partially — fixed-price services in services[]
RMAQuote                → Not migrated
WizardTemplates         → Fully reimplemented as NodeWizard component
Customers               → Not migrated (stateless tool)
Quotations              → Implemented as quote header state
```

### Important Access fields that are implemented
- `DealRegistration` → Toggle in Quote Details (+7% NA bonus)
- `AddShippingCost` → Financial Options panel (+2%)
- `AddCCFee` → Financial Options panel (+3%)
- `SalesTax / SalesTax%` → Financial Options panel (NA only)
- `ExtendWarranty` → Financial Options panel (stub — shown but not calculated)
- `IncludeLegacy` → NOT implemented — all products always shown
- `EnableEuro` → NOT implemented — USD only
- `ReportPaper` → NOT implemented — Letter only (A4 variant not built)

### AutoRepeaterInfo table (original Access)
This table drove the wizard combo boxes. It contained:
- `[Part Number]`, `[Description]`, `[PN Type]`, `[NumPairs]`, `[Region]`,
  `[SFP Info]`, `[Legacy]`

**PN Types seen in the SQL queries:**
```
PTP, PTP TDM, PTP Bundle, PTP ML620i Bundle, PTP ML620i CPE
MLU, MLU-32DF Cable US, ML600 Cable (No PFU)
SFP, SFP Cable SM
CPE Only, CO Only, CO and CPE
```
This data was used to build the hardcoded product lists in NodeWizard.
If new products are added, they must be added to both `public/prices.json`
AND the relevant product array in `App.jsx` (e.g. `ML600_STD`, `SFP_OPTIONS`).

---

## ⚠️ Known Gaps / TODO

### Features not yet built
- [ ] **HubSpot REST API** — button exists, not wired
- [ ] **WordPress embed** — iframe shortcode
- [ ] **BBA wizard type** — products exist in catalog (A8.x)
- [ ] **Repeater wizard type** — products exist in catalog (A6)
- [ ] **A4 paper format** — PDF only outputs Letter
- [ ] **EUR currency** — USD only
- [ ] **IncludeLegacy toggle** — all products always shown
- [ ] **PN Replacements persist to prices.json** — session-only currently
- [ ] **ExtendWarranty calculation** — flag exists, not computed

### Data that may need verification
- Discount percentages in `prices.json` were set from the Access DB analysis
  but should be **confirmed with Gary Massone / sales team** before use
- `SVC-HW2WT` and `SVC-SW2WT` (standard warranty) appear at $0 in old quotes —
  currently not in the services list; may need to be added
- `SVC-REMEXT` appears in old quotes at 3% — not in current services list
- Products in categories **A9 (L3 CPEs)** and **C6 (X-Pod/Tyco)** are in the
  price catalog but not tested in the wizard
- **B2.x MetaASSIST EMS** products are in the catalog — EMS Configurator wizard
  was in the original Access tool but not yet built

### Wizard product lists that are hardcoded in App.jsx
If a new product is added to prices.json, it must ALSO be added here:
```
ML600_STD   → PTP ML600 standard models
ML600D      → PTP ML600D models
GL800_HDS   → GL800 headend models
GL900_HDS   → GL900 headend models
GL9000_HDS  → GL9000 headend models
GL9000_CPES → GL9000 CPE models
GL900_CPES  → GL900 CPE models
SFP_OPTIONS → SFP transceiver options
BUNDLES_ML230 → ML230/ML2300 pre-built bundles
(Fiber Switches defined inline in step 1 of SWITCH_FIBER)
```

---

## 📁 How to Update Prices

### Session-only (immediate, no git needed)
1. Click **⚙ Admin** in the nav bar
2. Upload `PriceList.xlsx` (columns: Category | Part Num | Description | Comments | LP $)
3. Review diff → Apply Changes

### Permanent (survives refresh)
1. Do the session-only steps above
2. Click **Export JSON** in Admin panel → saves `prices.json`
3. Copy to `public/prices.json` in the repo
4. `git add public/prices.json && git commit -m "Update price list Q2-2026" && git push`

---

## 🚀 How to Resume in a New Claude Session

Paste this at the start of the chat:

```
Hi Claude — continuing work on the Actelis Networks Price Quote Tool.
Tech stack: React + Vite, GitHub Pages, jsPDF, SheetJS.
Live URL: https://dalejandri.github.io/actelis-price-tool/
Repo: dalejandri/actelis-price-tool

[Describe what you want to work on]
```

Then upload: `src/App.jsx`, `src/pdfExport.js`, `public/prices.json`, `NOTES.md`

---

## 📅 Session History

| Date | Work Done |
|---|---|
| Mar 4 | Access DB analysis & migration discovery |
| Mar 4 | Revised scope: stateless web calculator |
| Mar 4-5 | Sprint 1: Quote builder UI, price/discount logic |
| Mar 9 | Sprint 2: Node Configurator Wizard (5 types), PDF export |
| Mar 9 | Sprint 3a: GitHub Pages deploy, Admin upload panel |
| Mar 9 | Sprint 3b: Wizard rewrite (PTP modes, ML230 custom build) |
| Mar 10 | Sprint 3c: Fiber Switches wizard, cable fixes, SDU-455G |
| Mar 30 | PDF layout matching Access tool, Excel export, Import PDF |
| Mar 30 | Import PDF parser fix, real logo + new tagline in PDF |
| Mar 30 | Nav cleanup, PN Replacements feature, Custom line items |
