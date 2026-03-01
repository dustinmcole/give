const fs = require('fs');
const file = 'packages/db/prisma/schema.prisma';
let content = fs.readFileSync(file, 'utf8');

const newModels = `
model SalesforceConnection {
  id                String   @id @default(cuid())
  orgId             String   @unique
  org               Organization @relation(fields: [orgId], references: [id])
  salesforceOrgId   String   @unique  // The SF org's 18-char ID
  instanceUrl       String             // e.g., https://na1.salesforce.com
  accessToken       String             // Encrypted in production
  refreshToken      String             // Encrypted in production
  dataModel         String             // "NPSP" or "NPC"
  isActive          Boolean  @default(true)
  lastSyncAt        DateTime?
  connectedAt       DateTime @default(now())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model SyncLog {
  id              String   @id @default(cuid())
  orgId           String
  org             Organization @relation(fields: [orgId], references: [id])
  objectType      String   // "donor", "donation", "campaign", "recurring_donation"
  giveRecordId    String   // ID of the record in Give
  sfRecordId      String?  // ID of the record in Salesforce (null if failed)
  direction       String   // "outbound" (Give→SF) or "inbound" (SF→Give)
  status          String   // "success", "failed", "pending"
  errorMessage    String?
  syncedAt        DateTime @default(now())

  @@index([orgId, syncedAt])
  @@index([giveRecordId])
}
`;

if (!content.includes('SalesforceConnection')) {
  content = content.replace(
    '  donors     Donor[]',
    '  donors     Donor[]\n\n  salesforceConnection  SalesforceConnection?\n  syncLogs              SyncLog[]'
  );
  content += '\n' + newModels;
  fs.writeFileSync(file, content);
}
