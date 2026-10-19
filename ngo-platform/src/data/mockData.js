// ==================== DATA MODEL ====================
// All data is fictional, for demonstration of the AidLink platform only.

let _uid = 1000;
export function nextId(prefix) {
  _uid++;
  return prefix + "-" + _uid;
}

export const INITIAL_ORG = {
  name: "Aashray Seva Trust",
  shortName: "AST",
  tagline: "Community-led relief & recovery across flood, cyclone and landslide-affected districts of India",
  hq: "Bengaluru, Karnataka",
  founded: 2011,
  regType: "Section 8 Non-Profit Company",
  regNumber: "U85300KA2011NPL058231",
  pan: "AABCA5521N",
  fcra: "FCRA Registered — 094421458",
  status80g: "12A & 80G certified",
  sectors: ["Disaster Relief", "WASH", "Shelter", "Livelihoods"],
  team: [
    { name: "Dr. Meenal Kaskhedikar", role: "Executive Director", since: 2011 },
    { name: "Rohan D'Souza", role: "Director of Operations", since: 2015 },
    { name: "Farheen Ansari", role: "Head of Field Programmes", since: 2018 },
    { name: "K. Elumalai", role: "Finance & Compliance Lead", since: 2016 },
    { name: "Priya Narzary", role: "MEAL Coordinator", since: 2021 },
  ],
  verification: {
    status: "verified", // verified | pending | unverified
    completedOn: "2025-03-11",
    steps: [
      { label: "Legal registration confirmed", detail: "Section 8 incorporation & 12A/80G certificates cross-checked against registry records.", done: true },
      { label: "Financial disclosure submitted", detail: "Latest two years of audited statements and FCRA returns filed on platform.", done: true },
      { label: "Leadership identity check", detail: "KYC completed for 3 authorised signatories.", done: true },
      { label: "Bank account verification", detail: "Organisational bank account ownership confirmed via penny-drop verification.", done: true },
      { label: "Field presence attestation", detail: "On-ground presence corroborated by 2 independent partner organisations.", done: true },
    ]
  },
  docs: [
    { name: "Certificate of Incorporation.pdf", type: "Registration", updated: "2024-11-02" },
    { name: "12A Certificate.pdf", type: "Tax", updated: "2024-11-02" },
    { name: "80G Certificate.pdf", type: "Tax", updated: "2024-11-02" },
    { name: "FCRA Registration.pdf", type: "Compliance", updated: "2025-01-18" },
    { name: "Audited Financials FY 2024-25.pdf", type: "Financial", updated: "2025-06-30" },
    { name: "Board Resolution — Signatories.pdf", type: "Governance", updated: "2023-08-14" },
  ]
};

export const INITIAL_CAMPAIGNS = [
  {
    id: "CMP-101",
    name: "Assam Flood Response 2026",
    disaster: "Monsoon Flooding",
    region: "Barpeta, Nagaon & Morigaon Districts, Assam",
    status: "active",
    health: "on_track",
    startDate: "2026-07-06",
    objective: "Provide emergency shelter, safe drinking water and essential health support to flood-displaced families across three districts of Assam, and support early recovery for 4,000 affected households.",
    targetHouseholds: 4000,
    progress: 62,
    coverImage: "assam-flood",
    lastUpdatePublished: "2026-08-20",
    activities: [
      { id: nextId("ACT"), title: "Emergency relief kit distribution — Barpeta Block II", type: "Distribution", status: "completed", date: "2026-07-12", location: "Barpeta Block II relief camp", volunteersAssigned: 14, notes: "1,120 kits distributed covering food, tarpaulin, hygiene items." },
      { id: nextId("ACT"), title: "Mobile health camp — Nagaon char areas", type: "Health", status: "completed", date: "2026-07-19", location: "Nagaon riverine char settlements", volunteersAssigned: 9, notes: "612 patients screened, 3 referrals to district hospital." },
      { id: nextId("ACT"), title: "Water purification & tap-stand installation", type: "WASH", status: "in_progress", date: "2026-08-02", location: "Morigaon relief camps 3–6", volunteersAssigned: 11, notes: "18 of 26 tap-stands commissioned." },
      { id: nextId("ACT"), title: "Temporary shelter kit distribution — Round 2", type: "Shelter", status: "scheduled", date: "2026-08-29", location: "Barpeta & Nagaon", volunteersAssigned: 16, notes: "Awaiting tarpaulin restock confirmation." },
      { id: nextId("ACT"), title: "Household needs assessment — Morigaon", type: "Assessment", status: "scheduled", date: "2026-09-04", location: "Morigaon", volunteersAssigned: 6, notes: "" },
    ],
    volunteers: [
      { id: nextId("VOL"), name: "Anindita Bora", role: "Distribution Coordinator", status: "active", appliedOn: "2026-07-02", skills: ["Logistics", "Assamese, Hindi"], hoursLogged: 64 },
      { id: nextId("VOL"), name: "Sameer Kalita", role: "Field Volunteer", status: "active", appliedOn: "2026-07-03", skills: ["Community mobilisation"], hoursLogged: 41 },
      { id: nextId("VOL"), name: "Dr. Rituparna Deka", role: "Medical Volunteer", status: "active", appliedOn: "2026-07-05", skills: ["General medicine", "First aid training"], hoursLogged: 36 },
      { id: nextId("VOL"), name: "Imran Hussain", role: "WASH Technician", status: "active", appliedOn: "2026-07-10", skills: ["Plumbing", "Water testing"], hoursLogged: 52 },
      { id: nextId("VOL"), name: "Bornali Saikia", role: "Field Volunteer", status: "pending", appliedOn: "2026-08-16", skills: ["Data collection"], hoursLogged: 0 },
      { id: nextId("VOL"), name: "Pranjal Gogoi", role: "Driver / Logistics", status: "pending", appliedOn: "2026-08-19", skills: ["Light vehicle driving"], hoursLogged: 0 },
      { id: nextId("VOL"), name: "Mridusmita Bhuyan", role: "Field Volunteer", status: "pending", appliedOn: "2026-08-21", skills: ["Community mobilisation", "Assamese"], hoursLogged: 0 },
    ],
    resources: [
      { id: nextId("RES"), name: "Family Relief Kits (food + hygiene)", unit: "kits", allocated: 4500, deployed: 2790, source: "Purchased — Round 1 & 2 donations" },
      { id: nextId("RES"), name: "Tarpaulin Sheets", unit: "pieces", allocated: 3000, deployed: 1120, source: "Purchased" },
      { id: nextId("RES"), name: "Water Purification Tablets", unit: "strips", allocated: 12000, deployed: 9400, source: "In-kind — Nilgiri Pharma Trust" },
      { id: nextId("RES"), name: "Portable Tap-stand Units", unit: "units", allocated: 26, deployed: 18, source: "Purchased" },
      { id: nextId("RES"), name: "First-aid & Medical Supplies", unit: "cartons", allocated: 80, deployed: 52, source: "In-kind — Assam Chemists Welfare Assoc." },
    ],
    donations: [
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 250000, date: "2026-07-08", purpose: "Emergency relief kits", method: "Simulated UPI" },
      { id: nextId("DON"), donor: "Ramesh & Anjali Varadan", amount: 100000, date: "2026-07-11", purpose: "Shelter materials", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Northeast Traders Collective", amount: 180000, date: "2026-07-15", purpose: "Unrestricted", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 40000, date: "2026-07-22", purpose: "Medical camps", method: "Simulated UPI" },
      { id: nextId("DON"), donor: "Sunita Prabhu", amount: 15000, date: "2026-08-03", purpose: "Unrestricted", method: "Simulated UPI" },
      { id: nextId("DON"), donor: "Guwahati Rotary Circle", amount: 220000, date: "2026-08-10", purpose: "WASH infrastructure", method: "Simulated Bank Transfer" },
    ],
    expenses: [
      { id: nextId("EXP"), category: "Relief Kits", vendor: "Brahmaputra Wholesale Traders", amount: 312000, date: "2026-07-10", status: "verified", evidenceLinked: true, note: "1,120 kits — invoice + distribution photos attached." },
      { id: nextId("EXP"), category: "Transport & Logistics", vendor: "Kalita Transport Services", amount: 48500, date: "2026-07-11", status: "verified", evidenceLinked: true, note: "Camp-to-camp kit transport, 3 trucks." },
      { id: nextId("EXP"), category: "Medical Supplies", vendor: "Assam Chemists Welfare Assoc.", amount: 61200, date: "2026-07-18", status: "verified", evidenceLinked: true, note: "Health camp consumables." },
      { id: nextId("EXP"), category: "WASH Infrastructure", vendor: "Purbanchal Pipe & Fittings", amount: 186400, date: "2026-08-02", status: "missing_evidence", evidenceLinked: false, note: "Tap-stand materials — receipts pending upload." },
      { id: nextId("EXP"), category: "Field Staff Stipend", vendor: "—", amount: 38000, date: "2026-08-05", status: "declared", evidenceLinked: false, note: "Volunteer stipend for Aug 1–15 field cycle." },
    ],
    evidence: [
      { id: nextId("EVD"), title: "Barpeta kit distribution — camp photos (18)", type: "Photo Set", linkedTo: "Emergency relief kit distribution — Barpeta Block II", uploadedBy: "Anindita Bora", date: "2026-07-13" },
      { id: nextId("EVD"), title: "Vendor invoice — Brahmaputra Wholesale Traders", type: "Document", linkedTo: "Relief Kits expense", uploadedBy: "K. Elumalai", date: "2026-07-14" },
      { id: nextId("EVD"), title: "Health camp attendance register (scan)", type: "Document", linkedTo: "Mobile health camp — Nagaon char areas", uploadedBy: "Dr. Rituparna Deka", date: "2026-07-20" },
      { id: nextId("EVD"), title: "Water quality test results — Morigaon", type: "Document", linkedTo: "Water purification & tap-stand installation", uploadedBy: "Imran Hussain", date: "2026-08-06" },
      { id: nextId("EVD"), title: "Tap-stand installation photos (9)", type: "Photo Set", linkedTo: "Water purification & tap-stand installation", uploadedBy: "Imran Hussain", date: "2026-08-07" },
    ],
    updates: [
      { id: nextId("UPD"), date: "2026-08-20", title: "WASH rollout past the halfway mark in Morigaon", body: "18 of 26 planned tap-stands are now commissioned and handed over to camp committees. Water quality testing at 4 sites confirms potability. Round 2 shelter kit distribution is being finalised pending tarpaulin restock, expected to begin August 29." },
      { id: nextId("UPD"), date: "2026-08-01", title: "Health camp outcomes and next phase planning", body: "The Nagaon mobile health camp screened 612 residents across char settlements, with 3 referrals for further hospital care. Field teams are now shifting focus to WASH infrastructure ahead of the second monsoon spell." },
      { id: nextId("UPD"), date: "2026-07-14", title: "First round of relief kits reaches Barpeta", body: "1,120 family relief kits were distributed at Barpeta Block II relief camp, covering food staples, tarpaulin sheeting and hygiene essentials. Distribution was coordinated with camp committees to prioritise female-headed and elderly-headed households." },
    ],
    beneficiaries: {
      householdsReached: 2790, individualsReached: 13120,
      genderSplit: { female: 51, male: 47, other: 2 },
      districts: [
        { name: "Barpeta", households: 1120 }, { name: "Nagaon", households: 960 }, { name: "Morigaon", households: 710 }
      ],
      vulnerableGroupsCovered: ["Female-headed households", "Persons with disabilities", "Elderly-headed households"],
      note: "Figures are aggregate counts reported by field teams and camp committees. No individually identifying beneficiary information is collected or displayed on this platform."
    },
    impactReports: [
      { id: nextId("RPT"), title: "Assam Flood Response — Mid-Programme Impact Summary", period: "6 Jul – 15 Aug 2026", status: "published", publishedOn: "2026-08-21" },
    ],
    audit: [
      { ts: "2026-08-21 10:12", actor: "Farheen Ansari", action: "Published impact report", detail: "Mid-Programme Impact Summary" },
      { ts: "2026-08-20 18:40", actor: "Farheen Ansari", action: "Published progress update", detail: "WASH rollout past the halfway mark in Morigaon" },
      { ts: "2026-08-07 09:05", actor: "Imran Hussain", action: "Uploaded evidence", detail: "Tap-stand installation photos (9)" },
      { ts: "2026-08-06 16:22", actor: "Imran Hussain", action: "Uploaded evidence", detail: "Water quality test results — Morigaon" },
      { ts: "2026-08-05 11:00", actor: "K. Elumalai", action: "Declared expense", detail: "Field Staff Stipend — ₹38,000" },
      { ts: "2026-08-02 14:30", actor: "K. Elumalai", action: "Declared expense", detail: "WASH Infrastructure — ₹1,86,400" },
      { ts: "2026-07-21 08:50", actor: "Rohan D'Souza", action: "Approved volunteer", detail: "Dr. Rituparna Deka — Medical Volunteer" },
      { ts: "2026-07-06 09:00", actor: "Dr. Meenal Kaskhedikar", action: "Campaign published", detail: "Assam Flood Response 2026 moved from Draft to Active" },
    ]
  },
  {
    id: "CMP-102",
    name: "Wayanad Landslide Recovery",
    disaster: "Landslide",
    region: "Meppadi, Chooralmala & Mundakkai, Wayanad District, Kerala",
    status: "active",
    health: "at_risk",
    startDate: "2026-06-22",
    objective: "Provide transitional housing support and restart small-scale livelihoods for 1,200 landslide-affected households across three severely impacted panchayats.",
    targetHouseholds: 1200,
    progress: 41,
    coverImage: "wayanad-landslide",
    lastUpdatePublished: "2026-07-30",
    activities: [
      { id: nextId("ACT"), title: "Transitional shelter unit construction — Phase 1", type: "Shelter", status: "in_progress", date: "2026-07-01", location: "Chooralmala relocation site", volunteersAssigned: 20, notes: "64 of 150 units complete." },
      { id: nextId("ACT"), title: "Livelihood restart grants — spice & dairy farmers", type: "Livelihoods", status: "in_progress", date: "2026-07-18", location: "Meppadi", volunteersAssigned: 5, notes: "112 of 300 households enrolled." },
      { id: nextId("ACT"), title: "Psychosocial support sessions — children", type: "Health", status: "completed", date: "2026-07-05", location: "Mundakkai relief camp school", volunteersAssigned: 7, notes: "210 children across 6 sessions." },
      { id: nextId("ACT"), title: "Road-access debris clearance support", type: "Infrastructure", status: "scheduled", date: "2026-09-01", location: "Mundakkai access road", volunteersAssigned: 0, notes: "Coordinating with district disaster management authority." },
    ],
    volunteers: [
      { id: nextId("VOL"), name: "Aparna Menon", role: "Site Coordinator", status: "active", appliedOn: "2026-06-24", skills: ["Construction supervision"], hoursLogged: 88 },
      { id: nextId("VOL"), name: "Thomas Jacob", role: "Livelihoods Officer", status: "active", appliedOn: "2026-06-25", skills: ["Agri-finance"], hoursLogged: 54 },
      { id: nextId("VOL"), name: "Sruthi Balakrishnan", role: "Counsellor", status: "active", appliedOn: "2026-06-27", skills: ["Child psychology"], hoursLogged: 30 },
      { id: nextId("VOL"), name: "Vishnu Nambiar", role: "Field Volunteer", status: "pending", appliedOn: "2026-08-12", skills: ["Malayalam, Logistics"], hoursLogged: 0 },
      { id: nextId("VOL"), name: "Reshma P.K.", role: "Field Volunteer", status: "pending", appliedOn: "2026-08-17", skills: ["Community mobilisation"], hoursLogged: 0 },
      { id: nextId("VOL"), name: "Alan Sebastian", role: "Field Volunteer", status: "rejected", appliedOn: "2026-08-01", skills: ["General"], hoursLogged: 0, note: "Duplicate application." },
    ],
    resources: [
      { id: nextId("RES"), name: "Transitional Shelter Units (kit-built)", unit: "units", allocated: 150, deployed: 64, source: "Purchased" },
      { id: nextId("RES"), name: "Livelihood Restart Grants", unit: "grants", allocated: 300, deployed: 112, source: "Purchased — donor restricted" },
      { id: nextId("RES"), name: "Construction Tools & Hardware", unit: "sets", allocated: 40, deployed: 38, source: "Purchased" },
    ],
    donations: [
      { id: nextId("DON"), donor: "Kochi Business Forum", amount: 600000, date: "2026-06-25", purpose: "Shelter construction", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 90000, date: "2026-07-02", purpose: "Livelihood grants", method: "Simulated UPI" },
      { id: nextId("DON"), donor: "George & Elsamma Foundation", amount: 250000, date: "2026-07-09", purpose: "Livelihood grants", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 22000, date: "2026-07-28", purpose: "Unrestricted", method: "Simulated UPI" },
    ],
    expenses: [
      { id: nextId("EXP"), category: "Shelter Construction", vendor: "Wayanad Builders Cooperative", amount: 512000, date: "2026-07-05", status: "verified", evidenceLinked: true, note: "64 shelter units — milestone invoice 1 of 3." },
      { id: nextId("EXP"), category: "Livelihood Grants", vendor: "Direct disbursal to households", amount: 224000, date: "2026-07-20", status: "missing_evidence", evidenceLinked: false, note: "112 households — signed acknowledgement forms pending scan upload." },
      { id: nextId("EXP"), category: "Site Logistics", vendor: "Malabar Hardware Supplies", amount: 34500, date: "2026-07-22", status: "declared", evidenceLinked: false, note: "" },
    ],
    evidence: [
      { id: nextId("EVD"), title: "Shelter construction progress photos — Phase 1 (24)", type: "Photo Set", linkedTo: "Transitional shelter unit construction — Phase 1", uploadedBy: "Aparna Menon", date: "2026-07-30" },
      { id: nextId("EVD"), title: "Builders Cooperative milestone invoice 1", type: "Document", linkedTo: "Shelter Construction expense", uploadedBy: "K. Elumalai", date: "2026-07-06" },
      { id: nextId("EVD"), title: "Counselling session summary report", type: "Document", linkedTo: "Psychosocial support sessions — children", uploadedBy: "Sruthi Balakrishnan", date: "2026-07-06" },
    ],
    updates: [
      { id: nextId("UPD"), date: "2026-07-30", title: "Shelter construction crosses 40% completion", body: "64 of 150 transitional shelter units are now complete in Chooralmala. Livelihood restart grants have reached 112 of 300 target households, mainly spice and dairy farmers. We are flagging a documentation backlog on grant disbursal acknowledgements internally and working to close it this week." },
      { id: nextId("UPD"), date: "2026-07-06", title: "Psychosocial support reaches 210 children", body: "Six sessions were held at the Mundakkai relief camp school reaching 210 children, run jointly with a district child welfare officer." },
    ],
    beneficiaries: {
      householdsReached: 176, individualsReached: 812,
      genderSplit: { female: 49, male: 49, other: 2 },
      districts: [
        { name: "Chooralmala", households: 64 }, { name: "Meppadi", households: 112 }
      ],
      vulnerableGroupsCovered: ["Children (psychosocial support)", "Landless agricultural labour households"],
      note: "Figures are aggregate counts reported by field teams. No individually identifying beneficiary information is collected or displayed on this platform."
    },
    impactReports: [],
    audit: [
      { ts: "2026-07-30 17:00", actor: "Aparna Menon", action: "Published progress update", detail: "Shelter construction crosses 40% completion" },
      { ts: "2026-07-22 12:10", actor: "K. Elumalai", action: "Declared expense", detail: "Site Logistics — ₹34,500" },
      { ts: "2026-07-20 10:40", actor: "Thomas Jacob", action: "Declared expense", detail: "Livelihood Grants — ₹2,24,000" },
      { ts: "2026-07-06 09:15", actor: "Sruthi Balakrishnan", action: "Uploaded evidence", detail: "Counselling session summary report" },
      { ts: "2026-06-22 09:00", actor: "Dr. Meenal Kaskhedikar", action: "Campaign published", detail: "Wayanad Landslide Recovery moved from Draft to Active" },
    ]
  },
  {
    id: "CMP-103",
    name: "Cyclone Remal Coastal Rehabilitation",
    disaster: "Cyclone",
    region: "South 24 Parganas, West Bengal",
    status: "active",
    health: "on_track",
    startDate: "2026-05-30",
    objective: "Restore fishing-dependent livelihoods, support house repair for wind and surge-damaged homes, and re-establish safe drinking water access for 2,600 coastal households.",
    targetHouseholds: 2600,
    progress: 78,
    coverImage: "cyclone-remal",
    lastUpdatePublished: "2026-08-18",
    activities: [
      { id: nextId("ACT"), title: "Boat & fishing net repair support", type: "Livelihoods", status: "completed", date: "2026-06-10", location: "Namkhana & Patharpratima blocks", volunteersAssigned: 8, notes: "340 fisher households supported." },
      { id: nextId("ACT"), title: "House repair material distribution", type: "Shelter", status: "completed", date: "2026-06-28", location: "Kakdwip", volunteersAssigned: 15, notes: "890 households received CGI sheets and repair kits." },
      { id: nextId("ACT"), title: "Community tube-well restoration", type: "WASH", status: "in_progress", date: "2026-07-20", location: "Sagar Island villages", volunteersAssigned: 10, notes: "22 of 30 tube-wells restored." },
      { id: nextId("ACT"), title: "Final household verification survey", type: "Assessment", status: "scheduled", date: "2026-09-10", location: "All programme blocks", volunteersAssigned: 12, notes: "" },
    ],
    volunteers: [
      { id: nextId("VOL"), name: "Debjani Halder", role: "Field Coordinator", status: "active", appliedOn: "2026-06-01", skills: ["Bengali, Logistics"], hoursLogged: 96 },
      { id: nextId("VOL"), name: "Suvendu Mondal", role: "Livelihoods Officer", status: "active", appliedOn: "2026-06-02", skills: ["Fisheries"], hoursLogged: 70 },
      { id: nextId("VOL"), name: "Ananya Ghosh", role: "WASH Technician", status: "active", appliedOn: "2026-06-15", skills: ["Hand-pump mechanics"], hoursLogged: 58 },
      { id: nextId("VOL"), name: "Bishu Das", role: "Field Volunteer", status: "pending", appliedOn: "2026-08-14", skills: ["Boat operation"], hoursLogged: 0 },
    ],
    resources: [
      { id: nextId("RES"), name: "CGI Roofing Sheets", unit: "sheets", allocated: 5000, deployed: 4450, source: "Purchased" },
      { id: nextId("RES"), name: "Fishing Net Repair Kits", unit: "kits", allocated: 400, deployed: 340, source: "In-kind — Sundarbans Fisheries Coop" },
      { id: nextId("RES"), name: "Hand Pump Spare Parts", unit: "sets", allocated: 30, deployed: 22, source: "Purchased" },
    ],
    donations: [
      { id: nextId("DON"), donor: "Kolkata Shipping Guild", amount: 450000, date: "2026-06-03", purpose: "House repair materials", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 60000, date: "2026-06-08", purpose: "Fishing livelihoods", method: "Simulated UPI" },
      { id: nextId("DON"), donor: "Ghosh Family Trust", amount: 150000, date: "2026-06-20", purpose: "WASH restoration", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 35000, date: "2026-07-14", purpose: "Unrestricted", method: "Simulated UPI" },
    ],
    expenses: [
      { id: nextId("EXP"), category: "Shelter Repair", vendor: "South Bengal Steel & Roofing", amount: 398500, date: "2026-06-25", status: "verified", evidenceLinked: true, note: "4,450 CGI sheets — invoice and distribution list attached." },
      { id: nextId("EXP"), category: "Livelihoods", vendor: "Sundarbans Fisheries Coop", amount: 88000, date: "2026-06-12", status: "verified", evidenceLinked: true, note: "Net repair kit procurement, in-kind co-funded." },
      { id: nextId("EXP"), category: "WASH Restoration", vendor: "Diamond Harbour Pump Works", amount: 61200, date: "2026-07-21", status: "verified", evidenceLinked: true, note: "Hand-pump spares for 22 restorations." },
    ],
    evidence: [
      { id: nextId("EVD"), title: "CGI sheet distribution list — Kakdwip", type: "Document", linkedTo: "House repair material distribution", uploadedBy: "Debjani Halder", date: "2026-06-29" },
      { id: nextId("EVD"), title: "Tube-well restoration photos (14)", type: "Photo Set", linkedTo: "Community tube-well restoration", uploadedBy: "Ananya Ghosh", date: "2026-08-05" },
      { id: nextId("EVD"), title: "Fisher household support register", type: "Document", linkedTo: "Boat & fishing net repair support", uploadedBy: "Suvendu Mondal", date: "2026-06-11" },
    ],
    updates: [
      { id: nextId("UPD"), date: "2026-08-18", title: "Tube-well restoration nears completion", body: "22 of 30 community tube-wells across Sagar Island villages are now restored and tested. Programme is on track to close by mid-September with a final household verification survey." },
      { id: nextId("UPD"), date: "2026-06-29", title: "890 households receive house repair materials", body: "CGI roofing sheets and repair kits reached 890 wind and surge-damaged households in Kakdwip, alongside continued fishing livelihood support in Namkhana and Patharpratima." },
    ],
    beneficiaries: {
      householdsReached: 2030, individualsReached: 9340,
      genderSplit: { female: 52, male: 46, other: 2 },
      districts: [
        { name: "Kakdwip", households: 890 }, { name: "Namkhana", households: 640 }, { name: "Sagar Island", households: 500 }
      ],
      vulnerableGroupsCovered: ["Small-scale fisher households", "Female-headed households"],
      note: "Figures are aggregate counts reported by field teams. No individually identifying beneficiary information is collected or displayed on this platform."
    },
    impactReports: [],
    audit: [
      { ts: "2026-08-18 15:20", actor: "Debjani Halder", action: "Published progress update", detail: "Tube-well restoration nears completion" },
      { ts: "2026-08-05 10:00", actor: "Ananya Ghosh", action: "Uploaded evidence", detail: "Tube-well restoration photos (14)" },
      { ts: "2026-07-21 13:40", actor: "K. Elumalai", action: "Declared expense", detail: "WASH Restoration — ₹61,200" },
      { ts: "2026-05-30 09:00", actor: "Dr. Meenal Kaskhedikar", action: "Campaign published", detail: "Cyclone Remal Coastal Rehabilitation moved from Draft to Active" },
    ]
  },
  {
    id: "CMP-104",
    name: "Uttarakhand Cloudburst Response 2025",
    disaster: "Cloudburst / Flash Flood",
    region: "Rudraprayag District, Uttarakhand",
    status: "closed",
    health: "on_track",
    startDate: "2025-08-14",
    endDate: "2025-12-20",
    objective: "Deliver emergency relief and support early shelter recovery for flash-flood affected households in Rudraprayag district.",
    targetHouseholds: 850,
    progress: 100,
    coverImage: "uttarakhand-flood",
    lastUpdatePublished: "2025-12-20",
    activities: [
      { id: nextId("ACT"), title: "Emergency relief distribution", type: "Distribution", status: "completed", date: "2025-08-18", location: "Rudraprayag town & surrounding villages", volunteersAssigned: 12, notes: "850 households covered." },
      { id: nextId("ACT"), title: "Interim shelter repair support", type: "Shelter", status: "completed", date: "2025-09-15", location: "Rudraprayag district", volunteersAssigned: 18, notes: "620 homes repaired." },
    ],
    volunteers: [
      { id: nextId("VOL"), name: "Deepak Rawat", role: "Field Coordinator", status: "active", appliedOn: "2025-08-15", skills: ["Logistics"], hoursLogged: 140 },
      { id: nextId("VOL"), name: "Kavita Bisht", role: "Field Volunteer", status: "active", appliedOn: "2025-08-16", skills: ["Community mobilisation"], hoursLogged: 98 },
    ],
    resources: [
      { id: nextId("RES"), name: "Family Relief Kits", unit: "kits", allocated: 850, deployed: 850, source: "Purchased" },
      { id: nextId("RES"), name: "Roof Repair Material Kits", unit: "kits", allocated: 620, deployed: 620, source: "Purchased" },
    ],
    donations: [
      { id: nextId("DON"), donor: "Dehradun Merchants Association", amount: 380000, date: "2025-08-16", purpose: "Emergency relief", method: "Simulated Bank Transfer" },
      { id: nextId("DON"), donor: "Anonymous Donor", amount: 52000, date: "2025-08-20", purpose: "Unrestricted", method: "Simulated UPI" },
    ],
    expenses: [
      { id: nextId("EXP"), category: "Relief Kits", vendor: "Garhwal Supplies Co.", amount: 212000, date: "2025-08-19", status: "verified", evidenceLinked: true, note: "850 kits, invoice attached." },
      { id: nextId("EXP"), category: "Shelter Repair", vendor: "Rudraprayag Hardware Traders", amount: 198500, date: "2025-09-16", status: "verified", evidenceLinked: true, note: "620 households, invoice + photos attached." },
    ],
    evidence: [
      { id: nextId("EVD"), title: "Final distribution photo archive (42)", type: "Photo Set", linkedTo: "Emergency relief distribution", uploadedBy: "Deepak Rawat", date: "2025-08-19" },
      { id: nextId("EVD"), title: "Shelter repair completion report", type: "Document", linkedTo: "Interim shelter repair support", uploadedBy: "Kavita Bisht", date: "2025-09-18" },
    ],
    updates: [
      { id: nextId("UPD"), date: "2025-12-20", title: "Programme closed — final impact report published", body: "All planned activities are complete. 850 households received emergency relief and 620 homes were repaired ahead of winter. The final impact report is now published under Reports." },
    ],
    beneficiaries: {
      householdsReached: 850, individualsReached: 3920,
      genderSplit: { female: 50, male: 48, other: 2 },
      districts: [{ name: "Rudraprayag", households: 850 }],
      vulnerableGroupsCovered: ["Elderly-headed households", "Households above 6,000 ft altitude"],
      note: "Figures are aggregate counts reported by field teams. No individually identifying beneficiary information is collected or displayed on this platform."
    },
    impactReports: [
      { id: nextId("RPT"), title: "Uttarakhand Cloudburst Response — Final Impact Report", period: "14 Aug – 20 Dec 2025", status: "published", publishedOn: "2025-12-20" },
    ],
    audit: [
      { ts: "2025-12-20 12:00", actor: "Dr. Meenal Kaskhedikar", action: "Published impact report", detail: "Final Impact Report" },
      { ts: "2025-12-20 11:40", actor: "Dr. Meenal Kaskhedikar", action: "Closed campaign", detail: "Marked as completed" },
      { ts: "2025-08-14 09:00", actor: "Dr. Meenal Kaskhedikar", action: "Campaign published", detail: "Uttarakhand Cloudburst Response 2025 moved from Draft to Active" },
    ]
  },
  {
    id: "CMP-105",
    name: "Odisha Cyclone Preparedness & Pre-positioning",
    disaster: "Cyclone (Pre-emptive)",
    region: "Ganjam & Puri Districts, Odisha",
    status: "draft",
    health: "not_started",
    startDate: null,
    objective: "Pre-position relief stock and train community volunteers ahead of the projected 2026 post-monsoon cyclone season in coastal Odisha.",
    targetHouseholds: 1500,
    progress: 0,
    coverImage: "odisha-prep",
    lastUpdatePublished: null,
    activities: [], volunteers: [], resources: [], donations: [], expenses: [], evidence: [], updates: [],
    beneficiaries: { householdsReached: 0, individualsReached: 0, genderSplit: { female: 0, male: 0, other: 0 }, districts: [], vulnerableGroupsCovered: [], note: "Programme has not yet started. No beneficiary data collected." },
    impactReports: [],
    audit: [
      { ts: "2026-08-19 16:00", actor: "Rohan D'Souza", action: "Created campaign draft", detail: "Odisha Cyclone Preparedness & Pre-positioning" },
    ]
  },
];

export const INITIAL_FEEDBACK = [
  { id: nextId("FBK"), campaignId: "CMP-101", source: "Volunteer", name: "Anindita Bora", date: "2026-08-10", verified: true, dims: { "Timeliness": 5, "Communication": 4, "Respect & dignity": 5 }, comment: "Distribution planning was well coordinated with camp committees; would like earlier notice on schedule changes." },
  { id: nextId("FBK"), campaignId: "CMP-101", source: "Beneficiary (via camp committee)", name: "Camp Committee, Barpeta Block II", date: "2026-07-16", verified: true, dims: { "Timeliness": 4, "Communication": 4, "Respect & dignity": 5 }, comment: "Kits reached us before the second flood spell. Team was respectful and prioritised elderly households." },
  { id: nextId("FBK"), campaignId: "CMP-102", source: "Volunteer", name: "Thomas Jacob", date: "2026-07-25", verified: true, dims: { "Timeliness": 3, "Communication": 3, "Respect & dignity": 5 }, comment: "Grant disbursal paperwork process needs to be faster — households are waiting longer than expected." },
  { id: nextId("FBK"), campaignId: "CMP-103", source: "Beneficiary (via panchayat)", name: "Kakdwip Gram Panchayat", date: "2026-07-02", verified: true, dims: { "Timeliness": 5, "Communication": 5, "Respect & dignity": 5 }, comment: "Roofing material distribution was transparent and well organised ahead of the next storm season." },
  { id: nextId("FBK"), campaignId: "CMP-104", source: "Volunteer", name: "Deepak Rawat", date: "2025-09-20", verified: true, dims: { "Timeliness": 5, "Communication": 5, "Respect & dignity": 5 }, comment: "Smooth close-out. Field teams stayed until every household on the list was reached." },
  { id: nextId("FBK"), campaignId: "CMP-103", source: "Volunteer", name: "Ananya Ghosh", date: "2026-08-06", verified: true, dims: { "Timeliness": 4, "Communication": 4, "Respect & dignity": 4 }, comment: "Tube-well restoration went smoothly; spare part restocking could be quicker." },
];

export const INITIAL_NOTIFICATIONS = [
  { id: nextId("NTF"), type: "volunteer", severity: "action", campaignId: "CMP-101", text: "3 volunteer applications awaiting review", ts: "2026-08-21 09:00" },
  { id: nextId("NTF"), type: "evidence", severity: "warn", campaignId: "CMP-102", text: "Livelihood Grants expense (₹2,24,000) missing supporting evidence", ts: "2026-08-19 08:30" },
  { id: nextId("NTF"), type: "evidence", severity: "warn", campaignId: "CMP-101", text: "WASH Infrastructure expense (₹1,86,400) missing supporting evidence", ts: "2026-08-18 14:00" },
  { id: nextId("NTF"), type: "update", severity: "warn", campaignId: "CMP-102", text: "Progress update overdue — last published 22 days ago", ts: "2026-08-21 07:00" },
  { id: nextId("NTF"), type: "resource", severity: "info", campaignId: "CMP-101", text: "Tarpaulin stock running low ahead of scheduled distribution", ts: "2026-08-20 11:15" },
  { id: nextId("NTF"), type: "verification", severity: "info", campaignId: null, text: "Annual re-verification window opens in 45 days", ts: "2026-08-15 09:00" },
];

export const DISASTER_TYPES = [
  "Monsoon Flooding",
  "Cyclone",
  "Landslide",
  "Cloudburst / Flash Flood",
  "Earthquake",
  "Heatwave",
  "Drought"
];

// ---- helper formatting functions ----
export function fmtINR(n) {
  if (n === null || n === undefined) return "—";
  return "₹" + Number(n).toLocaleString("en-IN");
}

export function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysAgo(d) {
  if (!d) return null;
  const dt = new Date(d + "T00:00:00");
  const now = new Date("2026-08-25T00:00:00");
  return Math.round((now - dt) / 86400000);
}

export function initials(name) {
  if (!name) return "";
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
