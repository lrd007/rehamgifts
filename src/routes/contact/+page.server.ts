import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import os from 'os';

const RESPONSES_DIR = path.join(os.tmpdir(), 'my-app-responses');
const RESPONSES_FILE = path.join(RESPONSES_DIR, 'form-responses.json');

console.log('Form responses will be stored at:', RESPONSES_FILE);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const RATE_LIMIT = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10; // Max requests per hour

async function saveResponse(data: any, ip: string) {
  await mkdir(RESPONSES_DIR, { recursive: true });

  try {
    let responses = [];
    try {
      const fileContent = await readFile(RESPONSES_FILE, 'utf-8');
      responses = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start with an empty array
    }

    if (Buffer.byteLength(JSON.stringify(responses)) > MAX_FILE_SIZE) {
      throw new Error('MAX_STORAGE_REACHED');
    }

    responses.push({
      ...data,
      timestamp: new Date().toISOString(),
      ip: ip
    });

    await writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2), { mode: 0o600 });
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
}

export const actions: Actions = {
  default: async ({ request, getClientAddress }) => {
    const ip = getClientAddress();

    // Rate limiting
    const now = Date.now();
    const userRequests = RATE_LIMIT.get(ip) || 0;
    if (userRequests >= MAX_REQUESTS) {
      return fail(429, { error: 'TOO_MANY_REQUESTS' });
    }
    RATE_LIMIT.set(ip, userRequests + 1);
    setTimeout(() => RATE_LIMIT.set(ip, (RATE_LIMIT.get(ip) || 1) - 1), RATE_LIMIT_WINDOW);

    try {
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;

      // Input validation
      if (!name || !email || !subject || !message) {
        return fail(400, { error: 'MISSING_FIELDS' });
      }
      if (name.length > 100 || email.length > 100 || subject.length > 200 || message.length > 1000) {
        return fail(400, { error: 'INVALID_LENGTH' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return fail(400, { error: 'INVALID_EMAIL' });
      }

      // Sanitization
      const sanitize = (str: string) => str.replace(/[&<>"']/g, (match) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'
      })[match] || '');

      const sanitizedData = {
        name: sanitize(name),
        email,
        subject: sanitize(subject),
        message: sanitize(message)
      };

      await saveResponse(sanitizedData, ip);

      return { success: true };
    } catch (error) {
      console.error('Error processing form submission:', error);
      if (error instanceof Error && error.message === 'MAX_STORAGE_REACHED') {
        return fail(500, { error: 'SERVER_STORAGE_FULL' });
      }
      return fail(500, { error: 'SERVER_ERROR' });
    }
  }
};