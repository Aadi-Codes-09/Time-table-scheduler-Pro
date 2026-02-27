import { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { getTimeslots, addTimeslot, deleteTimeslot } from '../store/db';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dayColors: Record<string, string> = {
  Monday: 'from-blue-500 to-blue-600',
  Tuesday: 'from-purple-500 to-purple-600',
  Wednesday: 'from-emerald-500 to-emerald-600',
  Thursday: 'from-orange-500 to-orange-600',
  Friday: 'from-rose-500 to-rose-600',
  Saturday: 'from-slate-500 to-slate-600',
};

const dayBadgeColors: Record<string, string> = {
  Monday: 'bg-blue-100 text-blue-700 border-blue-200',
  Tuesday: 'bg-purple-100 text-purple-700 border-purple-200',
  Wednesday: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Thursday: 'bg-orange-100 text-orange-700 border-orange-200',
  Friday: 'bg-rose-100 text-rose-700 border-rose-200',
  Saturday: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function TimeslotPage() {
  const [timeslots, setTimeslots] = useState(getTimeslots());
  const [day, setDay] = useState('Monday');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;
    addTimeslot(day, start, end);
    setTimeslots(getTimeslots());
    setStart('');
    setEnd('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteTimeslot(id);
    setTimeslots(getTimeslots());
  };

  // Group by day
  const grouped = DAYS.reduce((acc, d) => {
    acc[d] = timeslots.filter(t => t.day === d).sort((a, b) => a.start.localeCompare(b.start));
    return acc;
  }, {} as Record<string, typeof timeslots>);

  const activeDays = DAYS.filter(d => grouped[d] && grouped[d].length > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Time Slots</h1>
        <p className="text-slate-500 mt-1">Configure available time slots for each day</p>
      </div>

      {/* Add form */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <div className="flex gap-3 flex-wrap items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Day</label>
              <select
                value={day}
                onChange={e => setDay(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition text-sm"
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Time</label>
              <input
                type="time"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">End Time</label>
              <input
                type="time"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-rose-200/50 transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setStart(''); setEnd(''); }}
              className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-white border border-dashed border-slate-300 text-slate-600 font-medium rounded-xl hover:border-rose-400 hover:text-rose-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Time Slot
        </button>
      )}

      {/* Time slots grouped by day */}
      {activeDays.length > 0 ? (
        <div className="space-y-4">
          {activeDays.map(d => (
            <div key={d} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
              <div className={`px-5 py-3 bg-gradient-to-r ${dayColors[d]} flex items-center gap-2`}>
                <Clock className="w-4 h-4 text-white/80" />
                <h3 className="text-sm font-semibold text-white">{d}</h3>
                <span className="ml-auto text-xs text-white/70 font-medium">{grouped[d].length} slot{grouped[d].length !== 1 ? 's' : ''}</span>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {grouped[d].map(t => (
                  <div
                    key={t.id}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${dayBadgeColors[d]} hover:shadow-sm transition group`}
                  >
                    <span>{t.start} – {t.end}</span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-black/10 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No time slots configured</p>
          <p className="text-sm mt-1">Add time slots using the form above</p>
        </div>
      )}
    </div>
  );
}
