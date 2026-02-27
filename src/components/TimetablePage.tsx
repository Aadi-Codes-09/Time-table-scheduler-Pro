import { useState } from 'react';
import { Trash2, CalendarDays, Filter } from 'lucide-react';
import { getFaculty, getDivisions, getClassrooms, getTimeslots, getLectures, deleteLecture } from '../store/db';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CELL_COLORS = [
  'bg-indigo-50 border-indigo-200 text-indigo-900',
  'bg-emerald-50 border-emerald-200 text-emerald-900',
  'bg-purple-50 border-purple-200 text-purple-900',
  'bg-amber-50 border-amber-200 text-amber-900',
  'bg-rose-50 border-rose-200 text-rose-900',
  'bg-cyan-50 border-cyan-200 text-cyan-900',
  'bg-pink-50 border-pink-200 text-pink-900',
  'bg-teal-50 border-teal-200 text-teal-900',
  'bg-orange-50 border-orange-200 text-orange-900',
  'bg-blue-50 border-blue-200 text-blue-900',
];

const SUBJECT_BADGES = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function TimetablePage() {
  const faculty = getFaculty();
  const divisions = getDivisions();
  const classrooms = getClassrooms();
  const timeslots = getTimeslots();
  const [lectures, setLectures] = useState(getLectures());
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  // Get unique sorted time ranges
  const timeRanges = [...new Set(timeslots.map(t => `${t.start}-${t.end}`))].sort();

  // Filter lectures
  const filteredLectures = lectures.filter(l => {
    if (selectedDivision && l.divisionId !== selectedDivision) return false;
    if (selectedFaculty && l.facultyId !== selectedFaculty) return false;
    return true;
  });

  const getLectureForSlot = (day: string, timeRange: string) => {
    const [start, end] = timeRange.split('-');
    const matchingSlots = timeslots.filter(t => t.day === day && t.start === start && t.end === end);
    const slotIds = matchingSlots.map(t => t.id);
    return filteredLectures.filter(l => slotIds.includes(l.timeslotId));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this lecture from the timetable?')) return;
    deleteLecture(id);
    setLectures(getLectures());
  };

  const getColor = (subject: string) => CELL_COLORS[hashString(subject) % CELL_COLORS.length];
  const getBadge = (subject: string) => SUBJECT_BADGES[hashString(subject) % SUBJECT_BADGES.length];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Timetable</h1>
          <p className="text-slate-500 mt-1">Weekly schedule overview • {filteredLectures.length} lecture{filteredLectures.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <select
            value={selectedDivision}
            onChange={e => setSelectedDivision(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition shadow-sm"
          >
            <option value="">All Divisions</option>
            {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select
            value={selectedFaculty}
            onChange={e => setSelectedFaculty(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition shadow-sm"
          >
            <option value="">All Faculty</option>
            {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      </div>

      {lectures.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <CalendarDays className="w-20 h-20 mx-auto mb-5 opacity-15" />
          <p className="text-xl font-medium text-slate-500">No lectures scheduled yet</p>
          <p className="text-sm mt-2 text-slate-400">Go to the Schedule page to add your first lecture</p>
        </div>
      ) : timeRanges.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">No time slots configured</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200 w-32 sticky left-0 z-10">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Time
                    </span>
                  </th>
                  {DAYS.map(day => (
                    <th key={day} className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeRanges.map((timeRange, ri) => (
                  <tr key={timeRange} className={ri % 2 === 0 ? '' : 'bg-slate-50/30'}>
                    <td className="px-4 py-3 border-b border-slate-100 sticky left-0 z-10 bg-white">
                      <div className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                        {timeRange.replace('-', ' – ')}
                      </div>
                    </td>
                    {DAYS.map(day => {
                      const cellLectures = getLectureForSlot(day, timeRange);
                      return (
                        <td key={day} className="px-2 py-2 border-b border-slate-100 align-top min-w-[160px]">
                          {cellLectures.length === 0 ? (
                            <div className="h-16 rounded-lg border border-dashed border-slate-200/60" />
                          ) : (
                            cellLectures.map(lecture => {
                              const f = faculty.find(x => x.id === lecture.facultyId);
                              const c = classrooms.find(x => x.id === lecture.classroomId);
                              const d = divisions.find(x => x.id === lecture.divisionId);
                              return (
                                <div
                                  key={lecture.id}
                                  className={`rounded-xl border p-3 mb-1.5 ${getColor(lecture.subject)} group relative transition-shadow hover:shadow-md`}
                                >
                                  <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 ${getBadge(lecture.subject)}`}>
                                    {lecture.subject}
                                  </div>
                                  <p className="text-xs font-medium opacity-80">{f?.name}</p>
                                  <p className="text-[10px] opacity-60 mt-0.5">{c?.name} • {d?.name}</p>
                                  <button
                                    onClick={() => handleDelete(lecture.id)}
                                    className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-black/10 transition"
                                    title="Remove lecture"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      {filteredLectures.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Subjects Legend</h3>
          <div className="flex flex-wrap gap-2">
            {[...new Set(filteredLectures.map(l => l.subject))].map(subj => (
              <span key={subj} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${getColor(subj)}`}>
                <span className="w-2 h-2 rounded-full bg-current opacity-40" />
                {subj}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
