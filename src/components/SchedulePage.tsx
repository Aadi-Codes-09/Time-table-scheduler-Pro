import { useState } from 'react';
import { CalendarPlus, AlertTriangle, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';
import {
  getFaculty,
  getDivisions,
  getClassrooms,
  getTimeslots,
  scheduleLecture,
  type ConflictResult,
} from '../store/db';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SchedulePage() {
  const faculty = getFaculty();
  const divisions = getDivisions();
  const classrooms = getClassrooms();
  const timeslots = getTimeslots();

  const [facultyId, setFacultyId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [timeslotId, setTimeslotId] = useState('');
  const [subject, setSubject] = useState('');
  const [result, setResult] = useState<ConflictResult | null>(null);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId || !divisionId || !classroomId || !timeslotId || !subject.trim()) {
      setResult({ success: false, conflicts: ['Please fill in all fields before scheduling.'] });
      return;
    }
    const res = scheduleLecture(facultyId, divisionId, classroomId, timeslotId, subject.trim());
    setResult(res);
    if (res.success) {
      setSubject('');
      setTimeslotId('');
    }
  };

  const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition text-sm appearance-none cursor-pointer";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Schedule Lecture</h1>
        <p className="text-slate-500 mt-1">Assign lectures with automatic conflict detection</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSchedule} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-slate-900">New Lecture</h2>
              </div>
              <p className="text-sm text-slate-500">Fill in the details to schedule a lecture. Conflicts will be detected automatically.</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Faculty</label>
                  <select value={facultyId} onChange={e => setFacultyId(e.target.value)} className={selectClass}>
                    <option value="">Select Faculty...</option>
                    {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Division</label>
                  <select value={divisionId} onChange={e => setDivisionId(e.target.value)} className={selectClass}>
                    <option value="">Select Division...</option>
                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Classroom</label>
                  <select value={classroomId} onChange={e => setClassroomId(e.target.value)} className={selectClass}>
                    <option value="">Select Classroom...</option>
                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.name} (Cap: {c.capacity})</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g., Data Structures"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Time Slot</label>
                <select value={timeslotId} onChange={e => setTimeslotId(e.target.value)} className={selectClass}>
                  <option value="">Select Time Slot...</option>
                  {DAYS.map(day => {
                    const daySlots = timeslots.filter(t => t.day === day);
                    if (daySlots.length === 0) return null;
                    return (
                      <optgroup key={day} label={`── ${day} ──`}>
                        {daySlots.map(t => (
                          <option key={t.id} value={t.id}>{t.start} – {t.end}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-200/60 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <CalendarPlus className="w-5 h-5" />
                Schedule Lecture
              </button>
            </div>
          </form>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {!result && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 text-center">
              <CalendarPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Fill in the form and click schedule.</p>
              <p className="text-xs text-slate-400 mt-1">Results will appear here.</p>
            </div>
          )}

          {result && result.success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 animate-scaleIn">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-emerald-800">Success!</h3>
              </div>
              <p className="text-sm text-emerald-700">{result.message}</p>
            </div>
          )}

          {result && !result.success && result.conflicts && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 animate-scaleIn">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-red-800">Conflict Detected!</h3>
              </div>
              <ul className="space-y-2">
                {result.conflicts.map((c, i) => (
                  <li key={i} className="text-sm text-red-700 flex items-start gap-2 bg-red-100/50 rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result && result.suggestions && result.suggestions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-scaleIn">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800">Free Slot Suggestions</h3>
                  <p className="text-xs text-amber-600">Click to auto-fill</p>
                </div>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {result.suggestions.slice(0, 12).map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setTimeslotId(s.id); setResult(null); }}
                    className="w-full text-left text-sm px-3 py-2.5 rounded-lg bg-white border border-amber-200/60 text-amber-800 hover:bg-amber-100 hover:border-amber-300 transition flex items-center justify-between group"
                  >
                    <span className="font-semibold">{s.day}</span>
                    <span className="text-amber-600 group-hover:text-amber-800">{s.start} – {s.end}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {result && result.suggestions && result.suggestions.length === 0 && !result.success && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 animate-scaleIn">
              <p className="text-sm text-slate-500 text-center">No free slots available for this combination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
