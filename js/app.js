/**
 * Mohasib Financial Group, LLC - Core Interactive Engine
 * Dynamic content binding, financial calculators, pricing builder, multi-step booking modal, client vault mockup.
 */

// Global App State
const AppState = {
  content: null,
  selectedService: 'all',
  activeCalculatorTab: 'tax',
  selectedPricingPlan: 'growth',
  selectedAddons: new Set(),
  businessSize: 'growing',
  bookingStep: 1,
  bookingData: {
    service: 'Tax Strategy & Bookkeeping',
    businessType: 'LLC',
    annualRevenue: '$250k - $500k',
    meetingType: 'Zoom Video Call',
    date: '',
    timeSlot: '10:00 AM EST',
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    notes: ''
  }
};

// Default embedded content fallback for zero-latency & offline/file:// support
const FALLBACK_CONTENT = {
  company: {
    name: "Mohasib Financial Group, LLC",
    shortName: "Mohasib Financial Group",
    domain: "www.mohasib.us",
    phone: "[INSERT YOUR TELEPHONE NUMBER HERE]",
    phoneDisplay: "(800) 555-MOHASIB",
    phoneRaw: "+18005556642",
    email: "info@mohasib.us",
    operatingHours: "Mon - Fri: 8:30 AM – 6:30 PM EST",
    foundedYear: "2019"
  },
  hero: {
    headline: "Financial Precision & Strategic Growth for Your Business",
    subheadline: "Move beyond reactive record-keeping. Mohasib Financial Group delivers strategic bookkeeping, high-impact tax planning, automated payroll, and entity formation designed to protect your assets and accelerate cash flow."
  }
};

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadContent();
  initNavigation();
  initHeroStats();
  initServices();
  initCalculator();
  initPricingWidget();
  initBookingModal();
  initClientPortal();
  initFaqAccordion();
  initContactForm();
  featherOrLucideSetup();
});

/**
 * 1. Dynamic Content Loader (JSON + Fallback)
 */
async function loadContent() {
  try {
    const response = await fetch('./data/content.json');
    if (!response.ok) throw new Error('Network response not ok');
    AppState.content = await response.json();
    console.log('Successfully loaded content.json dynamically');
  } catch (error) {
    console.warn('Using embedded content payload (running directly from file or offline mode):', error);
    AppState.content = FALLBACK_CONTENT;
  }
  
  // Inject company information across the DOM
  updateCompanyBranding();
}

function updateCompanyBranding() {
  const comp = AppState.content.company || FALLBACK_CONTENT.company;
  
  // Replace phone numbers throughout the site
  document.querySelectorAll('.dyn-phone-display').forEach(el => {
    el.textContent = comp.phoneDisplay || comp.phone;
  });
  
  document.querySelectorAll('.dyn-phone-link').forEach(el => {
    const telNumber = comp.phoneRaw || '+18005556642';
    el.setAttribute('href', `tel:${telNumber}`);
  });

  document.querySelectorAll('.dyn-email').forEach(el => {
    el.textContent = comp.email;
    el.setAttribute('href', `mailto:${comp.email}`);
  });
  
  document.querySelectorAll('.dyn-company-name').forEach(el => {
    el.textContent = comp.name;
  });

  document.querySelectorAll('.dyn-domain').forEach(el => {
    el.textContent = comp.domain;
  });
}

/**
 * 2. Sticky Navigation & Mobile Menu
 */
function initNavigation() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileClose = document.getElementById('mobile-menu-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md');
      navbar.classList.remove('bg-white/80');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('bg-white/80');
    }
  });

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }

  // Close mobile menu when clicking internal anchor links
  document.querySelectorAll('#mobile-menu-drawer a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
  });
}

/**
 * 3. Hero Trust Stats Counter Animation
 */
function initHeroStats() {
  const statElements = document.querySelectorAll('[data-target-stat]');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero-section');
  if (heroSection) observer.observe(heroSection);
}

function animateStats() {
  // Gentle pulse effect on stats cards
  const statsCards = document.querySelectorAll('.hero-stat-card');
  statsCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('scale-105', 'border-emerald-500/50');
      setTimeout(() => card.classList.remove('scale-105'), 400);
    }, index * 120);
  });
}

/**
 * 4. Services Filter & Rich Detail Modal
 */
const SERVICES_DATA = [
  {
    id: "bookkeeping",
    category: "accounting",
    number: "01",
    badge: "Core Financial Foundation",
    title: "Bookkeeping & Controller Services",
    subtitle: "Monthly reconciliations, financial reporting, profit & loss tracking, accounts payable/receivable.",
    description: "Gain crystalline clarity into your company's fiscal pulse. Our team handles every monthly reconciliation, categorizes transactions with pinpoint accuracy, tracks accounts payable and receivable, and delivers actionable P&L reports so you never make blind decisions.",
    features: [
      "Monthly & quarterly bank and credit card reconciliations",
      "Executive Profit & Loss (P&L), Balance Sheet, and Cash Flow statements",
      "Accounts Payable bill management & Accounts Receivable invoice follow-up",
      "Monthly closing ledger packages delivered by the 10th of every month",
      "Clean chart of accounts setup in QuickBooks Online or Xero",
      "Multi-year catch-up and historical reconciliation cleanup"
    ],
    deliverables: "Monthly Financial Statements, Executive Summary Dashboard, AR/AP Aging Schedules",
    idealFor: "Startups, Small-to-Midsize Businesses, Medical Practices, E-Commerce & Agencies",
    icon: "book"
  },
  {
    id: "payroll",
    category: "accounting",
    number: "02",
    badge: "Automated Workforce Operations",
    title: "Payroll Services & Compliance",
    subtitle: "Automated payroll processing, direct deposits, tax withholdings, and year-end 1099/W-2 preparation.",
    description: "Eliminate payroll compliance headaches and expensive IRS penalty notices. We configure automated direct deposits, compute multi-state withholdings, manage contractor reporting, and file timely quarterly payroll returns and year-end W-2 and 1099 forms.",
    features: [
      "Automated direct deposit payroll runs across all 50 states",
      "Federal (941/940), State, and Local payroll tax filings & remittances",
      "Year-end W-2, W-3, 1099-NEC, and 1099-MISC e-filing with the IRS",
      "Employee self-service portals for paystubs, W-2s, and direct deposit updates",
      "Paid time off (PTO), worker's comp tracking, and retirement deductions",
      "Independent contractor onboarding and 1099 compliance tracking"
    ],
    deliverables: "Payroll Journal, Tax Remittance Receipts, Annual W-2 / 1099 Packets",
    idealFor: "Businesses with 1 to 100+ W-2 employees or remote 1099 contractor teams",
    icon: "users"
  },
  {
    id: "business-taxes",
    category: "tax",
    number: "03",
    badge: "Proactive Wealth Retention",
    title: "Business & Corporate Tax Strategy",
    subtitle: "Comprehensive tax planning, federal & state tax filing, and proactive compliance strategy.",
    description: "Taxes shouldn't be an annual scramble—they should be a year-round strategic advantage. We design proactive tax strategies for LLCs, S-Corporations, Partnerships, and C-Corporations to legally slash tax liabilities, calculate quarterly estimates, and ensure multi-state compliance.",
    features: [
      "Entity corporate tax filings (Form 1120, 1120-S, 1065)",
      "Proactive quarterly tax planning meetings & estimated voucher calculations",
      "S-Corp reasonable compensation analysis and distribution optimization",
      "Depreciation strategies: Section 179 and Bonus Depreciation planning",
      "Pass-through Entity Tax (PTET) state tax deduction strategies",
      "Multi-state income tax nexus analysis and apportionment filing"
    ],
    deliverables: "Corporate Federal & State Returns, 4-Quarter Tax Roadmap, Partner K-1 Statements",
    idealFor: "Operating LLCs, S-Corporations, Professional Partnerships, and Growing C-Corps",
    icon: "calculator"
  },
  {
    id: "income-tax-prep",
    category: "tax",
    number: "04",
    badge: "Maximum Deduction Optimization",
    title: "Income Tax Return Preparation",
    subtitle: "Timely, accurate individual and corporate income tax filing with maximum deduction optimization.",
    description: "Keep more of what you earn with meticulous, audit-proof tax preparation. Whether you are a business owner with multi-entity pass-through income, a high-net-worth individual, or a real estate investor, we inspect every legal deduction to maximize your return.",
    features: [
      "Individual Federal and State tax returns (Form 1040 and Schedules A, B, C, D, E)",
      "K-1 passthrough income integration from S-Corps and Partnerships",
      "Real estate investor depreciation schedules and 1031 exchange planning",
      "Capital gains, RSUs, stock options, and crypto portfolio reporting",
      "Retirement deduction planning (Solo 401(k), SEP-IRA, Backdoor Roth)",
      "Fast electronic e-file with instant IRS acknowledgement receipts"
    ],
    deliverables: "Complete Tax Packet, Deductions Audit Summary, Estimated Vouchers for Next Year",
    idealFor: "Business owners, high-earning executives, real estate investors, and independent consultants",
    icon: "file-check"
  },
  {
    id: "entity-formation",
    category: "advisory",
    number: "05",
    badge: "Legal & Corporate Structuring",
    title: "Business Registration & Entity Formation",
    subtitle: "Helping entrepreneurs form LLCs, Corporations, S-Corps, obtaining EINs, and business licensing.",
    description: "Launch your business on an unshakeable legal and tax foundation. We evaluate your liability needs and projected revenue to recommend the ideal entity type, register your company with state authorities, secure your Federal EIN, and prepare custom governing documents.",
    features: [
      "Articles of Organization / Incorporation filing in any of the 50 states",
      "IRS Federal Employer Identification Number (EIN) immediate acquisition",
      "S-Corporation tax status election (IRS Form 2553)",
      "Custom Operating Agreements, Corporate Bylaws, and Banking Resolutions",
      "FinCEN Beneficial Ownership Information (BOI) mandatory compliance filing",
      "State Department of Revenue and local business tax license registrations"
    ],
    deliverables: "Corporate Formation Digital Vault, Certified Articles, Official IRS EIN Letter",
    idealFor: "New entrepreneurs, solopreneurs forming their first LLC, and restructuring businesses",
    icon: "award"
  },
  {
    id: "consulting",
    category: "advisory",
    number: "06",
    badge: "Executive Strategic Guidance",
    title: "Business Consulting & Advisory",
    subtitle: "Strategic growth planning, cash flow forecasting, budgeting, and financial health audits.",
    description: "Scale with confidence alongside an experienced Fractional CFO. We transform static ledger numbers into strategic intelligence: building rolling 12-month cash forecasts, financial health audits, margin optimization, and lender-ready financial models.",
    features: [
      "Fractional CFO & strategic financial controller advisory",
      "Rolling 13-week and 12-month cash flow forecasting and runway analysis",
      "Annual operating budgets, KPI scorecards, and variance analysis",
      "Deep financial health audits to identify overhead leaks and wasteful spending",
      "Debt financing, line of credit, and SBA loan packaging and presentation",
      "M&A financial due diligence and business valuation preparation"
    ],
    deliverables: "Executive Financial Dashboard, 12-Month Pro-Forma Model, Growth Action Plan",
    idealFor: "Businesses generating $250k - $15M seeking profit expansion and executive financial oversight",
    icon: "trending-up"
  }
];

function initServices() {
  const container = document.getElementById('services-grid');
  const tabs = document.querySelectorAll('.service-filter-tab');

  function render(category = 'all') {
    if (!container) return;
    const filtered = category === 'all' 
      ? SERVICES_DATA 
      : SERVICES_DATA.filter(s => s.category === category);

    container.innerHTML = filtered.map(service => `
      <div class="glass-card rounded-2xl p-7 flex flex-col justify-between border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300 relative group overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div>
          <div class="flex items-center justify-between mb-5">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              ${service.badge}
            </span>
            <span class="text-sm font-mono font-bold text-slate-400">${service.number}</span>
          </div>

          <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
            ${service.title}
          </h3>

          <p class="text-sm font-medium text-slate-700 mb-4 leading-relaxed">
            ${service.subtitle}
          </p>

          <p class="text-xs text-slate-500 mb-6 leading-relaxed line-clamp-3">
            ${service.description}
          </p>

          <div class="space-y-2 mb-6 pt-4 border-t border-slate-100">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Key Capabilities</p>
            ${service.features.slice(0, 3).map(feat => `
              <div class="flex items-start text-xs text-slate-600">
                <svg class="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                <span>${feat}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <button onclick="openServiceDetail('${service.id}')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group/btn py-1">
            <span>Explore Full Scope</span>
            <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <button onclick="selectServiceForConsultation('${service.title}')" class="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-emerald-600 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active', 'bg-emerald-700', 'text-white'));
      tabs.forEach(t => t.classList.add('bg-slate-100', 'text-slate-700'));
      tab.classList.add('active', 'bg-emerald-700', 'text-white');
      tab.classList.remove('bg-slate-100', 'text-slate-700');
      const cat = tab.getAttribute('data-category');
      render(cat);
    });
  });

  render('all');
}

window.openServiceDetail = function(serviceId) {
  const service = SERVICES_DATA.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById('service-detail-modal');
  const content = document.getElementById('service-detail-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="p-8">
      <div class="flex items-center justify-between mb-4">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          ${service.badge}
        </span>
        <span class="text-sm font-mono font-bold text-slate-400">Service ${service.number}</span>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 mb-2">${service.title}</h2>
      <p class="text-sm font-semibold text-emerald-700 mb-6">${service.subtitle}</p>

      <div class="bg-slate-50 rounded-xl p-5 mb-6 text-sm text-slate-700 leading-relaxed border border-slate-200">
        ${service.description}
      </div>

      <div class="mb-6">
        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">Complete Scope & Deliverables</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${service.features.map(f => `
            <div class="flex items-start text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
              <svg class="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">Standard Deliverables</span>
          <p class="text-xs text-slate-700 font-medium">${service.deliverables}</p>
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">Recommended For</span>
          <p class="text-xs text-slate-700 font-medium">${service.idealFor}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button onclick="selectServiceForConsultation('${service.title}'); closeServiceModal();" class="flex-1 btn-primary text-sm py-3">
          Schedule Free Strategy Session
        </button>
        <button onclick="closeServiceModal();" class="btn-secondary text-sm py-3">
          Close Window
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

window.closeServiceModal = function() {
  const modal = document.getElementById('service-detail-modal');
  if (modal) modal.classList.remove('active');
};

window.selectServiceForConsultation = function(serviceTitle) {
  AppState.bookingData.service = serviceTitle;
  openBookingModal();
  // Auto select dropdown
  const select = document.getElementById('booking-service-select');
  if (select) {
    for (let opt of select.options) {
      if (opt.text.toLowerCase().includes(serviceTitle.toLowerCase()) || serviceTitle.toLowerCase().includes(opt.value.toLowerCase())) {
        select.value = opt.value;
        break;
      }
    }
  }
};

/**
 * 5. Interactive Tax & Payroll Savings Calculator
 */
function initCalculator() {
  const taxTab = document.getElementById('calc-tab-tax');
  const payrollTab = document.getElementById('calc-tab-payroll');
  const taxView = document.getElementById('calc-view-tax');
  const payrollView = document.getElementById('calc-view-payroll');

  // Sliders and inputs for Tax
  const revSlider = document.getElementById('tax-revenue-slider');
  const revInput = document.getElementById('tax-revenue-input');
  const expSlider = document.getElementById('tax-expense-slider');
  const expInput = document.getElementById('tax-expense-input');
  const entityTypeSelect = document.getElementById('tax-entity-type');

  // Sliders and inputs for Payroll
  const empSlider = document.getElementById('payroll-emp-slider');
  const empInput = document.getElementById('payroll-emp-input');
  const freqSelect = document.getElementById('payroll-freq-select');

  // Tab switching
  if (taxTab && payrollTab) {
    taxTab.addEventListener('click', () => {
      taxTab.classList.add('bg-emerald-600', 'text-white');
      taxTab.classList.remove('bg-slate-800', 'text-slate-400');
      payrollTab.classList.remove('bg-emerald-600', 'text-white');
      payrollTab.classList.add('bg-slate-800', 'text-slate-400');
      taxView.classList.remove('hidden');
      payrollView.classList.add('hidden');
      AppState.activeCalculatorTab = 'tax';
    });

    payrollTab.addEventListener('click', () => {
      payrollTab.classList.add('bg-emerald-600', 'text-white');
      payrollTab.classList.remove('bg-slate-800', 'text-slate-400');
      taxTab.classList.remove('bg-emerald-600', 'text-white');
      taxTab.classList.add('bg-slate-800', 'text-slate-400');
      payrollView.classList.remove('hidden');
      taxView.classList.add('hidden');
      AppState.activeCalculatorTab = 'payroll';
    });
  }

  // Sync inputs with sliders
  function sync(slider, input, callback) {
    if (!slider || !input) return;
    slider.addEventListener('input', (e) => {
      input.value = e.target.value;
      callback();
    });
    input.addEventListener('input', (e) => {
      slider.value = e.target.value;
      callback();
    });
  }

  sync(revSlider, revInput, calculateTax);
  sync(expSlider, expInput, calculateTax);
  if (entityTypeSelect) entityTypeSelect.addEventListener('change', calculateTax);

  sync(empSlider, empInput, calculatePayroll);
  if (freqSelect) freqSelect.addEventListener('change', calculatePayroll);

  calculateTax();
  calculatePayroll();
}

function calculateTax() {
  const rev = parseFloat(document.getElementById('tax-revenue-input')?.value || 250000);
  const exp = parseFloat(document.getElementById('tax-expense-input')?.value || 90000);
  const entity = document.getElementById('tax-entity-type')?.value || 'llc';

  const netProfit = Math.max(0, rev - exp);
  
  // Standard Sole Prop / LLC Self Employment Tax = 15.3% on 92.35% of profit up to SS wage base limit (~$168,600) + 2.9% Medicare beyond
  let standardSETax = 0;
  const taxableSE = netProfit * 0.9235;
  if (taxableSE <= 168600) {
    standardSETax = taxableSE * 0.153;
  } else {
    standardSETax = (168600 * 0.153) + ((taxableSE - 168600) * 0.029);
  }

  // S-Corp Strategy: Pay reasonable salary (approx 40% - 50% of profit)
  const reasonableSalary = Math.min(netProfit, Math.max(45000, netProfit * 0.45));
  const distributions = Math.max(0, netProfit - reasonableSalary);
  
  let sCorpFicaTax = 0;
  if (reasonableSalary <= 168600) {
    sCorpFicaTax = reasonableSalary * 0.153;
  } else {
    sCorpFicaTax = (168600 * 0.153) + ((reasonableSalary - 168600) * 0.029);
  }

  // The distributions are not subject to 15.3% SE tax!
  const potentialSavings = Math.max(0, standardSETax - sCorpFicaTax);
  const quarterlyEstimated = (netProfit * 0.25) / 4; // Approx combined federal/state quarterly

  // Update DOM displays
  updateText('calc-net-profit', formatCurrency(netProfit));
  updateText('calc-se-tax-standard', formatCurrency(standardSETax));
  updateText('calc-scorp-tax', formatCurrency(sCorpFicaTax));
  updateText('calc-potential-savings', formatCurrency(potentialSavings));
  updateText('calc-quarterly-estimate', formatCurrency(quarterlyEstimated));
  
  // Progress bar ratio
  const ratio = standardSETax > 0 ? Math.min(100, Math.round((potentialSavings / standardSETax) * 100)) : 0;
  const bar = document.getElementById('calc-savings-bar');
  if (bar) bar.style.width = `${Math.max(15, ratio)}%`;
}

function calculatePayroll() {
  const employees = parseInt(document.getElementById('payroll-emp-input')?.value || 8);
  const frequency = document.getElementById('payroll-freq-select')?.value || 'biweekly';

  let payRunsPerYear = 26;
  if (frequency === 'weekly') payRunsPerYear = 52;
  if (frequency === 'semimonthly') payRunsPerYear = 24;
  if (frequency === 'monthly') payRunsPerYear = 12;

  // Average 3.5 hours per employee per month in manual payroll calculations, reporting, tax filings, inquiries
  const hoursSavedAnnual = Math.round(employees * 14);
  const internalLaborCostSavings = hoursSavedAnnual * 35; // Assuming $35/hr average admin hourly rate
  const penaltyRiskMitigated = employees * 650; // Average IRS payroll deposit notice penalty avoided

  updateText('calc-payroll-hours-saved', `${hoursSavedAnnual} hrs / year`);
  updateText('calc-payroll-labor-savings', formatCurrency(internalLaborCostSavings));
  updateText('calc-payroll-penalty-shield', formatCurrency(penaltyRiskMitigated));
  updateText('calc-payroll-total-efficiency', formatCurrency(internalLaborCostSavings + penaltyRiskMitigated));
}

function updateText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatCurrency(num) {
  return '$' + Math.round(num).toLocaleString('en-US');
}

window.applyCalculatedSavingsToBooking = function() {
  const savings = document.getElementById('calc-potential-savings')?.textContent || '$0';
  AppState.bookingData.notes = `Client used savings calculator. Identified potential annual savings: ${savings}. Looking for entity optimization and tax roadmap.`;
  openBookingModal();
};

/**
 * 6. Dynamic Pricing & Custom Service Selector Tool
 */
const PRICING_PLANS = {
  starter: { name: 'Starter Compliance', price: 395, basePrice: 395 },
  growth: { name: 'Growth Accelerator', price: 850, basePrice: 850 },
  enterprise: { name: 'Fractional CFO & Enterprise', price: 1650, basePrice: 1650 }
};

const ADDON_PRICES = {
  formation: { name: 'LLC / S-Corp Formation', price: 495, recurring: false },
  catchup: { name: 'Historical Bookkeeping Cleanup', price: 750, recurring: false },
  boi: { name: 'FinCEN BOI Compliance Filing', price: 199, recurring: false },
  audit: { name: 'Comprehensive Financial Health Audit', price: 600, recurring: false }
};

function initPricingWidget() {
  const planCards = document.querySelectorAll('.pricing-plan-card');
  const addonCheckboxes = document.querySelectorAll('.pricing-addon-checkbox');
  const businessSizeRadios = document.querySelectorAll('input[name="biz-size"]');

  planCards.forEach(card => {
    card.addEventListener('click', () => {
      planCards.forEach(c => c.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-950/20'));
      card.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-950/20');
      AppState.selectedPricingPlan = card.getAttribute('data-plan-id');
      updatePricingTotal();
    });
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const addonKey = e.target.value;
      if (e.target.checked) {
        AppState.selectedAddons.add(addonKey);
      } else {
        AppState.selectedAddons.delete(addonKey);
      }
      updatePricingTotal();
    });
  });

  businessSizeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.businessSize = e.target.value;
      // Recommend corresponding plan
      if (e.target.value === 'startup') recommendPlan('starter');
      if (e.target.value === 'growing') recommendPlan('growth');
      if (e.target.value === 'enterprise') recommendPlan('enterprise');
    });
  });

  updatePricingTotal();
}

function recommendPlan(planId) {
  const targetCard = document.querySelector(`.pricing-plan-card[data-plan-id="${planId}"]`);
  if (targetCard) targetCard.click();
}

function updatePricingTotal() {
  const selectedPlan = PRICING_PLANS[AppState.selectedPricingPlan] || PRICING_PLANS.growth;
  let monthlyTotal = selectedPlan.price;
  let oneTimeTotal = 0;

  const addonListSummary = [];
  AppState.selectedAddons.forEach(addonKey => {
    const addon = ADDON_PRICES[addonKey];
    if (addon) {
      oneTimeTotal += addon.price;
      addonListSummary.push(addon.name);
    }
  });

  updateText('pricing-summary-plan-name', selectedPlan.name);
  updateText('pricing-summary-monthly', `$${monthlyTotal}/mo`);
  updateText('pricing-summary-onetime', oneTimeTotal > 0 ? `+ $${oneTimeTotal} one-time setup` : 'No one-time setup');
  
  const breakdownEl = document.getElementById('pricing-summary-addons-list');
  if (breakdownEl) {
    if (addonListSummary.length > 0) {
      breakdownEl.innerHTML = addonListSummary.map(name => `
        <span class="inline-block bg-slate-800 text-emerald-400 text-xs px-2.5 py-1 rounded-md border border-slate-700 mr-1.5 mb-1.5">
          + ${name}
        </span>
      `).join('');
    } else {
      breakdownEl.innerHTML = `<span class="text-xs text-slate-500">No add-ons selected</span>`;
    }
  }
}

window.proceedToProposal = function() {
  const plan = PRICING_PLANS[AppState.selectedPricingPlan]?.name || 'Custom Plan';
  const addonCount = AppState.selectedAddons.size;
  AppState.bookingData.notes = `Selected Plan: ${plan} with ${addonCount} add-on service(s). Requesting official proposal and engagement onboarding.`;
  openBookingModal();
};

/**
 * 7. Multi-step Appointment Booking Modal
 */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('booking-modal-close');
  const nextBtn = document.getElementById('booking-next-btn');
  const prevBtn = document.getElementById('booking-prev-btn');
  const submitBtn = document.getElementById('booking-submit-btn');

  // Trigger buttons
  document.querySelectorAll('.open-booking-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeBookingModal);
  }

  // Step navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(AppState.bookingStep)) {
        goToBookingStep(AppState.bookingStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToBookingStep(AppState.bookingStep - 1);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', handleBookingSubmit);
  }

  // Populate dynamic date selector in Step 2
  populateBookingDates();
}

function populateBookingDates() {
  const dateContainer = document.getElementById('booking-date-chips');
  if (!dateContainer) return;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let chipsHtml = '';
  const today = new Date();

  // Generate 7 upcoming business days
  let count = 0;
  for (let i = 1; count < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Exclude Sundays
    if (d.getDay() !== 0) {
      const isSelected = count === 0;
      const formattedDate = `${months[d.getMonth()]} ${d.getDate()}`;
      if (isSelected) AppState.bookingData.date = `${days[d.getDay()]}, ${formattedDate}`;

      chipsHtml += `
        <button type="button" onclick="selectBookingDate(this, '${days[d.getDay()]}, ${formattedDate}')" class="date-chip p-3 rounded-xl border text-center transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300 text-slate-700'}">
          <span class="block text-xs uppercase tracking-wider text-slate-500">${days[d.getDay()]}</span>
          <span class="block text-base font-bold">${d.getDate()}</span>
          <span class="block text-xs text-slate-400">${months[d.getMonth()]}</span>
        </button>
      `;
      count++;
    }
  }
  dateContainer.innerHTML = chipsHtml;
}

window.selectBookingDate = function(el, dateStr) {
  document.querySelectorAll('.date-chip').forEach(c => {
    c.classList.remove('border-emerald-500', 'bg-emerald-50', 'text-emerald-900', 'font-bold', 'ring-2', 'ring-emerald-500/30');
    c.classList.add('border-slate-200', 'text-slate-700');
  });
  el.classList.add('border-emerald-500', 'bg-emerald-50', 'text-emerald-900', 'font-bold', 'ring-2', 'ring-emerald-500/30');
  el.classList.remove('border-slate-200', 'text-slate-700');
  AppState.bookingData.date = dateStr;
};

window.selectTimeSlot = function(el, slotStr) {
  document.querySelectorAll('.time-slot-btn').forEach(b => {
    b.classList.remove('border-emerald-500', 'bg-emerald-600', 'text-white');
    b.classList.add('border-slate-200', 'text-slate-700');
  });
  el.classList.add('border-emerald-500', 'bg-emerald-600', 'text-white');
  el.classList.remove('border-slate-200', 'text-slate-700');
  AppState.bookingData.timeSlot = slotStr;
};

window.openBookingModal = function() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.add('active');
    goToBookingStep(1);
  }
};

window.closeBookingModal = function() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.remove('active');
};

function goToBookingStep(step) {
  AppState.bookingStep = step;

  // Update tabs
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`booking-step-${i}`);
    const tabIndicator = document.getElementById(`step-indicator-${i}`);
    
    if (stepEl) {
      if (i === step) {
        stepEl.classList.remove('hidden');
      } else {
        stepEl.classList.add('hidden');
      }
    }

    if (tabIndicator) {
      if (i <= step) {
        tabIndicator.classList.add('bg-emerald-600', 'text-white');
        tabIndicator.classList.remove('bg-slate-200', 'text-slate-500');
      } else {
        tabIndicator.classList.remove('bg-emerald-600', 'text-white');
        tabIndicator.classList.add('bg-slate-200', 'text-slate-500');
      }
    }
  }

  // Button visibility
  const prevBtn = document.getElementById('booking-prev-btn');
  const nextBtn = document.getElementById('booking-next-btn');
  const submitBtn = document.getElementById('booking-submit-btn');

  if (prevBtn) {
    if (step === 1) prevBtn.classList.add('invisible');
    else prevBtn.classList.remove('invisible');
  }

  if (nextBtn && submitBtn) {
    if (step === 3) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }
}

function validateStep(step) {
  if (step === 1) {
    const service = document.getElementById('booking-service-select')?.value;
    const bizType = document.getElementById('booking-biz-type')?.value;
    if (!service || !bizType) {
      showToast('Please select your service and business entity type.', 'warning');
      return false;
    }
    AppState.bookingData.service = service;
    AppState.bookingData.businessType = bizType;
    return true;
  }
  if (step === 2) {
    const meetingType = document.querySelector('input[name="meeting-channel"]:checked')?.value || 'Zoom Video Call';
    AppState.bookingData.meetingType = meetingType;
    return true;
  }
  return true;
}

function handleBookingSubmit() {
  const name = document.getElementById('booking-fullname')?.value.trim();
  const email = document.getElementById('booking-email')?.value.trim();
  const phone = document.getElementById('booking-phone')?.value.trim();
  const company = document.getElementById('booking-company-name')?.value.trim();
  const notes = document.getElementById('booking-notes')?.value.trim();

  if (!name || !email || !phone) {
    showToast('Please complete your name, email, and telephone number.', 'warning');
    return;
  }

  AppState.bookingData.fullName = name;
  AppState.bookingData.email = email;
  AppState.bookingData.phone = phone;
  AppState.bookingData.businessName = company || 'Private Venture';
  if (notes) AppState.bookingData.notes += ` | ${notes}`;

  // Generate Reference ID
  const refId = 'MFG-' + Math.floor(100000 + Math.random() * 900000);

  // Render Confirmation Screen
  const stepContainer = document.getElementById('booking-steps-container');
  const modalFooter = document.getElementById('booking-modal-footer');
  if (modalFooter) modalFooter.classList.add('hidden');

  if (stepContainer) {
    stepContainer.innerHTML = `
      <div class="py-10 px-6 text-center">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-2">Strategy Consultation Confirmed!</h3>
        <p class="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Thank you, <strong class="text-slate-900">${AppState.bookingData.fullName}</strong>. A calendar invitation and conference link have been queued for <strong class="text-slate-900">${AppState.bookingData.email}</strong>.
        </p>

        <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left mb-6 text-xs space-y-2">
          <div class="flex justify-between border-b pb-2 border-slate-200">
            <span class="text-slate-500">Booking Reference:</span>
            <span class="font-mono font-bold text-emerald-700">${refId}</span>
          </div>
          <div class="flex justify-between border-b pb-2 border-slate-200">
            <span class="text-slate-500">Scheduled Date:</span>
            <span class="font-semibold text-slate-800">${AppState.bookingData.date || 'Tomorrow'}, ${AppState.bookingData.timeSlot}</span>
          </div>
          <div class="flex justify-between border-b pb-2 border-slate-200">
            <span class="text-slate-500">Meeting Format:</span>
            <span class="font-semibold text-slate-800">${AppState.bookingData.meetingType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Assigned Practice:</span>
            <span class="font-semibold text-slate-800">Mohasib Financial Advisory Desk</span>
          </div>
        </div>

        <p class="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          Need immediate assistance before your call? Phone our direct team anytime at <a href="tel:+18005556642" class="text-emerald-700 font-bold dyn-phone-display">[INSERT YOUR TELEPHONE NUMBER HERE]</a>.
        </p>

        <button onclick="closeBookingModal(); location.reload();" class="btn-primary text-sm px-8 py-3">
          Done & Return to Site
        </button>
      </div>
    `;
    updateCompanyBranding();
  }

  showToast('Consultation request successfully recorded!', 'success');
}

/**
 * 8. Client Portal Mockup & Secure Login Flow
 */
function initClientPortal() {
  const openPortalBtns = document.querySelectorAll('.open-portal-btn');
  const portalModal = document.getElementById('client-portal-modal');
  const portalClose = document.getElementById('portal-modal-close');
  const loginForm = document.getElementById('portal-login-form');
  const verifyBtn = document.getElementById('portal-verify-2fa-btn');

  openPortalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (portalModal) portalModal.classList.add('active');
    });
  });

  if (portalClose && portalModal) {
    portalClose.addEventListener('click', () => {
      portalModal.classList.remove('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginStep = document.getElementById('portal-step-credentials');
      const twoFaStep = document.getElementById('portal-step-2fa');
      if (loginStep && twoFaStep) {
        loginStep.classList.add('hidden');
        twoFaStep.classList.remove('hidden');
      }
    });
  }

  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const twoFaStep = document.getElementById('portal-step-2fa');
      const dashboardStep = document.getElementById('portal-step-dashboard');
      if (twoFaStep && dashboardStep) {
        twoFaStep.classList.add('hidden');
        dashboardStep.classList.remove('hidden');
        showToast('Vault authentication successful: Welcome to Mohasib Client Vault™', 'success');
      }
    });
  }
}

/**
 * 9. FAQ Accordion Component
 */
function initFaqAccordion() {
  const container = document.getElementById('faq-accordion-container');
  if (!container) return;

  const faqs = (AppState.content && AppState.content.faqs) ? AppState.content.faqs : [
    {
      question: "What is the difference between an LLC and an S-Corporation?",
      answer: "An LLC is a state-level legal entity providing liability protection. An S-Corporation is an IRS tax election (Form 2553). Once net profits exceed ~$60k, an S-Corp election can save thousands annually by eliminating self-employment tax on distributions."
    },
    {
      question: "How fast is client onboarding?",
      answer: "Standard onboarding takes 3 to 5 business days with read-only bank feeds. Historical catch-up cleanups take 10 to 14 days."
    }
  ];

  container.innerHTML = faqs.map((faq, idx) => `
    <div class="accordion-item border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all mb-4 ${idx === 0 ? 'active' : ''}">
      <button type="button" class="w-full py-4 px-6 text-left flex items-center justify-between text-slate-900 font-semibold text-base hover:text-emerald-700 transition-colors focus:outline-none">
        <span>${faq.question}</span>
        <svg class="accordion-icon w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div class="accordion-content px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-2">
        ${faq.answer}
      </div>
    </div>
  `).join('');

  // Attach toggle listeners
  container.querySelectorAll('.accordion-item').forEach(item => {
    const btn = item.querySelector('button');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/**
 * 10. Contact Footer & Direct Inquiry Form
 */
function initContactForm() {
  const form = document.getElementById('quick-inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been routed to our Senior Advisory team.', 'success');
      form.reset();
    });
  }
}

/**
 * 11. Toast Notifications Utility
 */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  
  const icon = type === 'success' 
    ? `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>`
    : `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

function featherOrLucideSetup() {
  // Lucide setup if loaded via CDN
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
