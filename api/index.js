const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Admin password
const ADMIN_PASSWORD = 'admin2026';

// Use /tmp for Vercel
const DATA_DIR = '/tmp/data';
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Room configuration
const ROOM_CONFIG = [
  { id: 1, capacity: 4, type: 'Female Students', allowedGender: 'Female', allowedType: 'student' },
  { id: 2, capacity: 4, type: 'Female Students', allowedGender: 'Female', allowedType: 'student' },
  { id: 3, capacity: 4, type: 'Female Students', allowedGender: 'Female', allowedType: 'student' },
  { id: 4, capacity: 4, type: 'Female Students', allowedGender: 'Female', allowedType: 'student' },
  { id: 5, capacity: 5, type: 'Female Students (5 pax)', allowedGender: 'Female', allowedType: 'student' },
  { id: 6, capacity: 4, type: 'Male Students', allowedGender: 'Male', allowedType: 'student' },
  { id: 7, capacity: 4, type: 'Male Students', allowedGender: 'Male', allowedType: 'student' },
  { id: 8, capacity: 4, type: 'Male Students', allowedGender: 'Male', allowedType: 'student' },
  { id: 9, capacity: 4, type: 'Male Students', allowedGender: 'Male', allowedType: 'student' },
  { id: 10, capacity: 4, type: 'Female Teachers', allowedGender: 'Female', allowedType: 'Teacher' },
  { id: 11, capacity: 4, type: 'Male Teachers', allowedGender: 'Male', allowedType: 'Teacher' },
  { id: 12, capacity: 4, type: 'Male Teachers', allowedGender: 'Male', allowedType: 'Teacher' },
  { id: 13, capacity: 3, type: 'Female Teachers (3 pax)', allowedGender: 'Female', allowedType: 'Teacher' },
  { id: 14, capacity: 4, type: 'Mixed Female', allowedGender: 'Female', allowedType: 'both' }
];

if (!fs.existsSync(DATA_FILE)) {
  const initialRooms = ROOM_CONFIG.map(config => ({
    id: config.id,
    occupants: [],
    capacity: config.capacity
  }));
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialRooms, null, 2));
}

// People data
const peopleData = [
  { name: "ឃឹម ផល្លា", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "ស្រៀង គឹមស្រ៊ន", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "មន មករា", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "ម៉ិច ស៊ីណា", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ភឺន សុខណា", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ជីម សុខា", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "សយ ច័ន្ទរតនា", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "វុឌ្ឍី ចន្ទពិសិដ្ឋ", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "ម៉ិច ស៊ីនឿន", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ប្រាក់ សុវណ្ណរាជ", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "សៀង សុអ្នក", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "វុិញ រក្សា", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ហែម សុវណ្ណបញ្ញា", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ស៊ីម សំអូន", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "កាំង សាំងលីន", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ហ៊ន គានី", gender: "Female", role: "Organizer", type: "Teacher" },
  { name: "ញ៉ឹល វង្សសូ", gender: "Male", role: "Organizer", type: "Teacher" },
  { name: "កែវ គានពុទ្ធិវុធ", gender: "Male", role: "ជីវចម្រុះតំបន់ឆ្នេរ", type: "student" },
  { name: "ប៊ុត នីនរដ្ឋា", gender: "Female", role: "ជីវចម្រុះតំបន់ឆ្នេរ", type: "student" },
  { name: "វិសាល ពុទ្ធិស័ក្តិ", gender: "Male", role: "ជីវចម្រុះតំបន់ឆ្នេរ", type: "student" },
  { name: "ងិល ពេជ្រមល្លិកា", gender: "Female", role: "ជីវចម្រុះតំបន់ឆ្នេរ", type: "student" },
  { name: "ហាន សីហុង", gender: "Male", role: "ជីវចម្រុះតំបន់ឆ្នេរ", type: "student" },
  { name: "ប៊ុនលី គីមហុង", gender: "Female", role: "សិលា", type: "student" },
  { name: "ស្រ៊ុន ឧដ្ឋារិនី", gender: "Female", role: "សិលា", type: "student" },
  { name: "អេង គីមលាង", gender: "Female", role: "សិលា", type: "student" },
  { name: "ម៉ៅ គីមអេង", gender: "Female", role: "សិលា", type: "student" },
  { name: "ផល្លា​ តារាវិជ្ជា", gender: "Male", role: "សិលា", type: "student" },
  { name: "ចាន់ សុវណ្ណគន្ធី", gender: "Female", role: "ធាតុអាកាស", type: "student" },
  { name: "ឃី លីហ័រ", gender: "Female", role: "ធាតុអាកាស", type: "student" },
  { name: "អ៊ូច ស៊ីឡាយហ័រ", gender: "Female", role: "ធាតុអាកាស", type: "student" },
  { name: "ផាន់ ម៉េងលី", gender: "Male", role: "ធាតុអាកាស", type: "student" },
  { name: "គួច គ័ងហៀង", gender: "Male", role: "ធាតុអាកាស", type: "student" },
  { name: "ឃឿន អូសស្កា", gender: "Male", role: "គុណភាពខ្យល់", type: "student" },
  { name: "ជិន ចាន់កណិកា", gender: "Female", role: "គុណភាពខ្យល់", type: "student" },
  { name: "ហោ ស៊ីវម៉ី", gender: "Female", role: "គុណភាពខ្យល់", type: "student" },
  { name: "មុន្នីរតនា សុជាតា", gender: "Female", role: "គុណភាពខ្យល់", type: "student" },
  { name: "ថាក់​ ខេវីន", gender: "Male", role: "គុណភាពខ្យល់", type: "student" },
  { name: "ងិល ពេជ្រសុជាតា", gender: "Female", role: "គុណភាពដី", type: "student" },
  { name: "សីហា វីរៈជន", gender: "Male", role: "គុណភាពដី", type: "student" },
  { name: "អ៊ូច សុីសឹង្ហហាប់", gender: "Male", role: "គុណភាពដី", type: "student" },
  { name: "ចាប កែវសុវណ្ណ", gender: "Male", role: "គុណភាពដី", type: "student" },
  { name: "លី បូរ៉ានេត្រ", gender: "Female", role: "គុណភាពដី", type: "student" },
  { name: "បុត្រ ខេនរាពិទូ", gender: "Male", role: "លក្ខណៈទូទៅនៃទឹកសមុទ្រ", type: "student" },
  { name: "កេត សុរៈមុនិ", gender: "Female", role: "លក្ខណៈទូទៅនៃទឹកសមុទ្រ", type: "student" },
  { name: "ងួន ហេងឃាង", gender: "Male", role: "លក្ខណៈទូទៅនៃទឹកសមុទ្រ", type: "student" },
  { name: "អ៊ឹងឃុន ម៉េងឈុង", gender: "Female", role: "លក្ខណៈទូទៅនៃទឹកសមុទ្រ", type: "student" },
  { name: "ជាង ដាវីន", gender: "Female", role: "លក្ខណៈទូទៅនៃទឹកសមុទ្រ", type: "student" },
  { name: "ផន ចណមី", gender: "Female", role: "មីក្រូផ្លាស្ទិច", type: "student" },
  { name: "ពៅ មរកត", gender: "Female", role: "មីក្រូផ្លាស្ទិច", type: "student" },
  { name: "ថន ដាណែត", gender: "Male", role: "មីក្រូផ្លាស្ទិច", type: "student" },
  { name: "កួច ហួយលីង", gender: "Female", role: "មីក្រូផ្លាស្ទិច", type: "student" },
  { name: "ឈឿន យ៉ុងឈី", gender: "Male", role: "មីក្រូផ្លាស្ទិច", type: "student" },
  { name: "រិទ្ធី រតនៈវិសាល", gender: "Male", role: "កាបូនឆ្នេរ៖ ព្រៃកោងកាង", type: "student" },
  { name: "ជិនពិសិដ្ឋ លីហ្សា", gender: "Female", role: "កាបូនឆ្នេរ៖ ព្រៃកោងកាង", type: "student" },
  { name: "សែម គីមយ៉ាង", gender: "Male", role: "កាបូនឆ្នេរ៖ ព្រៃកោងកាង", type: "student" },
  { name: "ជួប បុញ្ញរាសី", gender: "Female", role: "កាបូនឆ្នេរ៖ ព្រៃកោងកាង", type: "student" },
  { name: "ហេង​ ប្រាជ្ញា", gender: "Male", role: "កាបូនឆ្នេរ៖ ព្រៃកោងកាង", type: "student" }
];

function readRooms() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return ROOM_CONFIG.map(config => ({
      id: config.id,
      occupants: [],
      capacity: config.capacity
    }));
  }
}

function writeRooms(rooms) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

function getRoomConfig(roomId) {
  return ROOM_CONFIG.find(r => r.id === roomId);
}

function checkEligibility(roomId, person, rooms, forceOverride = false) {
  const room = rooms.find(r => r.id === roomId);
  const config = getRoomConfig(roomId);
  if (!room || !config) return false;
  const { gender, type } = person;
  
  if (config.allowedType === 'both') {
    if (gender !== 'Female') return false;
  } else {
    if (gender !== config.allowedGender) return false;
    if (type !== config.allowedType) return false;
  }
  if (forceOverride) return true;
  return room.occupants.length < room.capacity;
}

// API Routes
app.get('/api/room-division/api/rooms', (req, res) => {
  res.json(readRooms());
});

app.get('/api/room-division/api/people', (req, res) => {
  res.json(peopleData);
});

app.get('/api/room-division/api/config', (req, res) => {
  res.json({ rooms: ROOM_CONFIG, totalParticipants: 56 });
});

app.post('/api/room-division/api/assign', (req, res) => {
  const { roomId, person, forceOverride = false } = req.body;
  if (!roomId || !person || !person.name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const rooms = readRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const alreadyAssigned = rooms.some(r => r.occupants.some(p => p.name === person.name));
  if (alreadyAssigned) return res.status(400).json({ error: 'Person already assigned' });

  if (!checkEligibility(roomId, person, rooms, forceOverride)) {
    if (room.occupants.length >= room.capacity && !forceOverride) {
      return res.status(400).json({
        error: 'Room is full',
        capacity: room.capacity,
        currentOccupancy: room.occupants.length,
        canForce: true
      });
    }
    return res.status(400).json({ error: 'Not eligible for this room' });
  }

  room.occupants.push(person);
  if (writeRooms(rooms)) {
    res.json({ success: true, room, forceApplied: room.occupants.length > room.capacity });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

app.delete('/api/room-division/api/remove', (req, res) => {
  const { roomId, name, password } = req.body;
  if (!roomId || !name) return res.status(400).json({ error: 'Missing fields' });
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid admin password' });

  const rooms = readRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const index = room.occupants.findIndex(p => p.name === name);
  if (index === -1) return res.status(404).json({ error: 'Person not found' });

  room.occupants.splice(index, 1);
  if (writeRooms(rooms)) {
    res.json({ success: true, room });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

app.post('/api/room-division/api/reset', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' });

  const emptyRooms = ROOM_CONFIG.map(config => ({
    id: config.id,
    occupants: [],
    capacity: config.capacity
  }));
  if (writeRooms(emptyRooms)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to reset' });
  }
});

// Export for Vercel
module.exports = app;
