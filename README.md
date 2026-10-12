# Mohasib Financial Group, LLC — Corporate Website

A modern, high-converting financial services platform engineered for **Mohasib Financial Group, LLC** ([www.mohasib.us](https://www.mohasib.us)).

Built with modern fintech design principles: clean corporate typography, glassmorphism UI cards, dark/light contrast elements, interactive tax and payroll savings calculators, a dynamic pricing and proposal builder, an interactive appointment scheduler, a secure client vault mockup, and dynamic data binding driven by `content.json`.

---

## 📁 1. Project Folder Structure

```text
mohasib-financial-group/
├── index.html               # Main semantic HTML5 homepage with JSON-LD SEO schema
├── css/
│   └── styles.css           # Modern fintech styling, glassmorphism, animations & tokens
├── js/
│   └── app.js               # Interactive calculator, pricing builder, booking modal wizard & dynamic loader
├── data/
│   └── content.json         # Dynamic content storage (phone, services, pricing, FAQs, copy)
├── admin/
│   └── cms-preview.html     # Visual in-browser Content Manager & JSON exporter
├── vercel.json              # Vercel deployment & security headers configuration
├── netlify.toml             # Netlify deployment & caching rules configuration
└── README.md                # Deployment, Squarespace DNS setup, and maintenance guide
```

---

## 🚀 2. Local Testing & Preview

You can test this project locally using any of these simple methods:

### Option A: Double-Click
Simply double-click `index.html` in your file explorer to view the site directly in Chrome, Edge, or Firefox. All calculators, modal flows, and styles are fully functional.

### Option B: Local HTTP Server (Recommended)
If you have Node.js or Python installed, run one of the following commands inside `mohasib-financial-group`:

**Using Node.js:**
```bash
npx serve .
# Opens at http://localhost:3000
```

**Using Python:**
```bash
python -m http.server 8080
# Opens at http://localhost:8080
```

---

## 🌐 3. How to Deploy to Vercel or Netlify

### Deploying to Vercel (Recommended)
1. Create a free account at [vercel.com](https://vercel.com).
2. Install the Vercel CLI (`npm i -g vercel`) or push this folder to a GitHub/GitLab repository.
3. If using the CLI, open your terminal in `mohasib-financial-group` and run:
   ```bash
   vercel
   ```
4. Follow the brief prompts:
   - *Set up and deploy?* `y`
   - *Which scope?* (Select your personal account)
   - *Link to existing project?* `n`
   - *Project name?* `mohasib-financial-group`
   - *Directory located?* `./`
5. Vercel will output a live production preview URL in under 30 seconds!

### Deploying to Netlify (Drag-and-Drop)
1. Sign in to [netlify.com](https://app.netlify.com).
2. Navigate to **Sites** and locate the **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"** area.
3. Drag the entire `mohasib-financial-group` folder into the drop zone.
4. Netlify will deploy the site globally across their CDN instantly.

---

## 🔗 4. How to Point Your Squarespace Domain (`www.mohasib.us`) via DNS

Because your domain `www.mohasib.us` was registered via **Squarespace**, follow these exact steps to connect it to your hosting provider.

### Step 1: Open Squarespace Domains Dashboard
1. Log in to [account.squarespace.com/domains](https://account.squarespace.com/domains).
2. Click on your domain: **mohasib.us**.
3. In the left or top navigation menu, select **DNS Settings** (or **Manage DNS Records**).
4. Scroll to **Custom Records** (you can leave Squarespace defaults or delete default parking records).

---

### Step 2: Add DNS Records for Vercel
If you deployed your site to **Vercel**, add the following records in your Squarespace DNS table:

| Record Type | Host / Name | Value / Points To | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | 3600 (or Default) | Routes apex domain (`mohasib.us`) |
| **CNAME** | `www` | `cname.vercel-dns.com.` | 3600 (or Default) | Routes primary subdomain (`www.mohasib.us`) |

*In Vercel:* Go to your project's **Settings** → **Domains** → add both `mohasib.us` and `www.mohasib.us`. Vercel will automatically verify the records and issue a free SSL certificate.

---

### Step 3: Add DNS Records for Netlify
If you deployed your site to **Netlify**, add the following records:

| Record Type | Host / Name | Value / Points To | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `75.2.60.5` | 3600 (or Default) | Routes apex domain (`mohasib.us`) to Netlify load balancer |
| **CNAME** | `www` | `[YOUR-SITE-NAME].netlify.app.` | 3600 (or Default) | Routes `www.mohasib.us` |

*In Netlify:* Go to **Site Configuration** → **Domain Management** → **Add custom domain** → enter `www.mohasib.us`.

> [!NOTE]
> DNS propagation typically takes between 15 minutes and 24 hours. Once propagated, HTTPS/SSL will automatically activate.

---

## ✏️ 5. Updating Content Dynamically

### Method 1: Using the Built-In Visual CMS (`admin/cms-preview.html`)
1. Open `admin/cms-preview.html` in your web browser.
2. Edit phone numbers, emails, service descriptions, pricing, or FAQs in the visual form.
3. Watch the live JSON preview update in real-time.
4. Click **Export content.json** (or **Copy JSON**) and replace `data/content.json`.
5. Your site is instantly updated!

### Method 2: Direct File Editing
Open `data/content.json` in any text editor (VS Code, Notepad, etc.):
- Replace `[INSERT YOUR TELEPHONE NUMBER HERE]` with your primary telephone number (e.g. `"(703) 555-0199"`).
- Modify pricing tiers in `content.json` under `pricing.packages`.
- Add new testimonials under `testimonials`.
- Add or revise FAQs under `faqs`.

### Method 3: Connecting Decap CMS or Sanity
If you prefer a Git-backed headless CMS:
- **Decap CMS (formerly Netlify CMS)**: Place an `admin/index.html` and `admin/config.yml` that points to `data/content.json` in your repository. Content editors can then log in at `www.mohasib.us/admin` and publish changes that commit directly to Git.
- **Sanity / Strapi**: Replace the `fetch('./data/content.json')` call in `js/app.js` with your Sanity API endpoint.

---

## 🛡️ 6. Compliance, Performance & Security

- **Semantic HTML5 & WCAG 2.1 AA Compliant**: Clean keyboard navigation, ARIA attributes, contrast ratios, and screen-reader accessibility.
- **Structured Schema Markup**: Integrated Schema.org `AccountingService` JSON-LD for rich Google search snippets.
- **IRS Circular 230 Disclosure**: Formal disclaimer included in footer.
- **Fintech Security Standard**: 256-bit SSL encrypted headers configured via `vercel.json` and `netlify.toml`.
