import { Hono } from 'hono';
import { prisma } from '@give/db';

const salesforce = new Hono();

salesforce.get('/auth/:orgId', async (c) => {
  const orgId = c.req.param('orgId');
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const redirectUri = process.env.SALESFORCE_REDIRECT_URI;
  const state = Buffer.from(orgId).toString('base64');
  
  const authUrl = `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&scope=api refresh_token offline_access`;
  return c.redirect(authUrl);
});

salesforce.get('/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  
  if (!code || !state) {
    return c.text('Missing code or state', 400);
  }
  
  const orgId = Buffer.from(state, 'base64').toString('ascii');
  const clientId = process.env.SALESFORCE_CLIENT_ID!;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET!;
  const redirectUri = process.env.SALESFORCE_REDIRECT_URI!;
  
  const tokenRes = await fetch('https://login.salesforce.com/services/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri
    })
  });
  
  const tokenData = await tokenRes.json();
  if (tokenData.error) {
    return c.json(tokenData, 400);
  }
  
  const userInfoRes = await fetch(tokenData.id, {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
  });
  const userInfo = await userInfoRes.json();
  
  // Create or update connection
  await prisma.salesforceConnection.upsert({
    where: { orgId },
    update: {
      salesforceOrgId: userInfo.organization_id,
      instanceUrl: tokenData.instance_url,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      dataModel: 'NPSP', // defaulting to NPSP for now
      isActive: true,
      connectedAt: new Date()
    },
    create: {
      orgId,
      salesforceOrgId: userInfo.organization_id,
      instanceUrl: tokenData.instance_url,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      dataModel: 'NPSP',
      isActive: true
    }
  });
  
  return c.redirect('/dashboard/settings?sf=connected');
});

salesforce.post('/disconnect/:orgId', async (c) => {
  const orgId = c.req.param('orgId');
  await prisma.salesforceConnection.update({
    where: { orgId },
    data: { isActive: false }
  });
  return c.json({ success: true });
});

salesforce.get('/status/:orgId', async (c) => {
  const orgId = c.req.param('orgId');
  const connection = await prisma.salesforceConnection.findUnique({
    where: { orgId }
  });
  
  if (!connection) {
    return c.json({ connected: false });
  }
  
  return c.json({
    connected: connection.isActive,
    dataModel: connection.dataModel,
    lastSyncAt: connection.lastSyncAt
  });
});

export default salesforce;