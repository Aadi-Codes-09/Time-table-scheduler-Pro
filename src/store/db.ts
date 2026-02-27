// ===== Types =====
export interface Faculty {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
}

export interface Timeslot {
  id: string;
  day: string;
  start: string;
  end: string;
}

export interface Lecture {
  id: string;
  facultyId: string;
  divisionId: string;
  classroomId: string;
  timeslotId: string;
  subject: string;
}

export interface ConflictResult {
  success: boolean;
  message?: string;
  conflicts?: string[];
  suggestions?: Timeslot[];
}

// ===== Helpers =====
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getItems<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// ===== Faculty CRUD =====
export function getFaculty(): Faculty[] {
  return getItems<Faculty>('tts_faculty');
}

export function addFaculty(name: string): Faculty {
  const items = getFaculty();
  const item: Faculty = { id: generateId(), name };
  items.push(item);
  setItems('tts_faculty', items);
  return item;
}

export function deleteFaculty(id: string): void {
  setItems('tts_faculty', getFaculty().filter(f => f.id !== id));
}

// ===== Division CRUD =====
export function getDivisions(): Division[] {
  return getItems<Division>('tts_divisions');
}

export function addDivision(name: string): Division {
  const items = getDivisions();
  const item: Division = { id: generateId(), name };
  items.push(item);
  setItems('tts_divisions', items);
  return item;
}

export function deleteDivision(id: string): void {
  setItems('tts_divisions', getDivisions().filter(d => d.id !== id));
}

// ===== Classroom CRUD =====
export function getClassrooms(): Classroom[] {
  return getItems<Classroom>('tts_classrooms');
}

export function addClassroom(name: string, capacity: number): Classroom {
  const items = getClassrooms();
  const item: Classroom = { id: generateId(), name, capacity };
  items.push(item);
  setItems('tts_classrooms', items);
  return item;
}

export function deleteClassroom(id: string): void {
  setItems('tts_classrooms', getClassrooms().filter(c => c.id !== id));
}

// ===== Timeslot CRUD =====
export function getTimeslots(): Timeslot[] {
  return getItems<Timeslot>('tts_timeslots');
}

export function addTimeslot(day: string, start: string, end: string): Timeslot {
  const items = getTimeslots();
  const item: Timeslot = { id: generateId(), day, start, end };
  items.push(item);
  setItems('tts_timeslots', items);
  return item;
}

export function deleteTimeslot(id: string): void {
  setItems('tts_timeslots', getTimeslots().filter(t => t.id !== id));
}

// ===== Lecture / Timetable =====
export function getLectures(): Lecture[] {
  return getItems<Lecture>('tts_lectures');
}

export function deleteLecture(id: string): void {
  setItems('tts_lectures', getLectures().filter(l => l.id !== id));
}

// ===== Conflict Detection + Scheduling =====
export function scheduleLecture(
  facultyId: string,
  divisionId: string,
  classroomId: string,
  timeslotId: string,
  subject: string
): ConflictResult {
  const lectures = getLectures();
  const conflicts: string[] = [];
  const faculty = getFaculty();
  const classrooms = getClassrooms();
  const divisions = getDivisions();
  const timeslots = getTimeslots();

  const timeslot = timeslots.find(t => t.id === timeslotId);
  if (!timeslot) return { success: false, message: 'Invalid timeslot', conflicts: ['Selected time slot not found'] };

  // Check all existing lectures for this timeslot
  for (const lecture of lectures) {
    if (lecture.timeslotId === timeslotId) {
      if (lecture.facultyId === facultyId) {
        const f = faculty.find(x => x.id === facultyId);
        conflicts.push(`Faculty "${f?.name || 'Unknown'}" is already teaching during ${timeslot.day} ${timeslot.start}–${timeslot.end}`);
      }
      if (lecture.classroomId === classroomId) {
        const c = classrooms.find(x => x.id === classroomId);
        conflicts.push(`Classroom "${c?.name || 'Unknown'}" is already occupied during ${timeslot.day} ${timeslot.start}–${timeslot.end}`);
      }
      if (lecture.divisionId === divisionId) {
        const d = divisions.find(x => x.id === divisionId);
        conflicts.push(`Division "${d?.name || 'Unknown'}" already has a lecture during ${timeslot.day} ${timeslot.start}–${timeslot.end}`);
      }
    }
  }

  if (conflicts.length > 0) {
    const suggestions = suggestFreeSlots(facultyId, divisionId, classroomId);
    return { success: false, conflicts, suggestions };
  }

  // No conflict — save lecture
  const newLecture: Lecture = {
    id: generateId(),
    facultyId,
    divisionId,
    classroomId,
    timeslotId,
    subject,
  };
  const updated = [...lectures, newLecture];
  setItems('tts_lectures', updated);
  return { success: true, message: 'Lecture scheduled successfully!' };
}

// ===== Free Slot Suggestions =====
export function suggestFreeSlots(
  facultyId: string,
  divisionId: string,
  classroomId: string
): Timeslot[] {
  const lectures = getLectures();
  const timeslots = getTimeslots();

  return timeslots.filter(ts => {
    const hasConflict = lectures.some(
      l =>
        l.timeslotId === ts.id &&
        (l.facultyId === facultyId || l.classroomId === classroomId || l.divisionId === divisionId)
    );
    return !hasConflict;
  });
}

// ===== Seed Demo Data =====
export function seedData(): void {
  if (localStorage.getItem('tts_seeded_v4')) return;

  // Clear old data to apply the new hardcoded items
  localStorage.clear();

  const faculties = ['Prof. J.A Ansari', 'Prof. Jupinder Kaur', 'Prof. Maya Kurulekar', 'Prof. Srinivas Chippalkatti', 'Prof. Yogita Patil', 'Prof. Aditya Bhope', 'Prof. Swapnil', 'Prof. Ketki Shinde', 'Prof. Hemlata Uday Karne', 'Prof.Vishal B Ambhore', 'Prof.Kailas R Patil', 'Prof.Kaustubh M Utpat'];
  faculties.forEach(name => addFaculty(name));

  const divs = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  divs.forEach(name => addDivision(name));

  const rooms = [
    { name: 'Room 2403', capacity: 60 },
    { name: 'Room 2404', capacity: 60 },
    { name: 'Room 2405', capacity: 60 },
    { name: 'Room 2406', capacity: 60 },
    { name: 'Lab 2408', capacity: 30 },
    { name: 'Lab 2416', capacity: 40 },
  ];
  rooms.forEach(r => addClassroom(r.name, r.capacity));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = [
    { start: '09:15', end: '10:15' },
    { start: '10:15', end: '11:15' },
    { start: '11:15', end: '12:15' },
    { start: '12:15', end: '13:15' },
    { start: '14:15', end: '15:15' },
    { start: '15:15', end: '16:15' },
  ];
  days.forEach(day => {
    times.forEach(t => addTimeslot(day, t.start, t.end));
  });

  localStorage.setItem('tts_seeded_v4', 'true');
}
