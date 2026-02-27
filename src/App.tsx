import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar, type Page } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FacultyPage } from './components/FacultyPage';
import { ClassroomPage } from './components/ClassroomPage';
import { DivisionPage } from './components/DivisionPage';
import { TimeslotPage } from './components/TimeslotPage';
import { SchedulePage } from './components/SchedulePage';
import { TimetablePage } from './components/TimetablePage';
import { seedData, getLectures, getFaculty, getClassrooms, getDivisions, getTimeslots } from './store/db';
import { Bell, User, Menu } from 'lucide-react';

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  faculty: 'Faculty Management',
  classroom: 'Classroom Management',
  division: 'Division Management',
  timeslots: 'Time Slot Configuration',
  schedule: 'Schedule Lecture',
  timetable: 'Timetable View',
};

const PAGE_DESCRIPTIONS: Record<Page, string> = {
  dashboard: 'System overview & statistics',
  faculty: 'Add and manage faculty members',
  classroom: 'Configure rooms and labs',
  division: 'Manage class divisions',
  timeslots: 'Set up available time slots',
  schedule: 'Create and assign lectures',
  timetable: 'View weekly schedule grid',
};

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    seedData();
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setRefreshKey(k => k + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard key={refreshKey} />;
      case 'faculty': return <FacultyPage key={refreshKey} />;
      case 'classroom': return <ClassroomPage key={refreshKey} />;
      case 'division': return <DivisionPage key={refreshKey} />;
      case 'timeslots': return <TimeslotPage key={refreshKey} />;
      case 'schedule': return <SchedulePage key={refreshKey} />;
      case 'timetable': return <TimetablePage key={refreshKey} />;
      default: return <Dashboard key={refreshKey} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={() => setIsLoggedIn(false)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">{PAGE_TITLES[currentPage]}</h2>
              <p className="text-xs text-slate-400 hidden sm:block">{PAGE_DESCRIPTIONS[currentPage]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition relative"
              >
                <Bell className="w-5 h-5" />
                {getLectures().length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>

              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/60 p-4 z-50 max-h-96 overflow-y-auto animate-fadeIn">
                  <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Recent Schedules</h3>
                  {getLectures().length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No lectures scheduled yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {[...getLectures()].reverse().slice(0, 5).map(lecture => {
                        const f = getFaculty().find(x => x.id === lecture.facultyId);
                        const c = getClassrooms().find(x => x.id === lecture.classroomId);
                        const d = getDivisions().find(x => x.id === lecture.divisionId);
                        const t = getTimeslots().find(x => x.id === lecture.timeslotId);
                        return (
                          <div key={lecture.id} className="text-sm border-l-2 border-indigo-500 pl-3">
                            <p className="font-semibold text-slate-800">{lecture.subject}</p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {f?.name} • {c?.name} • {d?.name}
                            </p>
                            <p className="text-indigo-600 text-[10px] font-medium mt-1">
                              {t?.day}, {t?.start} - {t?.end}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-slate-700 block leading-tight">Admin</span>
                <span className="text-[10px] text-slate-400">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-slate-200/60 bg-white/50">
          <p className="text-xs text-slate-400 text-center">
            Timetable Scheduler © 2026 • College Admin System
          </p>
        </footer>
      </div>
    </div>
  );
}
