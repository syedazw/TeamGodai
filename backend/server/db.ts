import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Load seeds and types
const rootDir = process.cwd();
import { INITIAL_EVENTS, INITIAL_TRAINERS } from '../../frontend/src/data.ts';
import { EventModel, TrainerModel, InquiryModel } from '../../frontend/src/types.ts';

// Setup file persistence paths
export const DATA_DIR = path.join(rootDir, 'data');
export const UPLOADS_DIR = path.join(rootDir, 'public', 'uploads');
export const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
export const TRAINERS_FILE = path.join(DATA_DIR, 'trainers.json');
export const INQUIRIES_FILE = path.join(DATA_DIR, 'submissions.json');

// Bootstrap folders
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Local Database File Operations
export const loadEvents = (): EventModel[] => {
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(INITIAL_EVENTS, null, 2), 'utf-8');
    return INITIAL_EVENTS;
  }
  try {
    const raw = fs.readFileSync(EVENTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse events database, falling back to seed.', e);
    return INITIAL_EVENTS;
  }
};

export const saveEvents = (events: EventModel[]) => {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
};

export const loadTrainers = (): TrainerModel[] => {
  if (!fs.existsSync(TRAINERS_FILE)) {
    fs.writeFileSync(TRAINERS_FILE, JSON.stringify(INITIAL_TRAINERS, null, 2), 'utf-8');
    return INITIAL_TRAINERS;
  }
  try {
    const raw = fs.readFileSync(TRAINERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse trainers database, falling back to seed.', e);
    return INITIAL_TRAINERS;
  }
};

export const saveTrainers = (trainers: TrainerModel[]) => {
  fs.writeFileSync(TRAINERS_FILE, JSON.stringify(trainers, null, 2), 'utf-8');
};

export const loadInquiries = (): InquiryModel[] => {
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveInquiries = (inquiries: InquiryModel[]) => {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
};

// Clean config value helper to strip wrapping quotes or spacing introduced in .env/secrets
function cleanConfigValue(val: string | undefined): string {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

// MySQL State
export let mysqlPool: mysql.Pool | null = null;
export let useMySQL = false;
export let mysqlStatusMessage = "MySQL not configured. Starting in Local JSON fallback mode.";

export const mysqlHost = cleanConfigValue(process.env.MYSQL_HOST) || "trolley.proxy.rlwy.net";
export const mysqlUser = cleanConfigValue(process.env.MYSQL_USER) || "root";
export const mysqlDatabase = cleanConfigValue(process.env.MYSQL_DATABASE) || "team_godai_pakistan";
export const mysqlPassword = cleanConfigValue(process.env.MYSQL_PASSWORD) || "sjzfMphJruKiElKyOUffjGwTmgfobpUm";
export const mysqlPort = cleanConfigValue(process.env.MYSQL_PORT) || "37144";
export const mysqlSSL = cleanConfigValue(process.env.MYSQL_SSL) || "true";

if (mysqlHost && mysqlUser && mysqlDatabase) {
  try {
    const sslConfig = mysqlSSL === 'true' ? { rejectUnauthorized: false } : undefined;
    mysqlPool = mysql.createPool({
      host: mysqlHost,
      user: mysqlUser,
      password: mysqlPassword,
      database: mysqlDatabase,
      port: mysqlPort ? parseInt(mysqlPort) : 37144,
      ssl: sslConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    useMySQL = true;
    mysqlStatusMessage = `Attempting connection to MySQL server at ${mysqlHost}`;
  } catch (err: any) {
    console.warn('⚠️ [MySQL Init Warning] Failed to create connection pool. Falling back to JSON files.', err);
    useMySQL = false;
    mysqlStatusMessage = `Error creating connection pool: ${err.message}. Powered by Local JSON files.`;
  }
}

export async function initializeDatabase() {
  if (!useMySQL || !mysqlPool) {
    console.log('📦 [Storage Engine] Bootstrapped using local JSON file fallback system.');
    loadEvents();
    loadTrainers();
    loadInquiries();
    return;
  }

  try {
    const connection = await mysqlPool.getConnection();
    console.log('✨ [MySQL] Connection established & verified successfully with database server.');
    connection.release();

    // 1. Create table `events`
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS \`events\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`date\` VARCHAR(100) NOT NULL,
        \`time\` VARCHAR(150),
        \`location\` VARCHAR(255),
        \`status\` VARCHAR(100),
        \`content\` TEXT,
        \`posterUrl\` VARCHAR(1000),
        \`videoUrl\` VARCHAR(1000),
        \`galleryUrls\` TEXT,
        \`autoScrollEnabled\` TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Create table `trainers`
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS \`trainers\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`specialty\` VARCHAR(255) NOT NULL,
        \`experience\` VARCHAR(255) NOT NULL,
        \`bio\` TEXT,
        \`imageUrl\` VARCHAR(1000)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create table `inquiries`
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS \`inquiries\` (
        \`id\` VARCHAR(100) PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(100),
        \`program\` VARCHAR(255),
        \`message\` TEXT,
        \`timestamp\` VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('💼 [MySQL Schema] Verified all structured tables successfully.');

    // Seeding if empty
    const [existingEvents]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM `events`');
    const eventCount = existingEvents[0]?.count || 0;
    if (eventCount === 0) {
      console.log('🌱 [MySQL Seeder] Setting up standard event records...');
      const localEvents = loadEvents();
      for (const event of localEvents) {
        await mysqlPool.query(
          'INSERT INTO `events` (id, title, date, time, location, status, content, posterUrl, videoUrl, galleryUrls, autoScrollEnabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            event.id,
            event.title,
            event.date,
            event.time,
            event.location,
            event.status,
            event.content,
            event.posterUrl,
            event.videoUrl || '',
            JSON.stringify(event.galleryUrls || []),
            event.autoScrollEnabled ? 1 : 0
          ]
        );
      }
    }

    const [existingTrainers]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM `trainers`');
    const trainerCount = existingTrainers[0]?.count || 0;
    if (trainerCount === 0) {
      console.log('🌱 [MySQL Seeder] Loading trainer rosters into SQL server...');
      const localTrainers = loadTrainers();
      for (const trainer of localTrainers) {
        await mysqlPool.query(
          'INSERT INTO `trainers` (id, name, specialty, experience, bio, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
          [
            trainer.id,
            trainer.name,
            trainer.specialty,
            trainer.experience,
            trainer.bio,
            trainer.imageUrl
          ]
        );
      }
    }

    const [existingInquiries]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM `inquiries`');
    const inquiriesCount = existingInquiries[0]?.count || 0;
    if (inquiriesCount === 0) {
      console.log('🌱 [MySQL Seeder] Migrating submission archives...');
      const localInquiries = loadInquiries();
      for (const inquiry of localInquiries) {
        await mysqlPool.query(
          'INSERT INTO `inquiries` (id, name, email, phone, program, message, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            inquiry.id,
            inquiry.name,
            inquiry.email,
            inquiry.phone || '',
            inquiry.program || '',
            inquiry.message,
            inquiry.timestamp
          ]
        );
      }
    }

    useMySQL = true;
    mysqlStatusMessage = `Connected to SQL database "${mysqlDatabase}" on host ${mysqlHost}`;

  } catch (err: any) {
    console.warn('⚠️ [MySQL Connection Failed] Fallback local mode.', err);
    useMySQL = false;
    mysqlStatusMessage = `Failed verification: ${err.message}. Operating in Local JSON fallback mode.`;
  }
}

export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  eventDate.setHours(0, 0, 0, 0);

  return eventDate < today;
}

// Abstracts
export const fetchEvents = async (): Promise<EventModel[]> => {
  let list: EventModel[] = [];
  if (useMySQL && mysqlPool) {
    try {
      const [rows]: any = await mysqlPool.query('SELECT * FROM `events` ORDER BY date DESC');
      list = (rows as any[]).map(row => ({
        id: row.id,
        title: row.title,
        date: row.date,
        time: row.time,
        location: row.location,
        status: row.status,
        content: row.content,
        posterUrl: row.posterUrl,
        videoUrl: row.videoUrl,
        galleryUrls: typeof row.galleryUrls === 'string' ? JSON.parse(row.galleryUrls) : (row.galleryUrls || []),
        autoScrollEnabled: Boolean(row.autoScrollEnabled)
      }));
    } catch (e: any) {
      console.error('⚠️ MySQL fetchEvents failed, resorting to local file read.', e);
      list = loadEvents();
    }
  } else {
    list = loadEvents();
  }

  // Auto-set past events to "Completed" and future events with "Completed" status to "Upcoming" to preserve data integrity and format display
  return list.map(event => {
    if (isPastDate(event.date)) {
      return { ...event, status: 'Completed' as const };
    } else if (event.status === 'Completed') {
      return { ...event, status: 'Upcoming' as const };
    }
    return event;
  });
};

export const createEventItem = async (event: EventModel): Promise<void> => {
  if (useMySQL && mysqlPool) {
    try {
      await mysqlPool.query(
        'INSERT INTO `events` (id, title, date, time, location, status, content, posterUrl, videoUrl, galleryUrls, autoScrollEnabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          event.id,
          event.title,
          event.date,
          event.time || 'TBD',
          event.location || 'Academy Arena',
          event.status || 'Upcoming',
          event.content,
          event.posterUrl,
          event.videoUrl || '',
          JSON.stringify(event.galleryUrls || []),
          event.autoScrollEnabled ? 1 : 0
        ]
      );
      return;
    } catch (e: any) {
      console.error('⚠️ MySQL createEventItem failed, writing locally.', e);
    }
  }
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEventItem = async (event: EventModel): Promise<boolean> => {
  if (useMySQL && mysqlPool) {
    try {
      const [result]: any = await mysqlPool.query(
        'UPDATE `events` SET title = ?, date = ?, time = ?, location = ?, status = ?, content = ?, posterUrl = ?, videoUrl = ?, galleryUrls = ?, autoScrollEnabled = ? WHERE id = ?',
        [
          event.title,
          event.date,
          event.time,
          event.location,
          event.status,
          event.content,
          event.posterUrl,
          event.videoUrl,
          JSON.stringify(event.galleryUrls || []),
          event.autoScrollEnabled ? 1 : 0,
          event.id
        ]
      );
      return result.affectedRows > 0;
    } catch (e: any) {
      console.error('⚠️ MySQL updateEventItem failed, updating locally.', e);
    }
  }
  const events = loadEvents();
  const idx = events.findIndex(e => e.id === event.id);
  if (idx === -1) return false;
  events[idx] = event;
  saveEvents(events);
  return true;
};

export const deleteEventItem = async (id: string): Promise<boolean> => {
  if (useMySQL && mysqlPool) {
    try {
      const [result]: any = await mysqlPool.query('DELETE FROM `events` WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e: any) {
      console.error('⚠️ MySQL deleteEventItem failed, deleting locally.', e);
    }
  }
  const events = loadEvents();
  const filtered = events.filter(e => e.id !== id);
  if (events.length === filtered.length) return false;
  saveEvents(filtered);
  return true;
};

export const fetchTrainers = async (): Promise<TrainerModel[]> => {
  console.log("MYSQL DEBUG:", useMySQL, mysqlPool)

  if (useMySQL && mysqlPool) {
    try {
      const [rows]: any = await mysqlPool.query('SELECT * FROM `trainers` ORDER by id DESC');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        specialty: row.specialty,
        experience: row.experience,
        bio: row.bio,
        imageUrl: row.imageUrl
      }));
    } catch (e: any) {
      console.error('⚠️ MySQL fetchTrainers failed, loading local.', e);
    }
  }
  return loadTrainers();
};

export const createTrainerItem = async (trainer: TrainerModel): Promise<void> => {
  if (useMySQL && mysqlPool) {
    try {
      await mysqlPool.query(
        'INSERT INTO `trainers` (id, name, specialty, experience, bio, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
        [
          trainer.id,
          trainer.name,
          trainer.specialty,
          trainer.experience,
          trainer.bio,
          trainer.imageUrl
        ]
      );
      return;
    } catch (e: any) {
      console.error('⚠️ MySQL createTrainerItem failed, writing locally.', e);
    }
  }
  const trainers = loadTrainers();
  trainers.push(trainer);
  saveTrainers(trainers);
};

export const updateTrainerItem = async (trainer: TrainerModel): Promise<boolean> => {
  if (useMySQL && mysqlPool) {
    try {
      const [result]: any = await mysqlPool.query(
        'UPDATE `trainers` SET name = ?, specialty = ?, experience = ?, bio = ?,  imageUrl = ? WHERE id = ?',
        [
          trainer.name,
          trainer.specialty,
          trainer.experience,
          trainer.bio,
          trainer.imageUrl,
          trainer.id
        ]
      );
      return result.affectedRows > 0;
    } catch (e: any) {
      console.error('⚠️ MySQL updateTrainerItem failed, updating locally.', e);
    }
  }
  const trainers = loadTrainers();
  const idx = trainers.findIndex(t => t.id === trainer.id);
  if (idx === -1) return false;
  trainers[idx] = trainer;
  saveTrainers(trainers);
  return true;
};

export const deleteTrainerItem = async (id: string): Promise<boolean> => {
  if (useMySQL && mysqlPool) {
    try {
      const [result]: any = await mysqlPool.query('DELETE FROM `trainers` WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e: any) {
      console.error('⚠️ MySQL deleteTrainerItem failed, deleting locally.', e);
    }
  }
  const trainers = loadTrainers();
  const filtered = trainers.filter(t => t.id !== id);
  if (trainers.length === filtered.length) return false;
  saveTrainers(filtered);
  return true;
};

export const fetchInquiries = async (): Promise<InquiryModel[]> => {
  if (useMySQL && mysqlPool) {
    try {
      const [rows]: any = await mysqlPool.query('SELECT * FROM `inquiries` ORDER BY timestamp DESC');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        program: row.program,
        message: row.message,
        timestamp: row.timestamp
      }));
    } catch (e: any) {
      console.error('⚠️ MySQL fetchInquiries failed, loading local.', e);
    }
  }
  return loadInquiries();
};

export const createInquiryItem = async (inquiry: InquiryModel): Promise<void> => {
  if (useMySQL && mysqlPool) {
    try {
      await mysqlPool.query(
        'INSERT INTO `inquiries` (id, name, email, phone, program, message, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          inquiry.id,
          inquiry.name,
          inquiry.email,
          inquiry.phone || '',
          inquiry.program || '',
          inquiry.message,
          inquiry.timestamp
        ]
      );
      return;
    } catch (e: any) {
      console.error('⚠️ MySQL createInquiryItem failed, writing locally.', e);
    }
  }
  const inquiries = loadInquiries();
  inquiries.unshift(inquiry);
  saveInquiries(inquiries);
};

export const deleteInquiryItem = async (id: string): Promise<boolean> => {
  if (useMySQL && mysqlPool) {
    try {
      const [result]: any = await mysqlPool.query('DELETE FROM `inquiries` WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e: any) {
      console.error('⚠️ MySQL deleteInquiryItem failed, deleting locally.', e);
    }
  }
  const inquiries = loadInquiries();
  const filtered = inquiries.filter(i => i.id !== id);
  if (inquiries.length === filtered.length) return false;
  saveInquiries(filtered);
  return true;
};
