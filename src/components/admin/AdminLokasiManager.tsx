import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MakamLokasi } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  MapPin,
  Users,
  X,
  Check,
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export const AdminLokasiManager: React.FC = () => {
  const { makamList, tokohList, addMakam, updateMakam, deleteMakam, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<MakamLokasi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [address, setAddress] = useState('');
  const [regency, setRegency] = useState('Kabupaten Demak');
  const [district, setDistrict] = useState('Kecamatan Demak');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState('');
  const [figureIds, setFigureIds] = useState<string[]>([]);
  const [estimatedDuration, setEstimatedDuration] = useState('90 Menit');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [facilitiesStr, setFacilitiesStr] = useState('Masjid, Tempat Wudhu, Parkir Bus');
  const [mapsQuery, setMapsQuery] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setImage('/src/assets/images/makam_wali_kudus_1794285626298.jpg');
    setAddress('');
    setRegency('Kabupaten Demak');
    setDistrict('Kecamatan Demak');
    setDescription('');
    setHistory('');
    setFigureIds([]);
    setEstimatedDuration('90 Menit');
    setTechnicalNotes('');
    setFacilitiesStr('Masjid, Area Parkir Bus, Kamar Mandi');
    setMapsQuery('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MakamLokasi) => {
    setEditingItem(item);
    setName(item.name);
    setImage(item.image);
    setAddress(item.address);
    setRegency(item.regency);
    setDistrict(item.district);
    setDescription(item.description);
    setHistory(item.history);
    setFigureIds(item.figureIds || []);
    setEstimatedDuration(item.estimatedDuration);
    setTechnicalNotes(item.technicalNotes);
    setFacilitiesStr(item.facilities.join(', '));
    setMapsQuery(item.mapsQuery);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const facilities = facilitiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      name,
      slug: editingItem?.slug || slug || `lokasi-${Date.now()}`,
      image: image || '/src/assets/images/makam_wali_kudus_1794285626298.jpg',
      gallery: editingItem?.gallery || [image],
      address,
      regency,
      district,
      description,
      history,
      figureIds,
      estimatedDuration,
      technicalNotes,
      facilities,
      mapsQuery: mapsQuery || name + ' ' + regency,
      status,
    };

    if (editingItem) {
      updateMakam(editingItem.id, data);
    } else {
      addMakam(data);
    }

    setIsModalOpen(false);
  };

  const filteredList = makamList.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.regency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Lokasi Makam Ziarah</h2>
          <p className="text-xs text-stone-500">
            Kelola data maqbarah, tautan banyak tokoh yang dimakamkan, dan fasilitas peziarah.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lokasi Makam</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama makam atau wilayah..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
        />
      </div>

      {/* Table of Locations */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Nama Makam</th>
                <th className="py-3 px-4 font-semibold">Wilayah</th>
                <th className="py-3 px-4 font-semibold">Tokoh Terkait</th>
                <th className="py-3 px-4 font-semibold">Durasi</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((item) => {
                const figures = tokohList.filter((t) => item.figureIds.includes(t.id));
                return (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-900">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[11px] text-stone-500 line-clamp-1">{item.address}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      {item.regency}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {figures.length > 0
                          ? figures.map((f) => (
                              <span key={f.id} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                                {f.name}
                              </span>
                            ))
                          : '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap tabular-nums">
                      {item.estimatedDuration}
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
                          onClick={() => navigateTo('lokasi-detail', item.slug)}
                          className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-md"
                          title="Pratinjau Pengunjung"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-stone-500 hover:text-blue-800 hover:bg-stone-100 rounded-md"
                          title="Edit Makam"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus lokasi "${item.name}"?`)) {
                              deleteMakam(item.id);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-stone-100 rounded-md"
                          title="Hapus Makam"
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
                {editingItem ? 'Edit Lokasi Makam' : 'Tambah Lokasi Makam Baru'}
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
                <label className="font-semibold text-stone-700">Nama Lengkap Lokasi Makam</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Makam Sunan Kudus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Kabupaten / Kota</label>
                  <input
                    type="text"
                    value={regency}
                    onChange={(e) => setRegency(e.target.value)}
                    placeholder="Kabupaten Kudus"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Kecamatan</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kecamatan Kota"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Alamat Lengkap</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Menara, Kauman..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              {/* Multi-Figure Relation Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">
                  Tokoh yang Dimakamkan di Sini (Dapat memilih lebih dari satu tokoh)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2.5 border border-stone-200 rounded-lg bg-stone-50">
                  {tokohList.map((t) => (
                    <label key={t.id} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={figureIds.includes(t.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFigureIds([...figureIds, t.id]);
                          } else {
                            setFigureIds(figureIds.filter((id) => id !== t.id));
                          }
                        }}
                      />
                      <span className="truncate">{t.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Deskripsi Lokasi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Sejarah Tempat</label>
                <textarea
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Estimasi Durasi Kunjungan</label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="90 Menit"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Kueri Pencarian Google Maps</label>
                  <input
                    type="text"
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    placeholder="Makam Sunan Kudus"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Fasilitas (Pisahkan dengan tanda koma)</label>
                <input
                  type="text"
                  value={facilitiesStr}
                  onChange={(e) => setFacilitiesStr(e.target.value)}
                  placeholder="Masjid, Kamar Mandi, Ojek Wisata, Parkir Bus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Keterangan Teknis & Perlengkapan</label>
                <textarea
                  value={technicalNotes}
                  onChange={(e) => setTechnicalNotes(e.target.value)}
                  rows={2}
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

              {/* Foto Makam dengan upload HP / Laptop & Kompresi Cloud */}
              <div className="pt-2 border-t border-stone-100">
                <ImageUploadField
                  label="Foto Utama Makam / Kompleks Maqbarah"
                  value={image}
                  onChange={setImage}
                  description="Pilih foto gerbang/kubah/cungkup makam. Foto otomatis terkompresi dan tersimpan di database Cloud Firestore."
                  aspectRatioClass="aspect-16/10"
                  maxWidth={1000}
                  maxHeight={700}
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
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
