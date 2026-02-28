import { prisma } from '@give/db';

export class SalesforceApi {
  constructor(
    private instanceUrl: string,
    private accessToken: string,
    private connectionId: string
  ) {}

  private async request(method: string, path: string, body?: any) {
    const url = `${this.instanceUrl}/services/data/v62.0${path}`;
    let res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (res.status === 401) {
      await this.refreshToken();
      res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });
    }

    if (!res.ok && res.status !== 204) {
      const error = await res.text();
      throw new Error(`Salesforce API Error: ${res.status} ${error}`);
    }

    if (res.status === 204) return null;
    return res.json();
  }

  private async refreshToken() {
    const connection = await prisma.salesforceConnection.findUnique({
      where: { id: this.connectionId }
    });

    if (!connection || !connection.refreshToken) {
      throw new Error('No refresh token available');
    }

    const clientId = process.env.SALESFORCE_CLIENT_ID!;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET!;

    const tokenRes = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: connection.refreshToken,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      await prisma.salesforceConnection.update({
        where: { id: this.connectionId },
        data: { isActive: false }
      });
      throw new Error(`Refresh token failed: ${tokenData.error_description}`);
    }

    this.accessToken = tokenData.access_token;
    await prisma.salesforceConnection.update({
      where: { id: this.connectionId },
      data: { accessToken: tokenData.access_token }
    });
  }

  async query(soql: string) {
    return this.request('GET', `/query/?q=${encodeURIComponent(soql)}`);
  }

  async create(sobject: string, data: any) {
    return this.request('POST', `/sobjects/${sobject}`, data);
  }

  async update(sobject: string, id: string, data: any) {
    return this.request('PATCH', `/sobjects/${sobject}/${id}`, data);
  }

  async upsert(sobject: string, externalIdField: string, externalId: string, data: any) {
    return this.request('PATCH', `/sobjects/${sobject}/${externalIdField}/${externalId}`, data);
  }
}
