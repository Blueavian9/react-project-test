// src/infra/drizzle.service.ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../domain/schema';
import CryptoJS from 'crypto-js';

export class DrizzleService {
  private db;

  constructor(env: { DB: D1Database; ENCRYPTION_KEY: string }) {
    this.db = drizzle(env.DB, { schema });
  }

  private encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), env.ENCRYPTION_KEY).toString();
  }

  private decrypt(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, env.ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  async getPractitioners() {
    return this.db.select().from(schema.practitioners).all();
  }

  // Example: insert encrypted booking
  async insertBooking(practitionerId: number, clientData: object) {
    const encryptedClientInfo = this.encrypt(clientData);
    return this.db.insert(schema.bookings).values({
      practitionerId,
      clientInfo: encryptedClientInfo,
      status: 'pending',
    }).returning();
  }
}