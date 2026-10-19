const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function injectUdaanMockData() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting comprehensive mock data injection for Udaan...');
    await client.query('BEGIN');

    const defaultPassword = 'DevPass123!';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // 1. Get or Update Udaan NGO (id: 3)
    const ngoCheck = await client.query(`SELECT id FROM ngos WHERE email = 'utkbusiness21@gmail.com' OR org_name ILIKE '%Udaan%'`);
    let udaanId;
    if (ngoCheck.rows.length > 0) {
      udaanId = ngoCheck.rows[0].id;
      console.log(`Found Udaan NGO with ID: ${udaanId}`);
      await client.query(`
        UPDATE ngos SET
          org_name = 'Udaan Disaster Relief & Human Welfare Foundation',
          contact_name = 'Utkarsh Choudhary',
          short_name = 'Udaan Relief',
          hq = 'Patna, Bihar & New Delhi',
          founded = 2018,
          tagline = 'Rapid Crisis Response, Humanitarian Logistics & Grassroots Disaster Rehabilitation across India.',
          reg_type = 'Registered Non-Profit Trust (Section 8)',
          darpan_id = 'BR/2022/0319482',
          pan = 'AAATU9876C',
          fcra = 'FCRA-083780442',
          status_80g = '80G & 12A Certified Active',
          verification_status = 'APPROVED',
          sectors = '["Disaster Relief", "Emergency Medical Aid", "Flood Rescue & Evacuation", "Epidemic Containment", "Shelter & Food Logistics"]'::jsonb,
          verification = '{
            "status": "APPROVED",
            "completedOn": "2026-01-18",
            "reviewedBy": "Govt. NGO Darpan Portal Verification System",
            "steps": [
              {"label": "NITI Aayog Darpan Portal ID", "detail": "Verified registration ID: BR/2022/0319482 - Darpan verified active."},
              {"label": "FCRA & 80G Tax Exemption", "detail": "Active 80G tax exemption certificate issued under Section 12A."},
              {"label": "On-Ground Audit & Relief Track Record", "detail": "Audited field verification for Bihar, Kerala, Assam and Chennai flood missions."}
            ]
          }'::jsonb,
          team = '[
            {"name": "Utkarsh Choudhary", "role": "Executive Director & Founder", "since": "2018"},
            {"name": "Dr. Aarav Nambiar", "role": "Head of Emergency Medical Response", "since": "2020"},
            {"name": "Meera Sengupta", "role": "Lead Logistics & Supply Chain Coordinator", "since": "2021"},
            {"name": "Vikram Rathore", "role": "Field Operations & Volunteer Commander", "since": "2022"},
            {"name": "Ananya Deshmukh", "role": "Community Engagement & Rehabilitation Lead", "since": "2023"}
          ]'::jsonb,
          docs = '[
            {"name": "NITI Aayog Darpan Certificate", "type": "Government Verification PDF", "updated": "2026-01-18", "path": "uploads/darpan_cert_verified.pdf"},
            {"name": "Section 12A & 80G Tax Exemption Order", "type": "Income Tax Department PDF", "updated": "2025-11-20", "path": "uploads/80g_exemption.pdf"},
            {"name": "Annual Field Audit & Transparency Report 2025-26", "type": "Statutory Audit PDF", "updated": "2026-02-10", "path": "uploads/audited_financials.pdf"}
          ]'::jsonb
        WHERE id = $1
      `, [udaanId]);
    } else {
      const newNgo = await client.query(`
        INSERT INTO ngos (
          org_name, contact_name, email, password_hash, darpan_id, verification_status,
          role, short_name, hq, founded, tagline, reg_type, pan, fcra, status_80g,
          sectors, verification, team, docs
        ) VALUES (
          'Udaan Disaster Relief & Human Welfare Foundation',
          'Utkarsh Choudhary',
          'utkbusiness21@gmail.com',
          $1,
          'BR/2022/0319482',
          'APPROVED',
          'NGO',
          'Udaan Relief',
          'Patna, Bihar & New Delhi',
          2018,
          'Rapid Crisis Response, Humanitarian Logistics & Grassroots Disaster Rehabilitation across India.',
          'Registered Non-Profit Trust (Section 8)',
          'AAATU9876C',
          'FCRA-083780442',
          '80G & 12A Certified Active',
          '["Disaster Relief", "Emergency Medical Aid", "Flood Rescue & Evacuation", "Epidemic Containment", "Shelter & Food Logistics"]'::jsonb,
          '{"status": "APPROVED", "completedOn": "2026-01-18", "reviewedBy": "Govt. NGO Darpan Portal Verification System"}'::jsonb,
          '[{"name": "Utkarsh Choudhary", "role": "Executive Director & Founder", "since": "2018"}]'::jsonb,
          '[]'::jsonb
        ) RETURNING id
      `, [passwordHash]);
      udaanId = newNgo.rows[0].id;
    }

    // 2. Insert 52 Indian Supporter Users
    console.log('👥 Creating 52 Indian supporters with @example.com emails...');
    const indianSupportersData = [
      { name: "Aarav Sharma", email: "aarav.sharma@example.com", city: "Patna", state: "Bihar", help: ["volunteering", "medical"] },
      { name: "Priya Patel", email: "priya.patel@example.com", city: "Wayanad", state: "Kerala", help: ["volunteering", "logistics"] },
      { name: "Rohan Verma", email: "rohan.verma@example.com", city: "Chennai", state: "Tamil Nadu", help: ["volunteering", "goods"] },
      { name: "Neha Gupta", email: "neha.gupta@example.com", city: "New Delhi", state: "Delhi", help: ["volunteering", "logistics", "goods"] },
      { name: "Vikram Malhotra", email: "vikram.malhotra@example.com", city: "Mumbai", state: "Maharashtra", help: ["volunteering", "rescue"] },
      { name: "Ananya Sen", email: "ananya.sen@example.com", city: "Kolkata", state: "West Bengal", help: ["volunteering", "medical"] },
      { name: "Rahul Joshi", email: "rahul.joshi@example.com", city: "Pune", state: "Maharashtra", help: ["volunteering", "logistics"] },
      { name: "Sneha Nair", email: "sneha.nair@example.com", city: "Kochi", state: "Kerala", help: ["volunteering", "goods"] },
      { name: "Aditya Kulkarni", email: "aditya.kulkarni@example.com", city: "Bengaluru", state: "Karnataka", help: ["volunteering", "logistics"] },
      { name: "Pooja Iyer", email: "pooja.iyer@example.com", city: "Chennai", state: "Tamil Nadu", help: ["volunteering", "medical"] },
      { name: "Rajesh Mehta", email: "rajesh.mehta@example.com", city: "Ahmedabad", state: "Gujarat", help: ["goods", "logistics"] },
      { name: "Sunita Rao", email: "sunita.rao@example.com", city: "Hyderabad", state: "Telangana", help: ["volunteering", "goods"] },
      { name: "Siddharth Jain", email: "siddharth.jain@example.com", city: "Jaipur", state: "Rajasthan", help: ["volunteering", "logistics"] },
      { name: "Kavita Desai", email: "kavita.desai@example.com", city: "Surat", state: "Gujarat", help: ["volunteering", "medical"] },
      { name: "Amitav Ghosh", email: "amitav.ghosh@example.com", city: "Kolkata", state: "West Bengal", help: ["volunteering", "goods"] },
      { name: "Divya Menon", email: "divya.menon@example.com", city: "Calicut", state: "Kerala", help: ["volunteering", "logistics"] },
      { name: "Varun Saxena", email: "varun.saxena@example.com", city: "Lucknow", state: "Uttar Pradesh", help: ["volunteering", "rescue"] },
      { name: "Shreya Bhattacharya", email: "shreya.b@example.com", city: "Bhubaneswar", state: "Odisha", help: ["volunteering", "medical"] },
      { name: "Karthik Raman", email: "karthik.raman@example.com", city: "Madurai", state: "Tamil Nadu", help: ["volunteering", "logistics"] },
      { name: "Deepika Sundaram", email: "deepika.sundaram@example.com", city: "Coimbatore", state: "Tamil Nadu", help: ["volunteering", "goods"] },
      { name: "Nikhil Chopra", email: "nikhil.chopra@example.com", city: "Chandigarh", state: "Punjab", help: ["volunteering", "logistics"] },
      { name: "Swati Mishra", email: "swati.mishra@example.com", city: "Patna", state: "Bihar", help: ["volunteering", "medical"] },
      { name: "Manisha Yadav", email: "manisha.yadav@example.com", city: "Varanasi", state: "Uttar Pradesh", help: ["volunteering", "goods"] },
      { name: "Gaurav Tiwari", email: "gaurav.tiwari@example.com", city: "Ranchi", state: "Jharkhand", help: ["volunteering", "rescue"] },
      { name: "Shruti Pillai", email: "shruti.pillai@example.com", city: "Trivandrum", state: "Kerala", help: ["volunteering", "medical"] },
      { name: "Akash Verma", email: "akash.verma@example.com", city: "Danapur", state: "Bihar", help: ["volunteering", "logistics"] },
      { name: "Ritika Kaur", email: "ritika.kaur@example.com", city: "Amritsar", state: "Punjab", help: ["goods", "volunteering"] },
      { name: "Harshvardhan Singh", email: "harsh.singh@example.com", city: "Jodhpur", state: "Rajasthan", help: ["volunteering", "rescue"] },
      { name: "Megha Banerjee", email: "megha.b@example.com", city: "Siliguri", state: "West Bengal", help: ["volunteering", "medical"] },
      { name: "Pranav Hegde", email: "pranav.hegde@example.com", city: "Mangalore", state: "Karnataka", help: ["volunteering", "logistics"] },
      { name: "Tanvi Agarwal", email: "tanvi.agarwal@example.com", city: "Kanpur", state: "Uttar Pradesh", help: ["volunteering", "goods"] },
      { name: "Kunal Kapoor", email: "kunal.kapoor@example.com", city: "Dehradun", state: "Uttarakhand", help: ["volunteering", "rescue"] },
      { name: "Rashmi Soni", email: "rashmi.soni@example.com", city: "Indore", state: "Madhya Pradesh", help: ["volunteering", "medical"] },
      { name: "Devendra Rathore", email: "devendra.r@example.com", city: "Kota", state: "Rajasthan", help: ["volunteering", "logistics"] },
      { name: "Ritu Singhal", email: "ritu.singhal@example.com", city: "Noida", state: "Uttar Pradesh", help: ["volunteering", "goods"] },
      { name: "Mayank Tripathi", email: "mayank.t@example.com", city: "Allahabad", state: "Uttar Pradesh", help: ["volunteering", "rescue"] },
      { name: "Preeti Reddy", email: "preeti.reddy@example.com", city: "Visakhapatnam", state: "Andhra Pradesh", help: ["volunteering", "medical"] },
      { name: "Alok Mukherjee", email: "alok.mukherjee@example.com", city: "Guwahati", state: "Assam", help: ["volunteering", "logistics"] },
      { name: "Shubham Pandey", email: "shubham.p@example.com", city: "Gaya", state: "Bihar", help: ["volunteering", "rescue"] },
      { name: "Ishita Dutta", email: "ishita.dutta@example.com", city: "Cuttack", state: "Odisha", help: ["volunteering", "medical"] },
      { name: "Naveen Sundaram", email: "naveen.sundaram@example.com", city: "Tiruchirappalli", state: "Tamil Nadu", help: ["volunteering", "logistics"] },
      { name: "Sangeeta Ghosh", email: "sangeeta.ghosh@example.com", city: "Asansol", state: "West Bengal", help: ["volunteering", "goods"] },
      { name: "Tarun Bajaj", email: "tarun.bajaj@example.com", city: "Ludhiana", state: "Punjab", help: ["volunteering", "rescue"] },
      { name: "Payal Khandelwal", email: "payal.k@example.com", city: "Bhopal", state: "Madhya Pradesh", help: ["volunteering", "medical"] },
      { name: "Saurabh Mishra", email: "saurabh.mishra@example.com", city: "Muzaffarpur", state: "Bihar", help: ["volunteering", "logistics"] },
      { name: "Komal Chauhan", email: "komal.chauhan@example.com", city: "Shimla", state: "Himachal Pradesh", help: ["volunteering", "rescue"] },
      { name: "Yashwant Rao", email: "yashwant.rao@example.com", city: "Nagpur", state: "Maharashtra", help: ["volunteering", "logistics"] },
      { name: "Vandana Mathur", email: "vandana.mathur@example.com", city: "Udaipur", state: "Rajasthan", help: ["volunteering", "medical"] },
      { name: "Mohit Singla", email: "mohit.singla@example.com", city: "Patiala", state: "Punjab", help: ["volunteering", "goods"] },
      { name: "Charu Saxena", email: "charu.saxena@example.com", city: "Agra", state: "Uttar Pradesh", help: ["volunteering", "medical"] },
      { name: "Arun Prasad", email: "arun.prasad@example.com", city: "Hajipur", state: "Bihar", help: ["volunteering", "rescue"] },
      { name: "Lata Namboodiri", email: "lata.n@example.com", city: "Thrissur", state: "Kerala", help: ["volunteering", "medical"] }
    ];

    const supporterIds = [];
    for (let i = 0; i < indianSupportersData.length; i++) {
      const s = indianSupportersData[i];
      const aadhaar = `78901234${(1001 + i).toString().padStart(4, '0')}`;
      const res = await client.query(`
        INSERT INTO supporters (full_name, email, password_hash, aadhaar_id, city, state, help_types, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUPPORTER')
        ON CONFLICT (email) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          help_types = EXCLUDED.help_types
        RETURNING id
      `, [s.name, s.email, passwordHash, aadhaar, s.city, s.state, s.help]);
      supporterIds.push({ id: res.rows[0].id, name: s.name, city: s.city, state: s.state });
    }
    console.log(`Successfully synced ${supporterIds.length} Indian supporter accounts.`);

    // 3. Clear existing child records for Udaan campaigns to rebuild a clean, authentic, rich history
    const udaanCamps = await client.query(`SELECT id FROM campaigns WHERE ngo_id = $1`, [udaanId]);
    const campIds = udaanCamps.rows.map(r => r.id);

    if (campIds.length > 0) {
      console.log(`Clearing old test child records for Udaan campaigns: [${campIds.join(', ')}]...`);
      await client.query(`DELETE FROM volunteers WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM expenses WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM donations WHERE campaign_id = ANY($1) OR ngo_id = $2`, [campIds, udaanId]);
      await client.query(`DELETE FROM evidence WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM activities WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM updates WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM impact_reports WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM resources WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM feedback WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM audit_logs WHERE campaign_id = ANY($1)`, [campIds]);
      await client.query(`DELETE FROM workshops WHERE ngo_id = $1`, [udaanId]);
    }

    // 4. Upsert 4 Realistic Active Campaigns for Udaan
    console.log('📌 Configuring 4 comprehensive campaigns for Udaan...');
    
    // Campaign 1: Dengue Epidemic (Patna)
    let c1Id;
    const c1Res = await client.query(`
      INSERT INTO campaigns (
        ngo_id, name, disaster, region, status, objective, target_households,
        start_date, health, progress, is_urgent, beneficiaries, cover_image_path
      ) VALUES (
        $1,
        'Dengue & Vector-Borne Epidemic Emergency Response',
        'Epidemic / Flash Flood Containment',
        'Patna, Hajipur & Danapur (Bihar)',
        'active',
        'Deploy mobile medical clinics, distribute 6,000+ long-lasting insecticidal bed nets, provide free NS1/IgM rapid diagnostic tests, and conduct intensive anti-larval fogging operations across water-logged urban wards and flood shelters.',
        6500,
        '2026-08-10',
        'on_track',
        82,
        true,
        '{
          "note": "Intensive sanitation, mobile triage, and fever management across 16 high-risk wards and relief shelters.",
          "districts": ["Patna Urban Wards 8-22", "Danapur Low-lying Slums", "Hajipur Flood Resettlement", "Vaishali Rural Perimeter"],
          "genderSplit": {"male": 5940, "female": 6580, "other": 190},
          "householdsReached": 5330,
          "individualsReached": 12710,
          "vulnerableGroupsCovered": ["Elderly Patients", "Infants & Toddlers", "Sanitation Workers", "Flood-displaced Families"]
        }'::jsonb,
        'uploads/campaign_dengue_patna.jpg'
      ) RETURNING id
    `, [udaanId]);
    c1Id = c1Res.rows[0].id;

    // Campaign 2: Wayanad Landslide & Flash Flood
    let c2Id;
    const c2Res = await client.query(`
      INSERT INTO campaigns (
        ngo_id, name, disaster, region, status, objective, target_households,
        start_date, health, progress, is_urgent, beneficiaries, cover_image_path
      ) VALUES (
        $1,
        'Wayanad Landslide Emergency Search, Rescue & Ration Relief',
        'Catastrophic Landslide & Flash Flood',
        'Meppadi & Chooralmala, Wayanad (Kerala)',
        'active',
        'Immediate deployment of inflatable rescue dinghies, high-output drinking water filtration units, 25kg dry ration family kits, and insulated emergency shelter tents for displaced tea plantation worker communities.',
        4200,
        '2026-08-15',
        'on_track',
        88,
        true,
        '{
          "note": "Field coordination with Kerala State Disaster Management Authority (KSDMA) and local community panchayats.",
          "districts": ["Chooralmala Ground Zero", "Mundakkai Valley", "Meppadi Relief Centers", "Kalpetta General Hospital Base"],
          "genderSplit": {"male": 4480, "female": 5120, "other": 110},
          "householdsReached": 3690,
          "individualsReached": 9710,
          "vulnerableGroupsCovered": ["Plantation Workers", "Indigenous Tribal Households", "Injured Evacuees", "Single Mother Families"]
        }'::jsonb,
        'uploads/campaign_wayanad_landslide.jpg'
      ) RETURNING id
    `, [udaanId]);
    c2Id = c2Res.rows[0].id;

    // Campaign 3: Highland Himalayan Mountain Highway Disaster
    let c3Id;
    const c3Res = await client.query(`
      INSERT INTO campaigns (
        ngo_id, name, disaster, region, status, objective, target_households,
        start_date, health, progress, is_urgent, beneficiaries, cover_image_path
      ) VALUES (
        $1,
        'Highland Mountain Landslide & Cold Weather Relief Operation',
        'Torrential Cloudburst & Mountain Landslide',
        'North Sikkim & Border Highway Corridor',
        'active',
        'Providing sub-zero thermal blankets, heavy tarpaulins, high-energy dry rations, solar lanterns, and satellite communications support to isolated Himalayan valley hamlets cut off by massive road-severing landslides.',
        2800,
        '2026-08-20',
        'on_track',
        68,
        false,
        '{
          "note": "High-altitude distribution via porter caravans and 4x4 mountain relief trucks.",
          "districts": ["Chungthang Valley", "Mangan High-Pass Hamlets", "Lachen Road Cutoff Zone", "Dikchu Relief Hub"],
          "genderSplit": {"male": 2320, "female": 2580, "other": 50},
          "householdsReached": 1904,
          "individualsReached": 4950,
          "vulnerableGroupsCovered": ["Isolated Mountain Villagers", "Stranded Pilgrims & Drivers", "Elderly Nomads"]
        }'::jsonb,
        'uploads/campaign_highland_landslide.jpg'
      ) RETURNING id
    `, [udaanId]);
    c3Id = c3Res.rows[0].id;

    // Campaign 4: Chennai Monsoon Flooding
    let c4Id;
    const c4Res = await client.query(`
      INSERT INTO campaigns (
        ngo_id, name, disaster, region, status, objective, target_households,
        start_date, health, progress, is_urgent, beneficiaries, cover_image_path
      ) VALUES (
        $1,
        'Tamil Nadu Coastal Cyclone & Urban Monsoon Flooding Aid',
        'Severe Cyclonic Inundation & Urban Flooding',
        'Chennai, Tambaram & Chengalpattu (Tamil Nadu)',
        'active',
        'Mobilizing 15 motorized rescue boats, operating 3 community mega-kitchens serving 12,000 hot meals daily, distributing hygiene kits, and providing chlorine water purification tablets to flood-submerged low-income neighborhoods.',
        8000,
        '2026-08-05',
        'on_track',
        94,
        true,
        '{
          "note": "Active rescue and relief in Velachery, Tambaram, Mudichur, Ennore, and Pulicat coastal belt.",
          "districts": ["Velachery Lowlands", "Tambaram Basin", "Mudichur Submerged Ward", "Pulicat Fisherfolk Colony"],
          "genderSplit": {"male": 8450, "female": 9250, "other": 230},
          "householdsReached": 7520,
          "individualsReached": 17930,
          "vulnerableGroupsCovered": ["Coastal Fisherfolk Families", "Slum Tenement Dwellers", "Differently Abled Citizens", "Stranded Daily Wage Earners"]
        }'::jsonb,
        'uploads/campaign_chennai_floods.jpg'
      ) RETURNING id
    `, [udaanId]);
    c4Id = c4Res.rows[0].id;

    const allCamps = [
      { id: c1Id, name: 'Dengue & Vector-Borne Epidemic Emergency Response', region: 'Patna, Bihar' },
      { id: c2Id, name: 'Wayanad Landslide Emergency Search, Rescue & Ration Relief', region: 'Wayanad, Kerala' },
      { id: c3Id, name: 'Highland Mountain Landslide & Cold Weather Relief Operation', region: 'North Sikkim' },
      { id: c4Id, name: 'Tamil Nadu Coastal Cyclone & Urban Monsoon Flooding Aid', region: 'Chennai, Tamil Nadu' }
    ];

    // 5. Assign ~50 Volunteers across the 4 campaigns
    console.log('🤝 Enrolling ~50 volunteers with roles, skills, and logged hours...');
    const volunteerRoles = [
      { role: "First Aid & Medical Field Responder", skills: ["Medical Triage", "CPR Certified", "Patient Vitals Screening", "Hindi / English"], hours: 64 },
      { role: "Emergency Supply Chain & Ration Dispatcher", skills: ["Inventory Management", "Forklift Operation", "Relief Kit Packaging", "Tamil / Malayalam"], hours: 82 },
      { role: "Search, Evacuation & Boat Operator", skills: ["Motorboat Navigation", "Water Rescue Life-Saving", "First Responder", "Swimming Certified"], hours: 110 },
      { role: "Community Kitchen & Food Nutrition Lead", skills: ["Hygiene Protocols", "Bulk Meal Preparation", "Ration Quality Check"], hours: 95 },
      { role: "Vector Control & Anti-Larval Fogging Operator", skills: ["Chemical Safety", "Thermal Fogger Equipment", "Sanitation Audit"], hours: 48 },
      { role: "Beneficiary Intake & Aadhaar Verification Volunteer", skills: ["Digital Data Entry", "Aadhaar Audit", "Community Counseling", "Local Dialect"], hours: 56 },
      { role: "Temporary Shelter Construction & Debris Clearance", skills: ["Carpentry", "Tarpaulin Rigging", "Heavy Debris Removal", "Safety Gear"], hours: 74 },
      { role: "Child Protection & Psychological First Aid", skills: ["Child Trauma Counseling", "Recreation Therapy", "First Aid"], hours: 40 }
    ];

    for (let i = 0; i < supporterIds.length; i++) {
      const s = supporterIds[i];
      const targetCamp = allCamps[i % allCamps.length];
      const rInfo = volunteerRoles[i % volunteerRoles.length];
      const status = (i % 8 === 0) ? 'pending' : (i % 6 === 0 ? 'completed' : 'active');
      const hours = status === 'pending' ? 0 : rInfo.hours + (i * 3) % 45;
      const dateAgo = new Date(Date.now() - ((52 - i) * 86400000 * 0.4)).toISOString();

      await client.query(`
        INSERT INTO volunteers (
          campaign_id, supporter_id, name, role, skills, hours_logged, status, applied_on, document_path
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        targetCamp.id,
        s.id,
        s.name,
        rInfo.role,
        JSON.stringify(rInfo.skills),
        hours,
        status,
        dateAgo,
        `uploads/volunteer_id_proof_${s.id}.pdf`
      ]);
    }
    console.log('Enrolled 52 volunteer profiles with verified roles and active field deployments.');

    // 6. Inject Realistic Donations (Campaign and Direct NGO)
    console.log('💰 Adding 40 realistic Indian donations with payment details...');
    const donationSamples = [
      { donor: "Rameshwaram Charitable Trust", amount: 250000, purpose: "Emergency Mobile Clinic & Diagnostic Kits", method: "HDFC Corporate Wire", camp: c1Id },
      { donor: "Anand Mahindra CSR Relief Fund", amount: 500000, purpose: "High-Capacity Inflatable Rescue Dinghies & Outboard Motors", method: "Razorpay Net Banking", camp: c2Id },
      { donor: "Aarav & Meera Sharma", amount: 25000, purpose: "50 Long-Lasting Mosquito Nets & Hygiene Kits", method: "UPI (Google Pay)", camp: c1Id },
      { donor: "Kochi Rotary Club Midtown", amount: 150000, purpose: "Clean Drinking Water Purification Cartridges & Pumps", method: "ICICI Bank Transfer", camp: c2Id },
      { donor: "Tamil Nadu Tech Workers Solidarity", amount: 320000, purpose: "Community Mega-Kitchen Hot Meals (10,000 Displaced Families)", method: "Razorpay UPI", camp: c4Id },
      { donor: "Himalayan Trekkers & Porters Guild", amount: 75000, purpose: "Thermal Sub-Zero Blankets & High-Energy Survival Rations", method: "UPI (PhonePe)", camp: c3Id },
      { donor: "Dr. Sunita Deshmukh & Family", amount: 50000, purpose: "Pediatric Anti-Viral Medication & IV Infusions", method: "UPI (Paytm)", camp: c1Id },
      { donor: "Mehta Logistics Corporation", amount: 200000, purpose: "Emergency 20-Ton Diesel Trucking Freight Assistance", method: "NEFT / RTGS", camp: c4Id },
      { donor: "Priya Nair", amount: 15000, purpose: "Baby Food, Diapers & Women Dignity Kits", method: "UPI (Google Pay)", camp: c2Id },
      { donor: "Siddharth Verma", amount: 10000, purpose: "Emergency First Aid Kits & Chlorine Tablets", method: "UPI (PhonePe)", camp: c1Id },
      { donor: "Chennai Citizens Cyclone Support Network", amount: 180000, purpose: "Heavy Duty Submersible Water Extraction Pumps", method: "Razorpay Net Banking", camp: c4Id },
      { donor: "Patna Merchants Welfare Association", amount: 120000, purpose: "Bulk Grain, Rice & Edible Oil Sacks (10 Tons)", method: "Bank Transfer", camp: c1Id },
      { donor: "Nikhil & Sneha Chopra", amount: 35000, purpose: "Insulated Heavy-Duty Tarpaulins & Bamboo Shelter Poles", method: "UPI", camp: c3Id },
      { donor: "Infosys Employee Giving Circle", amount: 450000, purpose: "Wayanad Landslide Rehabilitation & Family Support", method: "Corporate NEFT", camp: c2Id },
      { donor: "Vikram Malhotra", amount: 20000, purpose: "Rescue Operations Fuel Reserve", method: "UPI", camp: c4Id },
      { donor: "Anonymous Humanitarian Donor", amount: 100000, purpose: "Unrestricted Emergency Crisis Deployment", method: "Razorpay Wire", camp: null, ngo_id: udaanId },
      { donor: "Kavita Desai", amount: 12000, purpose: "Emergency Dengue Platelet Testing Drives", method: "UPI", camp: c1Id },
      { donor: "Bhubaneswar Relief Collective", amount: 60000, purpose: "Portable Solar Lighting Lanterns for Shelters", method: "UPI (Google Pay)", camp: c3Id },
      { donor: "Deepika Ramanathan", amount: 25000, purpose: "Sanitation & Disinfectant Supplies", method: "UPI", camp: c4Id },
      { donor: "Godrej Community Welfare Trust", amount: 300000, purpose: "Modular Emergency Sanitation Units", method: "Bank Wire", camp: c4Id }
    ];

    for (let i = 0; i < donationSamples.length; i++) {
      const d = donationSamples[i];
      const dateAgo = new Date(Date.now() - ((20 - i) * 86400000 * 0.9)).toISOString();
      await client.query(`
        INSERT INTO donations (campaign_id, donor, amount, purpose, method, date, ngo_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [d.camp, d.donor, d.amount, d.purpose, d.method, dateAgo, udaanId]);
    }

    // 7. Inject Expenses Declared with Verified Vendors
    console.log('📋 Creating verified audit expenses with vendors and notes...');
    const expenseList = [
      // Dengue Campaign
      { camp: c1Id, cat: "Medical Supplies", vendor: "MedPlus Healthcare Supplies Ltd (Patna)", amt: 245000, date: "2026-08-12", note: "Purchased 6,000 certified rapid Dengue NS1/IgM antigen test kits and IV saline infusions." },
      { camp: c1Id, cat: "Sanitation & Vector Control", vendor: "Kisan Agro Chemicals & Thermal Foggers", amt: 135000, date: "2026-08-15", note: "Procured 12 thermal smoke fogging machines and 300 liters Pyrethrum anti-larval solution." },
      { camp: c1Id, cat: "Bedding & Mosquito Nets", vendor: "Bihar Handloom & Relief Textiles Co-op", amt: 180000, date: "2026-08-18", note: "6,000 Long-Lasting Insecticidal Bed Nets (LLINs) for flood shelter distribution." },
      { camp: c1Id, cat: "Field Clinic Logistics", vendor: "Patna Ambulance & Mobile Medical Transport", amt: 78000, date: "2026-08-22", note: "Fuel and rental for 4 mobile doctor clinic vans operating in slum wards." },

      // Wayanad Campaign
      { camp: c2Id, cat: "Rescue Equipment", vendor: "Royal Marine Rescue Gear & Inflatable Boats", amt: 450000, date: "2026-08-16", note: "4 motorized heavy-duty Zodiac rescue boats with 40HP Yamaha outboard motors and life buoys." },
      { camp: c2Id, cat: "Food & Nutrition Supplies", vendor: "Kerala Agro Supply & Rice Mill Kalpetta", amt: 480000, date: "2026-08-18", note: "15 metric tons Matta Rice, Toor Dal, Jaggery, and baby nutritional formula." },
      { camp: c2Id, cat: "Clean Water Infrastructure", vendor: "Eureka Forbes Clean Water Technologies", amt: 190000, date: "2026-08-20", note: "3 mobile solar-powered RO water filtration plants (1,500 Liters/Hour capacity)." },
      { camp: c2Id, cat: "Emergency Shelter Kits", vendor: "Nilgiri Mountain Relief Supplies Co.", amt: 220000, date: "2026-08-24", note: "800 heavy-gauge PVC storm tarpaulins and ground insulation mats." },

      // Mountain Highway Campaign
      { camp: c3Id, cat: "Cold-Weather Gear", vendor: "Himalayan Outdoor Survival Equipment", amt: 260000, date: "2026-08-22", note: "2,500 sub-zero fleece blankets, thermal coats, and waterproof emergency ponchos." },
      { camp: c3Id, cat: "Satellite Communications", vendor: "Bharat Satellite & Telecom Emergency Systems", amt: 115000, date: "2026-08-25", note: "Rental and airtime for 4 Iridium satellite communicators for cut-off mountain valleys." },
      { camp: c3Id, cat: "High-Altitude Rations", vendor: "Sikkim Cooperative Dairy & Dry Food Depot", amt: 175000, date: "2026-08-28", note: "High-protein roasted grains, dry fruits, glucose biscuits, and ready-to-eat energy bars." },

      // Chennai Cyclone Campaign
      { camp: c4Id, cat: "Community Kitchen Rations", vendor: "Annapurna Wholesale Grain & Grocery Terminal", amt: 520000, date: "2026-08-08", note: "Bulk provisions feeding 12,000 hot cooked meals daily across 4 mega-kitchen hubs." },
      { camp: c4Id, cat: "Water De-watering Pumps", vendor: "Crompton Industrial Submersible Pumps Depot", amt: 310000, date: "2026-08-11", note: "6 high-flow diesel de-watering pumps deployed to clear submerged hospital corridors." },
      { camp: c4Id, cat: "Rescue Boat Fuel & Maintenance", vendor: "Bharat Petroleum Corporation Marine Outlet", amt: 95000, date: "2026-08-14", note: "2,200 Liters petrol and 2T engine oil for 15 volunteer rescue boats." },
      { camp: c4Id, cat: "Hygiene & Dignity Kits", vendor: "Supreme Healthcare & Hygiene Products Chennai", amt: 185000, date: "2026-08-17", note: "5,000 sanitary napkin packs, soaps, disinfectant liquid, and chlorine water purification tablets." }
    ];

    const expenseIds = [];
    for (const exp of expenseList) {
      const res = await client.query(`
        INSERT INTO expenses (campaign_id, category, vendor, amount, expense_date, note, status, evidence_linked)
        VALUES ($1, $2, $3, $4, $5, $6, 'verified', true)
        RETURNING id
      `, [exp.camp, exp.cat, exp.vendor, exp.amt, exp.date, exp.note]);
      expenseIds.push({ id: res.rows[0].id, camp: exp.camp, vendor: exp.vendor });
    }

    // 8. Inject Verifiable Evidence & Document Proofs
    console.log('📄 Uploading verifiable invoice receipts and field distribution evidence...');
    const evidenceList = [
      { camp: c1Id, title: "MedPlus Official GST Invoice - 6,000 Dengue Diagnostic Kits", type: "Tax Invoice & Bill", path: "uploads/evidence_medplus_patna_gst.pdf", linked: "MedPlus Healthcare Supplies Ltd (Patna)", expIdx: 0 },
      { camp: c1Id, title: "District Health Officer Verification & Distribution Log Sheet", type: "Official Field Certificate", path: "uploads/evidence_dho_patna_sanitation.pdf", linked: "Kisan Agro Chemicals & Thermal Foggers", expIdx: 1 },
      { camp: c1Id, title: "Beneficiary Acknowledgment & Bed Net Receiving Signatures", type: "Distribution Sign-off Sheet", path: "uploads/evidence_bednet_signatures.pdf", linked: "Bihar Handloom & Relief Textiles Co-op", expIdx: 2 },
      { camp: c2Id, title: "Zodiac Rescue Craft Import & Coast Guard Safety Challan", type: "Equipment Warranty & Challan", path: "uploads/evidence_zodiac_boats_wayanad.pdf", linked: "Royal Marine Rescue Gear & Inflatable Boats", expIdx: 4 },
      { camp: c2Id, title: "Wayanad APMC Mandi Weightbridge Grain Loading Certificate", type: "Weighbridge Delivery Proof", path: "uploads/evidence_wayanad_grain_slip.pdf", linked: "Kerala Agro Supply & Rice Mill Kalpetta", expIdx: 5 },
      { camp: c2Id, title: "Water Quality Lab Purity Testing Report (1,500 LPH RO)", type: "Lab Water Purity Test", path: "uploads/evidence_eureka_water_lab.pdf", linked: "Eureka Forbes Clean Water Technologies", expIdx: 6 },
      { camp: c3Id, title: "Border Roads Organisation (BRO) Transit Gate Clearance Slip", type: "Transit Permit & Gate Pass", path: "uploads/evidence_sikkim_bro_transit.pdf", linked: "Himalayan Outdoor Survival Equipment", expIdx: 8 },
      { camp: c3Id, title: "Iridium Satellite Network Airtime & Device Invoice", type: "Telecom Service Receipt", path: "uploads/evidence_iridium_satellite.pdf", linked: "Bharat Satellite & Telecom Emergency Systems", expIdx: 9 },
      { camp: c4Id, title: "Mega-Kitchen Food Safety & Municipal Corporation Inspection Certificate", type: "FSSAI Food Safety Audit", path: "uploads/evidence_chennai_fssai_kitchen.pdf", linked: "Annapurna Wholesale Grain & Grocery Terminal", expIdx: 11 },
      { camp: c4Id, title: "Tamil Nadu Fire & Rescue Services Submersible Pump Handover Slip", type: "Govt Handover Receipt", path: "uploads/evidence_tnfrs_pump_receipt.pdf", linked: "Crompton Industrial Submersible Pumps Depot", expIdx: 12 },
      { camp: c4Id, title: "BPCL Marine Fuel Indent & Daily Consumption Register", type: "Fuel Consumption Audit", path: "uploads/evidence_bpcl_fuel_register.pdf", linked: "Bharat Petroleum Corporation Marine Outlet", expIdx: 13 }
    ];

    for (const ev of evidenceList) {
      const expId = expenseIds[ev.expIdx] ? expenseIds[ev.expIdx].id : null;
      await client.query(`
        INSERT INTO evidence (campaign_id, title, document_type, file_path, linked_expense_id, uploaded_at, uploaded_by, linked_to)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, 'Udaan Operations Lead', $6)
      `, [ev.camp, ev.title, ev.type, ev.path, expId, ev.linked]);
    }

    // 9. Inject Operational Activities & Milestones
    console.log('📍 Scheduling and logging on-ground activities...');
    const activityList = [
      // Dengue
      { camp: c1Id, title: "Intensive Anti-Larval Fogging & Chlorine Sanitization (Ward 8 to 16)", type: "Sanitization & Vector Control", date: "2026-08-14", loc: "Patna Urban Slum Belt", vol: 18, status: "completed", notes: "Successfully covered 4,200 households and waterlogged street drains." },
      { camp: c1Id, title: "Mobile Pediatric & Fever Screening OPD Camp", type: "Medical Aid", date: "2026-08-18", loc: "Danapur Community Hall", vol: 24, status: "completed", notes: "1,450 blood smears screened; 320 acute patients provided electrolyte hydration." },
      { camp: c1Id, title: "Door-to-Door Long-Lasting Bed Net & Repellent Distribution", type: "Relief Distribution", date: "2026-08-25", loc: "Hajipur Flood Resettlement", vol: 30, status: "completed", notes: "5,330 nets distributed with household signature verification." },
      { camp: c1Id, title: "Platelet & Blood Donation Mobilization Drive", type: "Medical Aid", date: "2026-09-02", loc: "Patna Medical College Base", vol: 15, status: "scheduled", notes: "Coordinating voluntary donor roster with state blood bank." },

      // Wayanad
      { camp: c2Id, camp: c2Id, title: "Chooralmala Flood Debris Search & Medical Evacuation Mission", type: "Search & Rescue", date: "2026-08-17", loc: "Chooralmala Riverbank", vol: 32, status: "completed", notes: "Evacuated 148 stranded citizens to the Kalpetta relief camp." },
      { camp: c2Id, title: "25kg Dry Grocery Family Survival Kit Distribution Drive", type: "Food Distribution", date: "2026-08-21", loc: "Meppadi Tea Estate School", vol: 40, status: "completed", notes: "3,690 families supplied with 30-day comprehensive rations." },
      { camp: c2Id, title: "Mobile RO Water Filtration Plant Installation (1,500 LPH)", type: "Water & Sanitation", date: "2026-08-26", loc: "Mundakkai Base Camp", vol: 12, status: "completed", notes: "Producing 30,000 liters of potable drinking water daily." },

      // Highland
      { camp: c3Id, title: "High-Altitude Thermal Blankets & Rations Porter Dispatch", type: "Logistics Transport", date: "2026-08-23", loc: "Chungthang Valley Cutoff", vol: 20, status: "completed", notes: "Carried 1,900 supply packs over collapsed highway sections." },
      { camp: c3Id, title: "Satellite Telecom Point & Family Tracing Camp", type: "Communications", date: "2026-08-27", loc: "Mangan Road Junction", vol: 8, status: "completed", notes: "Enabled 850 stranded individuals to contact families across India." },

      // Chennai
      { camp: c4Id, title: "Motorboat Evacuation from Submerged Ground Floor Houses", type: "Search & Rescue", date: "2026-08-09", loc: "Velachery & Tambaram Basin", vol: 35, status: "completed", notes: "Rescued 1,240 seniors, infants, and pets across 15 motorized boats." },
      { camp: c4Id, title: "Mega-Kitchen Daily 12,000 Hot Cooked Meals Distribution", type: "Food Distribution", date: "2026-08-12", loc: "Tambaram Relief Hub", vol: 45, status: "completed", notes: "Delivered nutritious hot meals in eco-friendly aluminum packs." },
      { camp: c4Id, title: "Women Dignity & Infant Hygiene Kit Distribution", type: "Relief Distribution", date: "2026-08-19", loc: "Pulicat Fisherfolk Colony", vol: 28, status: "completed", notes: "7,520 packs distributed with baby food, sanitary pads, and chlorine tabs." }
    ];

    for (const act of activityList) {
      await client.query(`
        INSERT INTO activities (campaign_id, title, type, activity_date, location, volunteers_assigned, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [act.camp, act.title, act.type, act.date, act.loc, act.vol, act.status, act.notes]);
    }

    // 10. Inject Progress Updates
    console.log('📢 Publishing real-time crisis dispatch updates...');
    const updatesList = [
      { camp: c1Id, title: "Day 12 Update: 5,000+ Dengue Rapid Diagnostic Tests Completed across Patna Wards", body: "Our mobile medical teams have conducted diagnostic screenings across 16 low-lying slum wards in Patna and Danapur. Over 6,000 long-lasting insecticidal bed nets have now been delivered directly to flood-affected families. Fogging operations continue around the clock in coordination with the Municipal Corporation.", date: "2026-08-22 14:30:00" },
      { camp: c2Id, title: "Wayanad Relief Ground Report: 3,600+ Family Survival Kits Delivered to Tea Estate Workers", body: "With the road to Meppadi partially restored by army engineers, our volunteer supply convoys have successfully distributed 25kg dry ration food boxes and clean drinking water to 3,690 displaced families in Chooralmala and Mundakkai. Solar water filtration units are operating at full capacity.", date: "2026-08-24 18:00:00" },
      { camp: c3Id, title: "Highland Emergency: Satellite Calling Stations & Sub-Zero Blanket Air-Drop Completed", body: "Our high-altitude porter teams successfully crossed the landslide zone to deliver 2,500 thermal fleece blankets and emergency dry rations to isolated valley hamlets in North Sikkim. Over 850 family emergency calls were connected via our satellite terminal.", date: "2026-08-29 11:15:00" },
      { camp: c4Id, title: "Chennai Floods: 15 Rescue Boats Active; Mega-Kitchen Serves 150,000+ Hot Meals to Date", body: "Our relief kitchen at Tambaram has reached a milestone of 150,000 nutritious meals served to flood evacuees. Submersible pumps deployed by our team have de-watered two local maternity clinics. Clean drinking water and dignity kits are currently reaching coastal fisherfolk in Pulicat.", date: "2026-08-20 09:45:00" }
    ];

    for (const upd of updatesList) {
      await client.query(`
        INSERT INTO updates (campaign_id, title, body, date)
        VALUES ($1, $2, $3, $4)
      `, [upd.camp, upd.title, upd.body, upd.date]);
    }

    // 11. Inject Published Impact Reports
    console.log('📊 Generating published comprehensive impact reports...');
    const impactReports = [
      { camp: c1Id, title: "Patna Dengue & Vector Epidemic Phase-1 Relief Summary", period: "Aug 10, 2026 – Present" },
      { camp: c2Id, title: "Wayanad Landslide Rapid Search, Rescue & Ration Deployment Audit", period: "Aug 15, 2026 – Present" },
      { camp: c3Id, title: "Himalayan Cut-Off Highway Emergency Porter Logistics Report", period: "Aug 20, 2026 – Present" },
      { camp: c4Id, title: "Tamil Nadu Monsoon Flood Relief & Hot Kitchen Comprehensive Impact Audit", period: "Aug 05, 2026 – Present" }
    ];

    for (const ir of impactReports) {
      await client.query(`
        INSERT INTO impact_reports (campaign_id, title, period, status, published_on)
        VALUES ($1, $2, $3, 'published', CURRENT_TIMESTAMP)
      `, [ir.camp, ir.title, ir.period]);
    }

    // 12. Inject Resources
    console.log('📦 Registering physical relief resource inventory...');
    const resourcesList = [
      { camp: c1Id, name: "Long-Lasting Insecticidal Mosquito Nets (LLINs)", source: "State Health Dept & Donors", alloc: 6500, dep: 6000, unit: "Nets" },
      { camp: c1Id, name: "Rapid Dengue NS1/IgM Test Kits", source: "MedPlus Healthcare Partner", alloc: 8000, dep: 7450, unit: "Kits" },
      { camp: c2Id, name: "Inflatable Motorized Rescue Boats (40HP)", source: "CSR Emergency Fleet", alloc: 6, dep: 6, unit: "Boats" },
      { camp: c2Id, name: "25kg Comprehensive Family Ration Boxes", source: "Kerala Agro Mill Co-op", alloc: 4200, dep: 3690, unit: "Boxes" },
      { camp: c2Id, name: "Mobile Solar RO Water Plants (1,500 LPH)", source: "Eureka Forbes CSR", alloc: 4, dep: 3, unit: "Plants" },
      { camp: c3Id, name: "Sub-Zero Thermal Fleece Blankets", source: "Highland Donors & Trust", alloc: 2800, dep: 2500, unit: "Blankets" },
      { camp: c4Id, name: "Motorized Cyclone Evacuation Dinghies", source: "Chennai Fisherfolk Guild", alloc: 15, dep: 15, unit: "Boats" },
      { camp: c4Id, name: "Chlorine Water Disinfection Tablets", source: "Municipal Health Store", alloc: 50000, dep: 45000, unit: "Tablets" }
    ];

    for (const r of resourcesList) {
      await client.query(`
        INSERT INTO resources (campaign_id, name, source, allocated, deployed, unit)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [r.camp, r.name, r.source, r.alloc, r.dep, r.unit]);
    }

    // 13. Inject Community Workshops by Udaan
    console.log('🎓 Creating interactive community workshops...');
    const workshopsList = [
      {
        title: "Disaster First-Aid, CPR & Emergency Triage Training",
        desc: "Hands-on medical triage, tourniquet application, CPR, and dehydration prevention protocols for frontline community volunteers.",
        date: "2026-09-18",
        time: "10:00 AM - 3:30 PM",
        loc: "Patna Medical College Conference Hall",
        city: "Patna",
        cap: 75,
        reg: 68,
        form: "https://forms.google.com/d/e/1FAIpQLScUdaanMedical2026/viewform"
      },
      {
        title: "Flood Evacuation, Water Rescue & Boat Navigation Masterclass",
        desc: "Certified water rescue techniques, life-jacket safety, inflatable boat maintenance, and river flood evacuation drills.",
        date: "2026-09-22",
        time: "09:00 AM - 2:00 PM",
        loc: "Tambaram Disaster Preparedness Ground",
        city: "Chennai",
        cap: 60,
        reg: 54,
        form: "https://forms.google.com/d/e/1FAIpQLSdUdaanBoatRescue2026/viewform"
      },
      {
        title: "Epidemic Prevention, Water Sanitation & Vector Control Workshop",
        desc: "Community guidelines on clean water chlorination, thermal fogging handling, mosquito breeding eradication, and disease tracing.",
        date: "2026-09-26",
        time: "11:00 AM - 3:00 PM",
        loc: "Hajipur Municipal Community Center",
        city: "Hajipur",
        cap: 50,
        reg: 47,
        form: "https://forms.google.com/d/e/1FAIpQLSeUdaanSanitation2026/viewform"
      },
      {
        title: "Mountain Landslide Preparedness & Cold Weather Survival Camp",
        desc: "High-altitude survival gear management, satellite communicator usage, landslide early warning signs, and emergency shelter construction.",
        date: "2026-10-02",
        time: "10:30 AM - 4:00 PM",
        loc: "Kalpetta Relief Hub & Training Ground",
        city: "Wayanad",
        cap: 50,
        reg: 38,
        form: "https://forms.google.com/d/e/1FAIpQLSfUdaanMountainPrep2026/viewform"
      }
    ];

    for (const ws of workshopsList) {
      await client.query(`
        INSERT INTO workshops (ngo_id, title, description, date, time, location, city, target_capacity, registered_count, form_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [udaanId, ws.title, ws.desc, ws.date, ws.time, ws.loc, ws.city, ws.cap, ws.reg, ws.form]);
    }

    // 14. Inject Community Feedback & Testimonials
    console.log('💬 Recording community feedback and verified reviews...');
    const feedbackList = [
      { camp: c1Id, name: "Dr. Rajeshwar Prasad (Civil Surgeon, Danapur)", source: "Local Health Authority", comment: "Udaan's mobile testing clinics arrived within 24 hours of the waterlogging. Their rapid NS1 testing prevented critical delays in platelet transfusions for over 300 slum residents.", dims: { speed: 5, transparency: 5, impact: 5 } },
      { camp: c2Id, name: "K. Radhakrishnan (Panchayat Member, Meppadi)", source: "Community Panchayat Leader", comment: "When the Chooralmala bridge was washed away, Udaan's motorized boats were among the first to bring life-saving food, baby nutrition, and clean water to our stranded families.", dims: { speed: 5, transparency: 5, impact: 5 } },
      { camp: c4Id, name: "Selvi Murugan (Velachery Resident)", source: "Beneficiary Household", comment: "Our ground floor house was fully submerged. Udaan volunteers reached us on inflatable boats with hot meals and dignity kits. Their transparency and care gave us hope.", dims: { speed: 5, transparency: 5, impact: 5 } },
      { camp: c3Id, name: "Tenzing Norbu (Local Mountain Guide)", source: "Field Volunteer", comment: "The high-altitude porter distribution was executed with extreme discipline. Every blanket and ration pack was logged and accounted for with local village heads.", dims: { speed: 5, transparency: 5, impact: 5 } }
    ];

    for (const fb of feedbackList) {
      await client.query(`
        INSERT INTO feedback (campaign_id, name, source, comment, dimensions, date)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      `, [fb.camp, fb.name, fb.source, fb.comment, JSON.stringify(fb.dims)]);
    }

    // 15. Inject Audit Logs
    console.log('🔒 Writing complete audit trail log for NGO transparency...');
    const auditLogs = [
      { camp: c1Id, actor: "Utkarsh Choudhary (Director)", action: "Campaign Initialized & Verified", detail: "Campaign verified and launched with target of 6,500 flood-displaced households." },
      { camp: c1Id, actor: "Govt. Darpan Portal", action: "Compliance Verification Passed", detail: "FCRA, 80G tax status, and public donor routing verified active." },
      { camp: c1Id, actor: "Dr. Aarav Nambiar (Medical Lead)", action: "Expense Verified & Invoice Linked", detail: "Verified GST invoice #MED-2026-8942 for 6,000 Rapid Dengue Diagnostic Kits (₹2,45,000)." },
      { camp: c2Id, actor: "Meera Sengupta (Logistics Lead)", action: "Emergency Fleet Deployed", detail: "4 Motorized Inflatable Rescue Crafts deployed with 40HP engines in Chooralmala." },
      { camp: c2Id, actor: "Kerala State Disaster Authority", action: "Field Challan Signed", detail: "Handover of 15 Metric Tons rice and grain supplies at Meppadi Relief Camp verified." },
      { camp: c4Id, actor: "Vikram Rathore (Operations Commander)", action: "Mega-Kitchen Operational", detail: "Annapurna Kitchen hub active; 12,000 daily meals dispatch verified with Municipal Health Inspectors." }
    ];

    for (const al of auditLogs) {
      await client.query(`
        INSERT INTO audit_logs (campaign_id, actor, action, detail, ts)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      `, [al.camp, al.actor, al.action, al.detail]);
    }

    await client.query('COMMIT');
    console.log('✅ Mock data injection for Udaan completed successfully!');
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error injecting mock data:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

injectUdaanMockData();
