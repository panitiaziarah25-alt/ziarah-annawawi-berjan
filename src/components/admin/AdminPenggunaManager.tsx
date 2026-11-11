import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { Users, Plus, Trash2, Shield, UserCheck, X } from 'lucide-react';

export const AdminPenggunaManager: React.FC = () => {
  const { users, currentUser, addUser, updateUserRole, deleteUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('editor');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      username: username.toLowerCase().trim(),
      name,
      email,
      role,
    });
    setIsModalOpen(false);
    setUsername('');
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Manajemen Hak Akses & Pengguna</h2>
          <p className="text-xs text-stone-500">
            Kelola role pengguna WordPress: Super Admin (Akses Penuh), Admin Acara, dan Editor Publikasi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
          <span className="font-bold text-xs text-emerald-900 block">1. Super Admin</span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Akses tak terbatas untuk mengelola seluruh konten, manajemen akun panitia, dan pengaturan inti website ziarah.
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
          <span className="font-bold text-xs text-amber-900 block">2. Admin Ziarah</span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Berwenang mengelola seluruh agenda perjalanan, rundown waktu, lokasi makam, data tokoh, dan dokumentasi.
          </p>
        </div>
        <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
          <span className="font-bold text-xs text-sky-900 block">3. Editor Publikasi</span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Berwenang membuat warta berita, artikel, dan pengumuman teknis safar tanpa akses ke konfigurasi sistem.
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
              <th className="py-3 px-4 font-semibold">Nama & Username</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Peran (Role)</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => {
              const isCurrent = currentUser?.id === u.id;
              return (
                <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">
                          {u.name} {isCurrent && <span className="text-emerald-700 font-semibold">(Anda)</span>}
                        </div>
                        <div className="text-[11px] text-stone-400">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                      className="px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-semibold capitalize"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin Ziarah</option>
                      <option value="editor">Editor Publikasi</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!isCurrent && users.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus pengguna ${u.name}?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-950 text-white">
              <h3 className="font-bold text-base">Tambah Pengguna / Panitia Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ust. Fulan..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Username Login</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="fulan_berjan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fulan@annawawi-berjan.id"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Tingkat Peran (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="super_admin">Super Admin (Akses Penuh)</option>
                  <option value="admin">Admin Ziarah (Acara, Rundown & Makam)</option>
                  <option value="editor">Editor Publikasi (Berita & Informasi)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
                >
                  Tambahkan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
