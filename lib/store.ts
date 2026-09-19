import { Moto, SiteSettings } from "@/types";
import { DEFAULT_SETTINGS, INITIAL_MOTOS } from "./mockData";
import { db, storage, isFirebaseConfigured } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const LOCAL_MOTOS_KEY = "maison_moto_catalog_motos";
const LOCAL_SETTINGS_KEY = "maison_moto_catalog_settings";

// Helper for local storage initialization
function getLocalMotos(): Moto[] {
  if (typeof window === "undefined") return INITIAL_MOTOS;
  try {
    const data = localStorage.getItem(LOCAL_MOTOS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_MOTOS_KEY, JSON.stringify(INITIAL_MOTOS));
      return INITIAL_MOTOS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_MOTOS;
  }
}

function setLocalMotos(motos: Moto[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_MOTOS_KEY, JSON.stringify(motos));
  } catch (e) {
    console.error("Failed to save motos in localStorage", e);
  }
}

function getLocalSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function setLocalSettings(settings: SiteSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings in localStorage", e);
  }
}

// Data store API methods
export async function getMotos(): Promise<Moto[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "motos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // If firestore is empty, auto-seed with initial motos
        console.log("Firestore collection empty, seeding initial motos...");
        for (const item of INITIAL_MOTOS) {
          await setDoc(doc(db, "motos", item.id), item);
        }
        return INITIAL_MOTOS;
      }
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Moto[];
    } catch (error) {
      console.warn("Firestore error getting motos, falling back to local:", error);
      return getLocalMotos();
    }
  }
  return getLocalMotos();
}

export async function getMotoById(id: string): Promise<Moto | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "motos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Moto;
      }
    } catch (error) {
      console.warn("Firestore error getting moto by ID:", error);
    }
  }
  const localMotos = getLocalMotos();
  return localMotos.find((m) => m.id === id) || null;
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

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "motos", newId);
      await setDoc(docRef, {
        ...newMoto,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newMoto;
    } catch (error) {
      console.warn("Firestore error creating moto:", error);
    }
  }

  const motos = getLocalMotos();
  const updated = [newMoto, ...motos];
  setLocalMotos(updated);
  return newMoto;
}

export async function updateMoto(id: string, updates: Partial<Moto>): Promise<Moto | null> {
  const now = Date.now();
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "motos", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        return { id: updatedSnap.id, ...updatedSnap.data() } as Moto;
      }
    } catch (error) {
      console.warn("Firestore error updating moto:", error);
    }
  }

  const motos = getLocalMotos();
  const index = motos.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updatedMoto = { ...motos[index], ...updates, updatedAt: now };
  motos[index] = updatedMoto;
  setLocalMotos(motos);
  return updatedMoto;
}

export async function deleteMoto(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "motos", id));
      return true;
    } catch (error) {
      console.warn("Firestore error deleting moto:", error);
    }
  }

  const motos = getLocalMotos();
  const filtered = motos.filter((m) => m.id !== id);
  setLocalMotos(filtered);
  return true;
}

export async function getSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      } else {
        await setDoc(docRef, DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
    } catch (error) {
      console.warn("Firestore error getting settings:", error);
    }
  }
  return getLocalSettings();
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "settings", "general");
      await setDoc(docRef, updates, { merge: true });
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
    } catch (error) {
      console.warn("Firestore error updating settings:", error);
    }
  }

  const current = getLocalSettings();
  const updated = { ...current, ...updates };
  setLocalSettings(updated);
  return updated;
}

export async function uploadImage(file: File): Promise<string> {
  if (isFirebaseConfigured && storage) {
    try {
      const storageRef = ref(storage, `motos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn("Firebase Storage upload failed, falling back to base64 DataURL:", error);
    }
  }

  // Fallback to Base64 data URL for local storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
