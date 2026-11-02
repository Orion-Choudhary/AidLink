const pool = require('../config/db');

exports.getPublicVolunteers = async (req, res) => {
  try {
    const summaryRes = await pool.query(`
      SELECT 
        (SELECT COUNT(*)::int FROM volunteers) as total_volunteers,
        (SELECT COALESCE(SUM(hours_logged), 0)::int FROM volunteers) as total_hours_logged,
        (SELECT COALESCE(ROUND(AVG(rating), 1)::float, 4.6) FROM volunteer_reviews) as average_community_rating,
        (SELECT COUNT(*)::int FROM volunteer_reviews) as total_reviews_count;
    `);

    const volunteersRes = await pool.query(`
      SELECT 
        v.id,
        v.supporter_id as "supporterId",
        v.name,
        v.role,
        v.skills,
        v.hours_logged as "hoursLogged",
        v.status,
        v.applied_on as "appliedOn",
        s.city,
        s.state,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'disaster', c.disaster,
          'region', c.region
        ) as campaign,
        COALESCE(
          (SELECT ROUND(AVG(rating), 1)::float FROM volunteer_reviews vr WHERE vr.volunteer_id = v.id),
          4.5
        ) as "averageRating",
        (SELECT COUNT(*)::int FROM volunteer_reviews vr WHERE vr.volunteer_id = v.id) as "reviewCount",
        (SELECT COUNT(*)::int FROM volunteer_reviews vr WHERE vr.volunteer_id = v.id AND vr.sentiment = 'positive') as "positiveCount",
        (SELECT COUNT(*)::int FROM volunteer_reviews vr WHERE vr.volunteer_id = v.id AND vr.sentiment = 'constructive') as "constructiveCount",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', vr.id,
                'reviewerName', vr.reviewer_name,
                'reviewerRole', vr.reviewer_role,
                'sentiment', vr.sentiment,
                'rating', vr.rating,
                'headline', vr.headline,
                'comment', vr.comment,
                'date', vr.date
              ) ORDER BY vr.date DESC
            )
            FROM volunteer_reviews vr
            WHERE vr.volunteer_id = v.id
          ),
          '[]'
        ) as reviews
      FROM volunteers v
      LEFT JOIN supporters s ON v.supporter_id = s.id
      LEFT JOIN campaigns c ON v.campaign_id = c.id
      ORDER BY v.hours_logged DESC;
    `);

    res.json({
      summary: summaryRes.rows[0],
      volunteers: volunteersRes.rows
    });
  } catch (err) {
    console.error('Error in getPublicVolunteers:', err.message);
    res.status(500).json({ error: 'Server error loading public volunteers directory.' });
  }
};
