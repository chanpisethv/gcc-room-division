const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Admin password - CHANGE THIS!
const ADMIN_PASSWORD = 'GCCFT2026Admin123##';

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'rooms.json');
const PEOPLE_FILE = path.join(__dirname, 'data', 'people.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize rooms file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialRooms = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    occupants: []
  }));
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialRooms, null, 2));
}

// People data (from Excel)
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

// Save people data
if (!fs.existsSync(PEOPLE_FILE)) {
  fs.writeFileSync(PEOPLE_FILE, JSON.stringify(peopleData, null, 2));
}

// Helper: Read rooms from file
function readRooms() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading rooms:', error);
    return Array.from({ length: 14 }, (_, i) => ({
      id: i + 1,
      occupants: []
    }));
  }
}

// Helper: Write rooms to file
function writeRooms(rooms) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing rooms:', error);
    return false;
  }
}

// API Routes

// GET: Fetch all rooms
app.get('/api/rooms', (req, res) => {
  const rooms = readRooms();
  res.json(rooms);
});

// GET: Fetch all people data
app.get('/api/people', (req, res) => {
  res.json(peopleData);
});

// POST: Assign a person to a room
app.post('/api/assign', (req, res) => {
  const { roomId, person } = req.body;
  
  if (!roomId || !person || !person.name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const rooms = readRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  // Check if room is full
  if (room.occupants.length >= 4) {
    return res.status(400).json({ error: 'Room is full' });
  }

  // Check if person is already in any room
  const alreadyAssigned = rooms.some(r => 
    r.occupants.some(p => p.name === person.name)
  );
  if (alreadyAssigned) {
    return res.status(400).json({ error: 'Person already assigned to a room' });
  }

  // Check eligibility (basic check)
  const isEligible = checkEligibility(roomId, person, rooms);
  if (!isEligible) {
    return res.status(400).json({ error: 'Person is not eligible for this room' });
  }

  // Add person to room
  room.occupants.push(person);
  
  if (writeRooms(rooms)) {
    res.json({ success: true, room });
  } else {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// DELETE: Remove a person from a room (requires admin password)
app.delete('/api/remove', (req, res) => {
  const { roomId, name, password } = req.body;
  
  if (!roomId || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify admin password
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const rooms = readRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const index = room.occupants.findIndex(p => p.name === name);
  if (index === -1) {
    return res.status(404).json({ error: 'Person not found in this room' });
  }

  room.occupants.splice(index, 1);
  
  if (writeRooms(rooms)) {
    res.json({ success: true, room });
  } else {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// POST: Reset all rooms (admin function)
app.post('/api/reset', (req, res) => {
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const emptyRooms = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    occupants: []
  }));
  
  if (writeRooms(emptyRooms)) {
    res.json({ success: true, message: 'All rooms reset' });
  } else {
    res.status(500).json({ error: 'Failed to reset rooms' });
  }
});

// Eligibility checker
function checkEligibility(roomId, person, rooms) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  
  const { gender, type } = person;

  // Rooms 1-5: Female Student only
  if (roomId >= 1 && roomId <= 5) return gender === 'Female' && type === 'student';
  // Rooms 6-9: Male Student only
  if (roomId >= 6 && roomId <= 9) return gender === 'Male' && type === 'student';
  // Room 10: Female Teacher only
  if (roomId === 10) return gender === 'Female' && type === 'Teacher';
  // Room 11: Male Teacher only
  if (roomId === 11) return gender === 'Male' && type === 'Teacher';
  // Room 12: Female Student + Female Teacher
  if (roomId === 12) return gender === 'Female';
  // Room 13: 1 Female Teacher + 3 Male Teachers
  if (roomId === 13) {
    if (type !== 'Teacher') return false;
    const femaleTeachers = room.occupants.filter(o => o.gender === 'Female' && o.type === 'Teacher');
    const maleTeachers = room.occupants.filter(o => o.gender === 'Male' && o.type === 'Teacher');
    if (gender === 'Female' && type === 'Teacher') {
      return femaleTeachers.length < 1;
    }
    if (gender === 'Male' && type === 'Teacher') {
      return maleTeachers.length < 3;
    }
    return false;
  }
  // Room 14: 2 Male Students + 2 Male Teachers
  if (roomId === 14) {
    if (gender !== 'Male') return false;
    const maleStudents = room.occupants.filter(o => o.gender === 'Male' && o.type === 'student');
    const maleTeachers = room.occupants.filter(o => o.gender === 'Male' && o.type === 'Teacher');
    if (type === 'student') {
      return maleStudents.length < 2;
    }
    if (type === 'Teacher') {
      return maleTeachers.length < 2;
    }
    return false;
  }
  return false;
}

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Access at: http://localhost:${PORT}`);
  console.log(`🔑 Admin password: ${ADMIN_PASSWORD}`);
});