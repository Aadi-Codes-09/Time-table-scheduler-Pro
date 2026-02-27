import { useState } from 'react';
import { Plus, Trash2, Building2, Search } from 'lucide-react';
import { getClassrooms, addClassroom, deleteClassroom } from '../store/db';

export function ClassroomPage() {
  const [classrooms, setClassrooms] = useState(getClassrooms());
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !capacity) return;
    addClassroom(name.trim(), parseInt(capacity));
    setClassrooms(getClassrooms());
    setName('');
    setCapacity('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this classroom?')) return;
    deleteClassroom(id);
    setClassrooms(getClassrooms());
  };

  const filtered = search
    ? classrooms.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : classrooms;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Classrooms</h1>
        <p className="text-slate-500 mt-1">Manage rooms and labs</p>
      </div>

      {/* Add form */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Room name (e.g., Room 101)..."
            autoFocus
            className="flex-1 min-w-[200px] max-w-xs px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
          <input
            type="number"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            placeholder="Capacity"
            min="1"
            className="w-32 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Save
          </button>
          <button
            type="button"
            onClick={() => { setIsAdding(false); setName(''); setCapacity(''); }}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-white border border-dashed border-slate-300 text-slate-600 font-medium rounded-xl hover:border-emerald-400 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Classroom
        </button>
      )}

      {/* Search */}
      {(classrooms.length > 3 || search.length > 0) && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search classrooms..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition shadow-sm"
          />
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center gap-3 hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 group animate-fadeIn"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-slate-800 block truncate">{c.name}</span>
              <span className="text-xs text-slate-500">Capacity: {c.capacity} seats</span>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {classrooms.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No classrooms yet</p>
          <p className="text-sm mt-1">Add your first classroom above</p>
        </div>
      )}

      {classrooms.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No results for "{search}"</p>
        </div>
      )}
    </div>
  );
}
