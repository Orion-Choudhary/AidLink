const pool = require('../config/db');

async function migrate() {
  try {
    console.log('Running migration: create volunteer_reviews table and seed data...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS volunteer_reviews (
        id SERIAL PRIMARY KEY,
        volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
        supporter_id INTEGER REFERENCES supporters(id) ON DELETE CASCADE,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
        reviewer_name VARCHAR(255) NOT NULL,
        reviewer_role VARCHAR(100) NOT NULL,
        sentiment VARCHAR(20) NOT NULL, -- 'positive' | 'constructive'
        rating NUMERIC(2,1) NOT NULL,
        headline VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_vol_rev_supporter ON volunteer_reviews(supporter_id);
    `);

    // Check if reviews already exist
    const countRes = await pool.query('SELECT COUNT(*) FROM volunteer_reviews');
    if (parseInt(countRes.rows[0].count, 10) > 0) {
      console.log(`volunteer_reviews already has ${countRes.rows[0].count} records. Skipping seed.`);
      process.exit(0);
    }

    // Fetch all volunteers with campaign details
    const vols = await pool.query(`
      SELECT v.id as volunteer_id, v.supporter_id, v.campaign_id, v.name, v.role, v.hours_logged,
             c.name as campaign_name, c.region
      FROM volunteers v
      LEFT JOIN campaigns c ON v.campaign_id = c.id
      ORDER BY v.id;
    `);

    console.log(`Seeding reviews for ${vols.rows.length} volunteers...`);

    const positiveReviewTemplates = [
      {
        roles: ['Search, Evacuation & Boat Operator'],
        headline: 'Heroic night evacuation during torrential water surges',
        comment: 'Operated inflatable rescue crafts in zero-visibility conditions to extract 14 stranded elderly residents. Displayed exceptional watermanship, calmness under extreme duress, and unwavering dedication to civilian safety.',
        reviewerRole: 'Disaster Response Coordinator',
        rating: 5.0
      },
      {
        roles: ['First Aid & Medical Field Responder'],
        headline: 'Critical triage and compassionate stabilization care',
        comment: 'Administered over 45 wound dressings and rapid dengue screenings in high-humidity camp conditions. Maintained clinical composure and ensured every fever patient received oral rehydration and immediate doctor follow-up.',
        reviewerRole: 'Field Medical Lead',
        rating: 4.9
      },
      {
        roles: ['Community Kitchen & Food Nutrition Lead'],
        headline: 'Flawless hygiene protocols feeding 1,200+ evacuees daily',
        comment: 'Orchestrated hot meal packaging from 4:30 AM every morning with strict adherence to potable water safety and dietary distribution. Not a single batch spoiled despite severe regional power disruptions.',
        reviewerRole: 'Relief Camp Camp-Boss',
        rating: 4.8
      },
      {
        roles: ['Emergency Supply Chain & Ration Dispatcher'],
        headline: 'Meticulous inventory accounting in high-pressure hub',
        comment: 'Tracked every family ration kit down to the last kilogram of pulses and clean water jerrycan. Prevented multiple distribution bottlenecks through proactive stock reconciliations.',
        reviewerRole: 'Logistics Operations Officer',
        rating: 4.9
      },
      {
        roles: ['Temporary Shelter Construction & Debris Clearance'],
        headline: 'Relentless physical endurance securing emergency shelters',
        comment: 'Constructed weather-proof bamboo and tarpaulin dwellings for 28 displaced households in freezing high-altitude rain. Maintained high team morale throughout the grueling 12-hour shifts.',
        reviewerRole: 'Shelter Construction Foreman',
        rating: 5.0
      },
      {
        roles: ['Vector Control & Anti-Larval Fogging Operator'],
        headline: 'Systematic perimeter sterilization preventing disease outbreaks',
        comment: 'Conducted rigorous ultra-low-volume thermal fogging across 8 water-logged wards. Documented all larval breeding sites and ensured zero chemical exposure accidents among local children.',
        reviewerRole: 'Municipal Health Inspector',
        rating: 4.8
      }
    ];

    const constructiveReviewTemplates = [
      {
        roles: ['Search, Evacuation & Boat Operator'],
        headline: 'Needs stricter adherence to secondary life jacket checks',
        comment: 'Outstanding boat handling, but on one early dawn deployment, departed without confirming secondary tether clips on all evacuees. Corrected immediately when flagged, but safety protocol discipline must remain absolute.',
        reviewerRole: 'Safety & Compliance Officer',
        rating: 3.5
      },
      {
        roles: ['First Aid & Medical Field Responder'],
        headline: 'Punctuality delayed on shift changeover; excellent patient empathy',
        comment: 'Superb bedside empathy and trauma dressing skills, though arrived 35 minutes late to the night rotation due to uncoordinated local transport. Need better advance notification if commuting across flooded routes.',
        reviewerRole: 'Field Operations Supervisor',
        rating: 3.7
      },
      {
        roles: ['Community Kitchen & Food Nutrition Lead'],
        headline: 'Needs more delegation to prevent personal exhaustion',
        comment: 'Incredible work ethic, but insisted on personally inspecting every single ration crate rather than delegating to junior volunteers, which led to visible fatigue on day 4 of the emergency.',
        reviewerRole: 'Camp Health Officer',
        rating: 3.8
      },
      {
        roles: ['Emergency Supply Chain & Ration Dispatcher'],
        headline: 'Digital dispatch log was updated with delays during peak rush',
        comment: 'Physical ration allocation was flawless and honest, but the digital dispatch log was kept on paper until midnight, creating a 4-hour blindspot for HQ monitoring. Digital log synchronization needs prioritization.',
        reviewerRole: 'Data Accountability Lead',
        rating: 3.6
      },
      {
        roles: ['Temporary Shelter Construction & Debris Clearance'],
        headline: 'Occasional lapse in mandatory safety helmet wear during debris lifts',
        comment: 'Tremendous strength and heavy lifting work rate, but had to be reminded twice to keep hard hats buckled while operating near unstable brick masonry.',
        reviewerRole: 'Field Safety Officer',
        rating: 3.5
      },
      {
        roles: ['Vector Control & Anti-Larval Fogging Operator'],
        headline: 'Pacing was too fast in narrow residential alleyways',
        comment: 'Very thorough overall, but operated thermal fogger too rapidly through 2 densely populated alleyways without giving residents adequate 5-minute warning windows to close their windows.',
        reviewerRole: 'Community Liaison Lead',
        rating: 3.7
      }
    ];

    const reviewerNames = [
      'Dr. Aris Thorne', 'Capt. Rakesh Singhal', 'Sunita Deshmukh', 'M. Ramanathan',
      'Pooja Nair', 'Gurmukh Singh', 'Anand Kulkarni', 'Kavita Subramanian',
      'Inspector D. K. Roy', 'Bikash Mahapatra', 'Meera Varma', 'Sister Teresa George'
    ];

    let insertedCount = 0;

    for (let i = 0; i < vols.rows.length; i++) {
      const v = vols.rows[i];
      const volRole = v.role || 'Search, Evacuation & Boat Operator';

      // 1. Positive Review
      const posTemplate = positiveReviewTemplates.find(t => t.roles.includes(volRole)) || positiveReviewTemplates[0];
      const posReviewer = reviewerNames[(i * 2) % reviewerNames.length];
      const posDate = new Date(Date.now() - (i * 3600 * 1000 * 18));

      await pool.query(`
        INSERT INTO volunteer_reviews 
        (volunteer_id, supporter_id, campaign_id, reviewer_name, reviewer_role, sentiment, rating, headline, comment, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        v.volunteer_id, v.supporter_id, v.campaign_id,
        posReviewer, posTemplate.reviewerRole, 'positive',
        posTemplate.rating, posTemplate.headline, posTemplate.comment, posDate
      ]);
      insertedCount++;

      // 2. Constructive Review (for volunteers to show transparency and real accountability)
      const conTemplate = constructiveReviewTemplates.find(t => t.roles.includes(volRole)) || constructiveReviewTemplates[0];
      const conReviewer = reviewerNames[(i * 2 + 1) % reviewerNames.length];
      const conDate = new Date(Date.now() - (i * 3600 * 1000 * 36));

      await pool.query(`
        INSERT INTO volunteer_reviews 
        (volunteer_id, supporter_id, campaign_id, reviewer_name, reviewer_role, sentiment, rating, headline, comment, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        v.volunteer_id, v.supporter_id, v.campaign_id,
        conReviewer, conTemplate.reviewerRole, 'constructive',
        conTemplate.rating, conTemplate.headline, conTemplate.comment, conDate
      ]);
      insertedCount++;
    }

    console.log(`Migration completed successfully! Inserted ${insertedCount} balanced volunteer reviews across ${vols.rows.length} volunteers.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();

