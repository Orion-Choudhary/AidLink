-- Migration: 002_volunteer_reviews.sql
-- Description: Create volunteer_reviews table, indexes, and seed realistic evaluations

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
CREATE INDEX IF NOT EXISTS idx_vol_rev_volunteer ON volunteer_reviews(volunteer_id);

-- Seed initial reviews for all existing volunteers if table is empty
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM volunteer_reviews) = 0 THEN
    -- Insert Positive Reviews
    INSERT INTO volunteer_reviews (volunteer_id, supporter_id, campaign_id, reviewer_name, reviewer_role, sentiment, rating, headline, comment, date)
    SELECT 
      v.id,
      v.supporter_id,
      v.campaign_id,
      CASE (v.id % 6)
        WHEN 0 THEN 'Dr. Aris Thorne'
        WHEN 1 THEN 'Capt. Rakesh Singhal'
        WHEN 2 THEN 'Sunita Deshmukh'
        WHEN 3 THEN 'M. Ramanathan'
        WHEN 4 THEN 'Pooja Nair'
        ELSE 'Gurmukh Singh'
      END,
      CASE 
        WHEN v.role LIKE '%Medical%' OR v.role LIKE '%First Aid%' THEN 'Field Medical Lead'
        WHEN v.role LIKE '%Boat%' OR v.role LIKE '%Evacuation%' THEN 'Disaster Response Coordinator'
        WHEN v.role LIKE '%Kitchen%' OR v.role LIKE '%Food%' THEN 'Relief Camp Camp-Boss'
        WHEN v.role LIKE '%Supply%' OR v.role LIKE '%Ration%' THEN 'Logistics Operations Officer'
        WHEN v.role LIKE '%Shelter%' THEN 'Shelter Construction Foreman'
        ELSE 'Community Liaison Lead'
      END,
      'positive',
      4.9,
      CASE 
        WHEN v.role LIKE '%Medical%' OR v.role LIKE '%First Aid%' THEN 'Critical triage and compassionate stabilization care'
        WHEN v.role LIKE '%Boat%' OR v.role LIKE '%Evacuation%' THEN 'Heroic evacuation during torrential surges'
        WHEN v.role LIKE '%Kitchen%' OR v.role LIKE '%Food%' THEN 'Flawless hygiene protocols feeding evacuees daily'
        WHEN v.role LIKE '%Supply%' OR v.role LIKE '%Ration%' THEN 'Meticulous inventory accounting in high-pressure hub'
        WHEN v.role LIKE '%Shelter%' THEN 'Relentless physical endurance securing emergency shelters'
        ELSE 'Exemplary dedication, leadership, and operational commitment'
      END,
      CASE 
        WHEN v.role LIKE '%Medical%' OR v.role LIKE '%First Aid%' THEN 'Administered vital wound dressings and rapid fever screenings in high-humidity camp conditions. Maintained clinical composure throughout.'
        WHEN v.role LIKE '%Boat%' OR v.role LIKE '%Evacuation%' THEN 'Operated rescue crafts in hazardous conditions to extract stranded elderly residents with exceptional composure and dedication.'
        WHEN v.role LIKE '%Kitchen%' OR v.role LIKE '%Food%' THEN 'Orchestrated hot meal packaging from 4:30 AM every morning with strict adherence to potable water safety and dietary distribution.'
        WHEN v.role LIKE '%Supply%' OR v.role LIKE '%Ration%' THEN 'Tracked every family ration kit down to the last kilogram. Prevented multiple distribution bottlenecks through proactive stock reconciliations.'
        WHEN v.role LIKE '%Shelter%' THEN 'Constructed weather-proof dwellings for displaced households in freezing rain while maintaining stellar team morale.'
        ELSE 'Coordinated on-ground logistics with speed, empathy, and absolute operational accountability.'
      END,
      NOW() - (v.id * INTERVAL '18 hours')
    FROM volunteers v;

    -- Insert Constructive Reviews (ensuring balanced accountability)
    INSERT INTO volunteer_reviews (volunteer_id, supporter_id, campaign_id, reviewer_name, reviewer_role, sentiment, rating, headline, comment, date)
    SELECT 
      v.id,
      v.supporter_id,
      v.campaign_id,
      CASE (v.id % 6)
        WHEN 0 THEN 'Anand Kulkarni'
        WHEN 1 THEN 'Kavita Subramanian'
        WHEN 2 THEN 'Inspector D. K. Roy'
        WHEN 3 THEN 'Bikash Mahapatra'
        WHEN 4 THEN 'Meera Varma'
        ELSE 'Sister Teresa George'
      END,
      'Field Operations Supervisor',
      'constructive',
      3.8,
      'Operational excellence; shift change handover reporting needs minor improvement',
      'Consistently energetic and reliable on ground. In high-tempo handovers, ensure supply checklist log is fully digitized before departure to avoid communication gaps with incoming shift.',
      NOW() - (v.id * INTERVAL '36 hours')
    FROM volunteers v;
  END IF;
END $$;
