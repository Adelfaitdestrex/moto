"use server";

import { Moto, SiteSettings } from "@/types";
import { DEFAULT_SETTINGS, INITIAL_MOTOS } from "./mockData";
import { query, initDatabase } from "./db";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// Assurer l'initialisation de la base
initDatabase();

export async function getMotos(): Promise<Moto[]> {
  try {
    const rows = await query("SELECT * FROM motos ORDER BY createdAt DESC") as any[];
    if (rows.length === 0) {
      console.log("MySQL collection empty, seeding initial motos...");
      for (const item of INITIAL_MOTOS) {
        await query(
          `INSERT INTO motos (id, name, brand, model, year, price, image, category, engine, power, weight, description, status, features, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.id, item.name, item.brand, item.model, item.year, item.price, item.image, item.category, item.engine, item.power, item.weight, item.description, item.status, JSON.stringify(item.features), item.createdAt || Date.now(), item.updatedAt || Date.now()]
        );
      }
      return INITIAL_MOTOS;
    }
    
    return rows.map(row => ({
      ...row,
      features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
    })) as Moto[];
  } catch (error) {
    console.error("MySQL error getting motos:", error);
    return [];
  }
}

export async function getMotoById(id: string): Promise<Moto | null> {
  try {
    const rows = await query("SELECT * FROM motos WHERE id = ?", [id]) as any[];
    if (rows.length > 0) {
      const row = rows[0];
      return {
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
      } as Moto;
    }
    return null;
  } catch (error) {
    console.error("MySQL error getting moto by ID:", error);
    return null;
  }
}

export async function createMoto(
  data: Omit<Moto, "id" | "createdAt" | "updatedAt">
): Promise<Moto> {
  const newId = `moto-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const now = Date.now();
  const newMoto: Moto = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await query(
      `INSERT INTO motos (id, name, brand, model, year, price, image, category, engine, power, weight, description, status, features, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newMoto.id, newMoto.name, newMoto.brand, newMoto.model, newMoto.year, newMoto.price, newMoto.image, newMoto.category, newMoto.engine, newMoto.power, newMoto.weight, newMoto.description, newMoto.status, JSON.stringify(newMoto.features), newMoto.createdAt, newMoto.updatedAt]
    );
  } catch (error) {
    console.error("MySQL error creating moto:", error);
  }
  return newMoto;
}

export async function updateMoto(id: string, updates: Partial<Moto>): Promise<Moto | null> {
  const now = Date.now();
  
  try {
    const currentRows = await query("SELECT * FROM motos WHERE id = ?", [id]) as any[];
    if (currentRows.length === 0) return null;
    
    const currentRow = currentRows[0];
    const currentFeatures = typeof currentRow.features === 'string' ? JSON.parse(currentRow.features) : currentRow.features;
    
    const updatedFeatures = updates.features !== undefined ? updates.features : currentFeatures;
    
    await query(
      `UPDATE motos SET 
        name = COALESCE(?, name),
        brand = COALESCE(?, brand),
        model = COALESCE(?, model),
        year = COALESCE(?, year),
        price = COALESCE(?, price),
        image = COALESCE(?, image),
        category = COALESCE(?, category),
        engine = COALESCE(?, engine),
        power = COALESCE(?, power),
        weight = COALESCE(?, weight),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        features = ?,
        updatedAt = ?
       WHERE id = ?`,
      [
        updates.name ?? null, updates.brand ?? null, updates.model ?? null, updates.year ?? null, 
        updates.price ?? null, updates.image ?? null, updates.category ?? null, updates.engine ?? null, 
        updates.power ?? null, updates.weight ?? null, updates.description ?? null, updates.status ?? null, 
        JSON.stringify(updatedFeatures), now, id
      ]
    );
    
    return await getMotoById(id);
  } catch (error) {
    console.error("MySQL error updating moto:", error);
    return null;
  }
}

export async function deleteMoto(id: string): Promise<boolean> {
  try {
    await query("DELETE FROM motos WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("MySQL error deleting moto:", error);
    return false;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await query("SELECT * FROM settings WHERE id = 'general'") as any[];
    if (rows.length > 0) {
      return rows[0] as SiteSettings;
    } else {
      await query(
        `INSERT INTO settings (id, name, phone, whatsapp, email, address, facebook, instagram, about)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['general', DEFAULT_SETTINGS.name, DEFAULT_SETTINGS.phone, DEFAULT_SETTINGS.whatsapp, DEFAULT_SETTINGS.email, DEFAULT_SETTINGS.address, DEFAULT_SETTINGS.facebook, DEFAULT_SETTINGS.instagram, DEFAULT_SETTINGS.about]
      );
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("MySQL error getting settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    await query(
      `UPDATE settings SET 
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        whatsapp = COALESCE(?, whatsapp),
        email = COALESCE(?, email),
        address = COALESCE(?, address),
        facebook = COALESCE(?, facebook),
        instagram = COALESCE(?, instagram),
        about = COALESCE(?, about)
       WHERE id = 'general'`,
      [
        updates.name ?? null, updates.phone ?? null, updates.whatsapp ?? null, 
        updates.email ?? null, updates.address ?? null, updates.facebook ?? null, 
        updates.instagram ?? null, updates.about ?? null
      ]
    );
    return await getSettings();
  } catch (error) {
    console.error("MySQL error updating settings:", error);
    const current = await getSettings();
    return { ...current, ...updates };
  }
}

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  
  // Assurez-vous que le dossier public/uploads existe
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  // Renvoie le chemin accessible publiquement
  return `/uploads/${filename}`;
}
