import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentationItem } from '../../types';
import { Plus, Trash2, Image, Video, X } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export const AdminDokumentasiManager: React.FC = () => {
  const { documentationList, makamList, addDocumentation, deleteDocumentation } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'foto' | 'video'>('foto');
  const [mediaUrl, setMediaUrl] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [locationId, setLocationId] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('6 Oktober 2026');

  const openAddModal = () => {
    setTitle('');
    setType('foto');
    setMediaUrl('/src/assets/images/ulama_ziarah_doa_1794285627516.jpg');
    setDayNumber(1);
    setLocationId(makamList[0]?.id || '');
    setCaption('');
    setDate('6 Oktober 2026');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addDocumentation({
      title,
      type,
      mediaUrl: mediaUrl || '/src/assets/images/ulama_ziarah_doa_1794285627516.jpg',
      dayNumber,
      locationId: locationId || undefined,
      caption,
      date,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Dokumentasi Media</h2>
          <p className="text-xs text-stone-500">
            Unggah foto dokumentasi safar dan tautan video liputan ziarah santri.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi Baru</span>
        </button>
      </div>

      {/* Grid of documentation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentationList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 bg-stone-900">
              <img
                src={item.thumbnailUrl || item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                {item.type === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                <span>{item.type === 'video' ? 'Video' : 'Foto'}</span>
              </span>
              <span className="absolute top-2 right-2 bg-emerald-900 text-white text-[11px] px-2 py-0.5 rounded font-medium">
                Hari ke-{item.dayNumber}
              </span>
            </div>

            <div className="p-3.5 space-y-2">
              <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-stone-500 line-clamp-2">{item.caption}</p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">{item.date}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus dokumentasi "${item.title}"?`)) {
                      deleteDocumentation(item.id);
                    }
                  }}
                  className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                  title="Hapus Media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-emerald-950 text-white">
              <h3 className="font-bold text-base">Tambah Media Dokumentasi</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Judul Dokumentasi</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Doa Bersama di Maqbarah Sunan Kudus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tipe Media</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="foto">Foto</option>
                    <option value="video">Tautan Video</option>
                  </select>
                </div>
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
              </div>

              {type === 'foto' ? (
                <div className="pt-2 border-t border-stone-100">
                  <ImageUploadField
                    label="Unggah Foto Dokumentasi"
                    value={mediaUrl}
                    onChange={setMediaUrl}
                    description="Pilih foto dari kamera atau galeri HP. Foto terkompresi otomatis dan disinkronkan ke Cloud Firestore."
                    aspectRatioClass="aspect-16/10"
                    maxWidth={1000}
                    maxHeight={700}
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">URL / Tautan Video (YouTube/Drive)</label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau https://..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Keterangan / Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
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
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
