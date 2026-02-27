import { useState } from 'react';
import { Plus, Trash2, Users, Search } from 'lucide-react';
import { getFaculty, addFaculty, deleteFaculty } from '../store/db';

export function FacultyPage() {
  const [faculty, setFaculty] = useState(getFaculty());
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addFaculty(name.trim());
    setFaculty(getFaculty());
    setName('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this faculty member?')) return;
    deleteFaculty(id);
    setFaculty(getFaculty());
  };

  const filtered = search
    ? faculty.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : faculty;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Faculty</h1>
        <p className="text-slate-500 mt-1">Manage teaching staff members</p>
      </div>

      {/* Add form */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter faculty name..."
            autoFocus
            className="flex-1 min-w-[240px] max-w-md px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-200/50 transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Save
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setName(''); }}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-white border border-dashed border-slate-300 text-slate-600 font-medium rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Faculty
        </button>
      )}

      {/* Search */}
      {(faculty.length > 3 || search.length > 0) && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search faculty..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition shadow-sm"
          />
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f, i) => (
          <div
            key={f.id}
            className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center gap-3 hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 group animate-fadeIn"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0">
              <span className="text-indigo-600 font-bold text-sm">{f.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="flex-1 font-medium text-slate-800 truncate">{f.name}</span>
            <button
              onClick={() => handleDelete(f.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {faculty.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No faculty members yet</p>
          <p className="text-sm mt-1">Add your first faculty member above</p>
        </div>
      )}

      {faculty.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No results for "{search}"</p>
        </div>
      )}
    </div>
  );
}
