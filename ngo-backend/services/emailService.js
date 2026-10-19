const { Resend } = require('resend');

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ [Resend] RESEND_API_KEY is not set in environment. Email sending disabled.');
    return null;
  }
  return new Resend(apiKey);
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AidLink Emergency Alert <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Generate a high-urgency, modern responsive HTML template for emergency volunteer alerts.
 */
const generateUrgentAlertTemplate = ({ campaign, volunteerName, ngoName }) => {
  const campaignTitle = campaign.name || 'Emergency Relief Operation';
  const disaster = campaign.disaster || 'Critical Disaster';
  const region = campaign.region || 'Impacted Area';
  const objective = campaign.objective || 'Immediate community assistance and relief deployment needed.';
  const households = campaign.target_households ? Number(campaign.target_households).toLocaleString() : 'N/A';
  const orgName = ngoName || 'AidLink Partner NGO';
  const campaignUrl = `${FRONTEND_URL}/campaigns`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>URGENT: AidLink Emergency Deployment</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- Emergency Banner -->
          <tr>
            <td style="background-color: #dc2626; padding: 18px 24px; text-align: center;">
              <span style="display: inline-block; background-color: #991b1b; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 6px;">
                🚨 High-Priority Emergency
              </span>
              <h1 style="color: #ffffff; margin: 6px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                URGENT VOLUNTEER MOBILIZATION
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <p style="font-size: 15px; line-height: 24px; margin: 0 0 16px 0; color: #334155;">
                Hello <strong>${volunteerName || 'Volunteer'}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 24px; margin: 0 0 24px 0; color: #334155;">
                An urgent emergency campaign has just been published by <strong>${orgName}</strong> on AidLink. Fast ground mobilization is required to deliver critical relief supplies and on-site support to affected families.
              </p>

              <!-- Campaign Card Highlight -->
              <table role="presentation" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; margin-bottom: 24px;" cellspacing="0" cellpadding="16">
                <tr>
                  <td>
                    <h2 style="font-size: 17px; font-weight: 700; color: #991b1b; margin: 0 0 12px 0;">
                      ${campaignTitle}
                    </h2>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" style="font-size: 14px; color: #475569;">
                      <tr>
                        <td width="35%" style="font-weight: 600; color: #64748b;">Disaster Type:</td>
                        <td style="font-weight: 700; color: #b91c1c;">${disaster}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #64748b;">Target Location:</td>
                        <td style="font-weight: 600; color: #0f172a;">${region}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #64748b;">Target Reach:</td>
                        <td style="font-weight: 600; color: #0f172a;">${households} Households</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #64748b;">Organized By:</td>
                        <td style="font-weight: 600; color: #0f172a;">${orgName}</td>
                      </tr>
                    </table>

                    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #fca5a5; font-size: 13px; line-height: 20px; color: #4b5563;">
                      <strong>Objective:</strong> ${objective}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${campaignUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 3px 8px rgba(5, 150, 105, 0.35);">
                      Respond & Mobilize on AidLink →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 20px; color: #64748b; margin: 0 0 10px 0; text-align: center;">
                If you are available to assist with logistics, medical aid, supplies, or on-ground coordination, please access your dashboard immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
              <p style="margin: 0 0 6px 0;">
                You received this high-priority alert because you are registered as a volunteer with <strong>AidLink</strong>.
              </p>
              <p style="margin: 0;">
                AidLink Disaster Response Network • Together for Immediate Relief
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Dispatch urgent campaign notifications to volunteers via Resend.
 * @param {Object} params
 * @param {Object} params.campaign - The campaign data
 * @param {Array} params.volunteers - Array of { id, full_name, email }
 * @param {string} params.ngoName - Name of the NGO publishing the campaign
 */
const sendUrgentCampaignAlert = async ({ campaign, volunteers, ngoName }) => {
  const resend = getResendClient();
  if (!resend) {
    console.warn('⚠️ [Resend] Skipping dispatch: client not initialized.');
    return { success: false, reason: 'missing_api_key' };
  }

  if (!volunteers || volunteers.length === 0) {
    console.log('ℹ️ [Resend] No volunteers found to notify.');
    return { success: true, count: 0, results: [] };
  }

  console.log(`🚀 [Resend] Initiating urgent alert broadcast for campaign "${campaign.name}" to ${volunteers.length} volunteer(s)...`);

  const results = [];

  for (const volunteer of volunteers) {
    const toEmail = volunteer.email?.trim();
    if (!toEmail) continue;

    const htmlContent = generateUrgentAlertTemplate({
      campaign,
      volunteerName: volunteer.full_name,
      ngoName
    });

    try {
      const response = await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: `🚨 [URGENT] AidLink Emergency Alert: ${campaign.name || 'Immediate Relief Needed'} (${campaign.region || 'Emergency'})`,
        html: htmlContent
      });

      if (response.error) {
        console.error(`❌ [Resend] Failed to send to ${toEmail}:`, response.error);
        results.push({ email: toEmail, status: 'error', error: response.error });
      } else {
        console.log(`✅ [Resend] Emergency alert sent successfully to ${toEmail}. Message ID: ${response.data?.id}`);
        results.push({ email: toEmail, status: 'sent', id: response.data?.id });
      }
    } catch (err) {
      console.error(`❌ [Resend] Exception sending to ${toEmail}:`, err.message);
      results.push({ email: toEmail, status: 'failed', error: err.message });
    }
  }

  const successCount = results.filter(r => r.status === 'sent').length;
  console.log(`📊 [Resend] Broadcast completed: ${successCount}/${volunteers.length} successfully delivered.`);

  return {
    success: true,
    total: volunteers.length,
    sent: successCount,
    results
  };
};

module.exports = {
  sendUrgentCampaignAlert,
  generateUrgentAlertTemplate
};
