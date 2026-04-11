#!/usr/bin/env node

/**
 * Script to create webhook API keys for external integrations
 *
 * Usage:
 *   npx ts-node scripts/create-webhook-api-key.ts <name> [--readonly] [--expiry-days N]
 *
 * Example:
 *   npx ts-node scripts/create-webhook-api-key.ts "Shopify Integration"
 *   npx ts-node scripts/create-webhook-api-key.ts "Zapier Enrollment" --expiry-days 365
 */

import crypto from 'crypto';
import { db } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Generate a new API key with SHA-256 hashing
 */
function generateApiKey() {
  const key = crypto.randomBytes(32).toString('hex');
  const prefix = key.substring(0, 8);
  const hash = crypto.createHash('sha256').update(key).digest('hex');

  return {
    key: `sk_${key}`,
    prefix,
    hash,
  };
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: API key name is required');
    console.error('Usage: npx ts-node scripts/create-webhook-api-key.ts <name> [--readonly] [--expiry-days N]');
    process.exit(1);
  }

  const name = args[0];
  const readonly = args.includes('--readonly');

  let expiryDays = 0; // 0 = no expiry
  const expiryIndex = args.indexOf('--expiry-days');
  if (expiryIndex !== -1 && args[expiryIndex + 1]) {
    expiryDays = parseInt(args[expiryIndex + 1], 10);
  }

  return { name, readonly, expiryDays };
}

/**
 * Main execution
 */
async function main() {
  try {
    const { name, readonly, expiryDays } = parseArgs();

    console.log('Generating API key...');
    const { key, prefix, hash } = generateApiKey();

    // Calculate expiry date if specified
    let expiresAt: Date | null = null;
    if (expiryDays > 0) {
      expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    }

    console.log('Storing API key in database...');
    const docRef = await db.collection('lmsApiKeys').add({
      name,
      keyHash: hash,
      prefix,
      permissions: readonly ? ['enrollment:read'] : ['enrollment:create'],
      isActive: true,
      expiresAt: expiryDays > 0 ? Timestamp.fromDate(expiresAt!) : null,
      createdBy: 'system', // In production, get from auth context
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const apiKeyId = docRef.id;

    console.log('\n✓ API Key Created Successfully!\n');
    console.log('Details:');
    console.log(`  Name:        ${name}`);
    console.log(`  ID:          ${apiKeyId}`);
    console.log(`  Prefix:      ${prefix}`);
    console.log(`  Permissions: ${(readonly ? ['enrollment:read'] : ['enrollment:create']).join(', ')}`);
    console.log(`  Active:      true`);
    if (expiresAt) {
      console.log(`  Expires:     ${expiresAt.toISOString()}`);
    } else {
      console.log(`  Expires:     Never`);
    }

    console.log('\n⚠️  IMPORTANT: Save this key securely. You will not be able to view it again!\n');
    console.log('API Key (use this to authenticate):\n');
    console.log(`  ${key}\n`);
    console.log('Usage:\n');
    console.log(`  curl -X POST https://yourdomain.com/api/webhooks/enrollment \\`);
    console.log(`    -H "Authorization: Bearer ${key}" \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"email":"user@example.com",...}'`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error creating API key:', error);
    process.exit(1);
  }
}

main();
