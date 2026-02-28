import { prisma } from '@give/db';
import { SalesforceApi } from './salesforce-api';

async function getSfApi(orgId: string) {
  const connection = await prisma.salesforceConnection.findUnique({
    where: { orgId }
  });

  if (!connection || !connection.isActive) return null;

  return {
    api: new SalesforceApi(connection.instanceUrl, connection.accessToken, connection.id),
    connection
  };
}

async function logSync(data: { orgId: string, objectType: string, giveRecordId: string, sfRecordId?: string, direction: string, status: string, errorMessage?: string }) {
  await prisma.syncLog.create({ data });
}

export async function syncDonorToSalesforce(donorId: string, orgId: string) {
  try {
    const sf = await getSfApi(orgId);
    if (!sf) return;

    const donor = await prisma.donor.findUnique({ where: { id: donorId } });
    if (!donor) return;

    const data = {
      FirstName: donor.firstName,
      LastName: donor.lastName,
      Email: donor.email,
      Phone: donor.phone,
      Give_Donor_Id__c: donor.id
    };

    let sfRecordId = null;

    if (sf.connection.dataModel === 'NPSP') {
      const res = await sf.api.upsert('Contact', 'Give_Donor_Id__c', donor.id, data);
      sfRecordId = res?.id || null; // Upsert response format depends on creation vs update
    } else {
      // NPC
      const npcData = { ...data, RecordTypeId: 'PersonAccount' }; // simplified for MVP
      const res = await sf.api.upsert('Account', 'Give_Donor_Id__c', donor.id, npcData);
      sfRecordId = res?.id || null;
    }

    await logSync({
      orgId,
      objectType: 'donor',
      giveRecordId: donor.id,
      sfRecordId,
      direction: 'outbound',
      status: 'success'
    });
  } catch (error: any) {
    await logSync({
      orgId,
      objectType: 'donor',
      giveRecordId: donorId,
      direction: 'outbound',
      status: 'failed',
      errorMessage: error.message
    });
  }
}

export async function syncDonationToSalesforce(donationId: string, orgId: string) {
  try {
    const sf = await getSfApi(orgId);
    if (!sf) return;

    const donation = await prisma.donation.findUnique({ 
      where: { id: donationId },
      include: { donor: true, campaign: true }
    });
    if (!donation) return;

    const data = {
      Name: `Donation from ${donation.donor.firstName} ${donation.donor.lastName}`,
      Amount: donation.amountCents / 100,
      CloseDate: donation.createdAt.toISOString().split('T')[0],
      StageName: 'Closed Won',
      Give_Donation_Id__c: donation.id,
      Give_Campaign_Id__c: donation.campaignId
    };

    let sfRecordId = null;

    if (sf.connection.dataModel === 'NPSP') {
      const res = await sf.api.upsert('Opportunity', 'Give_Donation_Id__c', donation.id, data);
      sfRecordId = res?.id || null;
    } else {
      // NPC Gift Transaction
      const npcData = {
        Amount: donation.amountCents / 100,
        TransactionDate: donation.createdAt,
        Status: 'Completed',
        Give_Donation_Id__c: donation.id
      };
      const res = await sf.api.upsert('GiftTransaction', 'Give_Donation_Id__c', donation.id, npcData);
      sfRecordId = res?.id || null;
    }

    await logSync({
      orgId,
      objectType: 'donation',
      giveRecordId: donation.id,
      sfRecordId,
      direction: 'outbound',
      status: 'success'
    });
  } catch (error: any) {
    await logSync({
      orgId,
      objectType: 'donation',
      giveRecordId: donationId,
      direction: 'outbound',
      status: 'failed',
      errorMessage: error.message
    });
  }
}

export async function syncCampaignToSalesforce(campaignId: string, orgId: string) {
  try {
    const sf = await getSfApi(orgId);
    if (!sf) return;

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return;

    const data = {
      Name: campaign.title,
      Description: campaign.description,
      IsActive: campaign.status === 'ACTIVE',
      Give_Campaign_Id__c: campaign.id
    };

    const res = await sf.api.upsert('Campaign', 'Give_Campaign_Id__c', campaign.id, data);
    
    await logSync({
      orgId,
      objectType: 'campaign',
      giveRecordId: campaign.id,
      sfRecordId: res?.id || null,
      direction: 'outbound',
      status: 'success'
    });
  } catch (error: any) {
    await logSync({
      orgId,
      objectType: 'campaign',
      giveRecordId: campaignId,
      direction: 'outbound',
      status: 'failed',
      errorMessage: error.message
    });
  }
}
