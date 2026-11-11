import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgendaItem } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Calendar,
  Clock,
  MapPin,
  X,
  Check,
} from 'lucide-react';

export const AdminAgendaManager: React.FC = () => {
  const { agendaList, makamList, tokohList, addAgenda, updateAgenda, deleteAgenda, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [dayName, setDayName] = useState('Selasa, 6 Oktober 2026');
  const [date, setDate] = useState('2026-10-06');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [locationId, setLocationId] = useState('');
  const [figureIds, setFigureIds] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [transitDuration, setTransitDuration] = useState('');
  const [travelNotes, setTravelNotes] = useState('');
  const [photo, setPhoto] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setDayNumber(1);
    setDayName('Selasa, 6 Oktober 2026');
    setDate('2026-10-06');
    setStartTime('08:00');
    setEndTime('10:00');
    setDurationMinutes(120);
    setLocationId(makamList[0]?.id || '');
    setFigureIds([]);
    setDescription('');
    setTechnicalNotes('');
    setSpecialNotes('');
    setTransitDuration('');
    setTravelNotes('');
    setPhoto('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (item: AgendaItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDayNumber(item.dayNumber);
    setDayName(item.dayName);
    setDate(item.date);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setDurationMinutes(item.durationMinutes);
    setLocationId(item.locationId || '');
    setFigureIds(item.figureIds || []);
    setDescription(item.description);
    setTechnicalNotes(item.technicalNotes || '');
    setSpecialNotes(item.specialNotes || '');
    setTransitDuration(item.transitDuration || '');
    setTravelNotes(item.travelNotes || '');
    setPhoto(item.photo || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const agendaData = {
      title,
      slug: editingItem?.slug || slug || `agenda-${Date.now()}`,
      dayNumber,
      dayName,
      date,
      startTime,
      endTime,
      durationMinutes,
      locationId: locationId || undefined,
      figureIds,
      description,
      technicalNotes,
      specialNotes,
      transitDuration: transitDuration || undefined,
      travelNotes: travelNotes || undefined,
      photo: photo || undefined,
      status,
    };

    if (editingItem) {
      updateAgenda(editingItem.id, agendaData);
    } else {
      addAgenda(agendaData);
    }

    setIsModalOpen(false);
  };

  const filteredList = agendaList.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.dayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Agenda Perjalanan</h2>
          <p className="text-xs text-stone-500">
            Atur rangkaian jadwal safar, relasi lokasi makam tujuan, dan tokoh auliya' terkait.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari agenda kegiatan..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
        />
      </div>

      {/* Table of Agendas */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Hari / Waktu</th>
                <th className="py-3 px-4 font-semibold">Judul Agenda</th>
                <th className="py-3 px-4 font-semibold">Lokasi Makam</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((item) => {
                const loc = makamList.find((m) => m.id === item.locationId);
                return (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-emerald-900 block">Hari ke-{item.dayNumber}</span>
                      <span className="text-stone-500 font-mono">{item.startTime} - {item.endTime}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900 max-w-xs">
                      <div className="font-bold line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{item.description}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      {loc ? loc.name : '-'}
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
                          onClick={() => navigateTo('agenda-detail', item.slug)}
                          className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-md"
                          title="Pratinjau Pengunjung"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-stone-500 hover:text-blue-800 hover:bg-stone-100 rounded-md"
                          title="Edit Agenda"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus agenda "${item.title}"?`)) {
                              deleteAgenda(item.id);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-stone-100 rounded-md"
                          title="Hapus Agenda"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-950 text-white">
              <h3 className="font-bold text-base">
                {editingItem ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
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
                <label className="font-semibold text-stone-700">Nama / Judul Agenda</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Ziarah Maqbarah Sunan Kalijaga"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Hari ke-</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={dayNumber}
                    onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Jam Mulai</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="08:00"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Jam Selesai</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="10:00"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Nama Hari & Tanggal Lengkap</label>
                  <input
                    type="text"
                    value={dayName}
                    onChange={(e) => setDayName(e.target.value)}
                    placeholder="Selasa, 6 Oktober 2026"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Relasi Lokasi Makam */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Hubungkan dengan Lokasi Makam</label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="">-- Tidak ada lokasi khusus --</option>
                  {makamList.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.regency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Relasi Multi Tokoh */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Tokoh Auliya' Terkait (Pilih opsi yang sesuai)</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-stone-200 rounded-lg bg-stone-50">
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

              {/* Deskripsi */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Deskripsi Rangkaian Kegiatan</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
                  required
                />
              </div>

              {/* Technical Notes */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Keterangan Teknis & Perlengkapan</label>
                <input
                  type="text"
                  value={technicalNotes}
                  onChange={(e) => setTechnicalNotes(e.target.value)}
                  placeholder="Contoh: Barisan per bus, membawa buku tahlil..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              {/* Status & Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="published">Terbitkan Langsung</option>
                    <option value="draft">Simpan sebagai Draf</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">URL Foto Sampul (Opsional)</label>
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="/src/assets/images/..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
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
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
