import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tokoh } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  User,
  MapPin,
  X,
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export const AdminTokohManager: React.FC = () => {
  const { tokohList, makamList, addTokoh, updateTokoh, deleteTokoh, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<Tokoh | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [titleOrHonorific, setTitleOrHonorific] = useState('');
  const [photo, setPhoto] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [biography, setBiography] = useState('');
  const [genealogy, setGenealogy] = useState('');
  const [education, setEducation] = useState('');
  const [strugglesAndContributions, setStrugglesAndContributions] = useState('');
  const [worksAndLegacy, setWorksAndLegacy] = useState('');
  const [tombLocationId, setTombLocationId] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setTitleOrHonorific('');
    setPhoto('/src/assets/images/ulama_ziarah_doa_1794285627516.jpg');
    setBirthYear('');
    setDeathYear('');
    setBiography('');
    setGenealogy('');
    setEducation('');
    setStrugglesAndContributions('');
    setWorksAndLegacy('');
    setTombLocationId(makamList[0]?.id || '');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Tokoh) => {
    setEditingItem(item);
    setName(item.name);
    setTitleOrHonorific(item.titleOrHonorific);
    setPhoto(item.photo);
    setBirthYear(item.birthYear || '');
    setDeathYear(item.deathYear || '');
    setBiography(item.biography);
    setGenealogy(item.genealogy || '');
    setEducation(item.education || '');
    setStrugglesAndContributions(item.strugglesAndContributions || '');
    setWorksAndLegacy(item.worksAndLegacy || '');
    setTombLocationId(item.tombLocationId || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const data = {
      name,
      titleOrHonorific,
      slug: editingItem?.slug || slug || `tokoh-${Date.now()}`,
      photo: photo || '/src/assets/images/ulama_ziarah_doa_1794285627516.jpg',
      birthYear,
      deathYear,
      biography,
      genealogy,
      education,
      strugglesAndContributions,
      worksAndLegacy,
      tombLocationId,
      status,
    };

    if (editingItem) {
      updateTokoh(editingItem.id, data);
    } else {
      addTokoh(data);
    }

    setIsModalOpen(false);
  };

  const filteredList = tokohList.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.titleOrHonorific.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Profil Tokoh Auliya' & Ulama'</h2>
          <p className="text-xs text-stone-500">
            Kelola biografi, silsilah nasab, karya warisan, dan tautan pusara pemakaman.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tokoh Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama tokoh atau gelar..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Nama Tokoh</th>
                <th className="py-3 px-4 font-semibold">Gelar / Sebutan</th>
                <th className="py-3 px-4 font-semibold">Lokasi Makam</th>
                <th className="py-3 px-4 font-semibold">Masa Hidup</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((item) => {
                const loc = makamList.find((m) => m.id === item.tombLocationId);
                return (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-stone-300"
                        />
                        <span className="font-bold">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                      {item.titleOrHonorific}
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      {loc ? loc.name : '-'}
                    </td>
                    <td className="py-3 px-4 text-stone-500 whitespace-nowrap tabular-nums">
                      {item.birthYear || '?'} - {item.deathYear || '?'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('tokoh-detail', item.slug)}
                          className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-md"
                          title="Pratinjau Pengunjung"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-stone-500 hover:text-blue-800 hover:bg-stone-100 rounded-md"
                          title="Edit Tokoh"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus data tokoh "${item.name}"?`)) {
                              deleteTokoh(item.id);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-stone-100 rounded-md"
                          title="Hapus Tokoh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-950 text-white">
              <h3 className="font-bold text-base">
                {editingItem ? 'Edit Profil Tokoh' : 'Tambah Profil Tokoh Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nama Lengkap Tokoh</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kanjeng Sunan Kudus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Gelar / Sebutan Kehormatan</label>
                <input
                  type="text"
                  value={titleOrHonorific}
                  onChange={(e) => setTitleOrHonorific(e.target.value)}
                  placeholder="Contoh: Raden Ja'far Shodiq / Waliyul 'Ilmi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tahun Kelahiran</label>
                  <input
                    type="text"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="± 1400 M"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tahun Kewafatan</label>
                  <input
                    type="text"
                    value={deathYear}
                    onChange={(e) => setDeathYear(e.target.value)}
                    placeholder="1550 M"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Tautan Lokasi Makam */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Lokasi Makam Beliau</label>
                <select
                  value={tombLocationId}
                  onChange={(e) => setTombLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="">-- Pilih Lokasi Makam --</option>
                  {makamList.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.regency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Riwayat Kehidupan (Biografi)</label>
                <textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Silsilah / Nasab Keluarga</label>
                <textarea
                  value={genealogy}
                  onChange={(e) => setGenealogy(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Riwayat Pendidikan</label>
                <textarea
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Perjuangan, Dakwah & Kontribusi</label>
                <textarea
                  value={strugglesAndContributions}
                  onChange={(e) => setStrugglesAndContributions(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Karya Kitab / Peninggalan</label>
                <input
                  type="text"
                  value={worksAndLegacy}
                  onChange={(e) => setWorksAndLegacy(e.target.value)}
                  placeholder="Menara Kudus, Falsafah Moh Limo, Kitab..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Status Publikasi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="published">Terbit (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                </select>
              </div>

              {/* Foto Tokoh dengan upload HP / Laptop & Kompresi Cloud */}
              <div className="pt-2 border-t border-stone-100">
                <ImageUploadField
                  label="Foto Profil Tokoh / Ulama'"
                  value={photo}
                  onChange={setPhoto}
                  description="Pilih foto dari galeri HP atau komputer. Foto otomatis terkompresi dan tersinkronisasi instan ke seluruh perangkat."
                  aspectRatioClass="aspect-square max-w-[150px]"
                  maxWidth={600}
                  maxHeight={600}
                />
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
                  Simpan Tokoh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
