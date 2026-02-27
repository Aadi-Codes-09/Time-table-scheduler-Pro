import { Users, Building2, BookOpen, Layers, Clock, TrendingUp, type LucideIcon } from 'lucide-react';
import { getFaculty, getClassrooms, getDivisions, getLectures, getTimeslots } from '../store/db';

export function Dashboard() {
  const faculty = getFaculty();
  const classrooms = getClassrooms();
  const divisions = getDivisions();
  const lectures = getLectures();
  const timeslots = getTimeslots();

  const utilization = timeslots.length > 0 ? Math.round((lectures.length / timeslots.length) * 100) : 0;

  const stats: { label: string; value: string | number; icon: LucideIcon; iconColor: string; bg: string; gradient: string }[] = [
    { label: 'Total Faculty', value: faculty.length, icon: Users, iconColor: 'text-blue-500', bg: 'bg-blue-500/10', gradient: 'from-blue-500 to-cyan-400' },
    { label: 'Total Rooms', value: classrooms.length, icon: Building2, iconColor: 'text-emerald-500', bg: 'bg-emerald-500/10', gradient: 'from-emerald-500 to-teal-400' },
    { label: 'Total Divisions', value: divisions.length, icon: Layers, iconColor: 'text-purple-500', bg: 'bg-purple-500/10', gradient: 'from-purple-500 to-pink-400' },
    { label: 'Total Lectures', value: lectures.length, icon: BookOpen, iconColor: 'text-orange-500', bg: 'bg-orange-500/10', gradient: 'from-orange-500 to-amber-400' },
    { label: 'Time Slots', value: timeslots.length, icon: Clock, iconColor: 'text-rose-500', bg: 'bg-rose-500/10', gradient: 'from-rose-500 to-red-400' },
    { label: 'Utilization', value: `${utilization}%`, icon: TrendingUp, iconColor: 'text-indigo-500', bg: 'bg-indigo-500/10', gradient: 'from-indigo-500 to-violet-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your timetable scheduling system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          );
        })}
      </div>

      {/* Recent Lectures */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Recent Lectures</h2>
          <p className="text-sm text-slate-500 mt-0.5">Last 5 scheduled lectures</p>
        </div>
        <div className="p-4">
          {lectures.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No lectures scheduled yet</p>
              <p className="text-xs mt-1 text-slate-400">Go to the Schedule page to add lectures</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lectures.slice(-5).reverse().map(lecture => {
                const f = faculty.find(x => x.id === lecture.facultyId);
                const c = classrooms.find(x => x.id === lecture.classroomId);
                const d = divisions.find(x => x.id === lecture.divisionId);
                const t = timeslots.find(x => x.id === lecture.timeslotId);
                return (
                  <div key={lecture.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{lecture.subject}</p>
                      <p className="text-xs text-slate-500 truncate">{f?.name} • {d?.name} • {c?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-600">{t?.day}</p>
                      <p className="text-xs text-slate-400">{t?.start} – {t?.end}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
          <h3 className="text-lg font-semibold relative">Quick Tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-indigo-100 relative">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0" />
              Add faculty, rooms, and divisions first
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0" />
              Create time slots for each day
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0" />
              Schedule lectures — conflicts are auto-detected
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0" />
              View the complete timetable grid
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
          <h3 className="text-lg font-semibold relative">System Status</h3>
          <div className="mt-3 space-y-3 relative">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">Slot Coverage</span>
              <span className="font-semibold">{utilization}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full transition-all duration-500" style={{ width: `${Math.min(utilization, 100)}%` }} />
            </div>
            <p className="text-xs text-emerald-100">
              {lectures.length} lectures across {timeslots.length} available slots
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
