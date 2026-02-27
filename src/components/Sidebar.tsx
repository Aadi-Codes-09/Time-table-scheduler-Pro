import { LayoutDashboard, Users, Building2, Layers, CalendarPlus, CalendarDays, Clock, LogOut, GraduationCap, X, type LucideIcon } from 'lucide-react';

export type Page = 'dashboard' | 'faculty' | 'classroom' | 'division' | 'timeslots' | 'schedule' | 'timetable';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { page: Page; label: string; icon: LucideIcon; section?: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
  { page: 'faculty', label: 'Faculty', icon: Users, section: 'Management' },
  { page: 'classroom', label: 'Classrooms', icon: Building2 },
  { page: 'division', label: 'Divisions', icon: Layers },
  { page: 'timeslots', label: 'Time Slots', icon: Clock },
  { page: 'schedule', label: 'Schedule', icon: CalendarPlus, section: 'Planning' },
  { page: 'timetable', label: 'Timetable', icon: CalendarDays },
];

export function Sidebar({ currentPage, onNavigate, onLogout, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
        min-h-screen flex flex-col border-r border-white/[0.06]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">TimeTable</h2>
              <p className="text-slate-500 text-[11px] font-medium">Scheduler Pro</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-1 space-y-0.5">
          {navItems.map(({ page, label, icon: Icon, section }) => (
            <div key={page}>
              {section && (
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.15em] px-3 mt-5 mb-2">{section}</p>
              )}
              <button
                onClick={() => { onNavigate(page); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === page
                    ? 'bg-indigo-500/20'
                    : 'group-hover:bg-white/[0.06]'
                }`}>
                  <Icon className={`w-[18px] h-[18px] ${
                    currentPage === page ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                </div>
                <span className="text-[13px] font-medium">{label}</span>
                {currentPage === page && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-red-500/10 transition">
              <LogOut className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
