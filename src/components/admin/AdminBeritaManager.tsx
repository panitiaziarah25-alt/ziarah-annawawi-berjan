import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostItem } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Newspaper,
  AlertCircle,
  X,
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export const AdminBeritaManager: React.FC = () => {
  const { postsList, addPost, updatePost, deletePost, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<PostItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'berita' | 'pengumuman'>('berita');
  const [isPriority, setIsPriority] = useState(false);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Instruksi Panitia');
  const [author, setAuthor] = useState('Panitia Ziarah An-Nawawi');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setType('berita');
    setIsPriority(false);
    setImage('/src/assets/images/pesantren_berjan_gate_1794285627951.jpg');
    setCategory('Instruksi Panitia');
    setAuthor('Panitia Ziarah An-Nawawi');
    setSummary('');
    setContent('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PostItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setType(item.type);
    setIsPriority(!!item.isPriority);
    setImage(item.image);
    setCategory(item.category);
    setAuthor(item.author);
    setSummary(item.summary);
    setContent(item.content);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const today = new Date().toISOString().split('T')[0];

    const data = {
      title,
      slug: editingItem?.slug || slug || `post-${Date.now()}`,
      type,
      isPriority,
      image: image || '/src/assets/images/pesantren_berjan_gate_1794285627951.jpg',
      publishDate: editingItem?.publishDate || today,
      author,
      category,
      summary,
      content,
      status,
    };

    if (editingItem) {
      updatePost(editingItem.id, data);
    } else {
      addPost(data);
    }

    setIsModalOpen(false);
  };

  const filteredList = postsList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Berita & Pengumuman</h2>
          <p className="text-xs text-stone-500">
            Publikasikan warta safar dan pengumuman prioritas yang disematkan di beranda.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Konten Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul atau kategori..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">Judul Konten</th>
                <th className="py-3 px-4 font-semibold">Tipe & Kategori</th>
                <th className="py-3 px-4 font-semibold">Penulis</th>
                <th className="py-3 px-4 font-semibold">Tanggal</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-900 max-w-sm">
                    <div className="flex items-center gap-2">
                      {item.isPriority && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          PRIORITAS
                        </span>
                      )}
                      <span className="font-bold line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                    <span className="capitalize font-semibold">{item.type}</span> · {item.category}
                  </td>
                  <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                    {item.author}
                  </td>
                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap tabular-nums">
                    {item.publishDate}
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
                        onClick={() => navigateTo('berita-detail', item.slug)}
                        className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-md"
                        title="Pratinjau Pengunjung"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-stone-500 hover:text-blue-800 hover:bg-stone-100 rounded-md"
                        title="Edit Konten"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus "${item.title}"?`)) {
                            deletePost(item.id);
                          }
                        }}
                        className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-stone-100 rounded-md"
                        title="Hapus Konten"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                {editingItem ? 'Edit Konten Berita / Pengumuman' : 'Buat Konten Baru'}
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
                <label className="font-semibold text-stone-700">Judul Berita / Pengumuman</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pengumuman Titik Kumpul & Armada Bus..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Tipe Konten</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="berita">Berita (Warta Artikel)</option>
                    <option value="pengumuman">Pengumuman Resmi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Kategori</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Instruksi Panitia, Ubudiyyah, Logistik..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold text-xs text-amber-950">
                    Sematkan sebagai Pengumuman Prioritas di Beranda?
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Ringkasan Singkat (Lead)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk preview..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Isi Berita Lengkap</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  placeholder="Tuliskan isi warta atau instruksi resmi di sini..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="published">Terbit (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                </select>
              </div>

              {/* Foto Cover Berita dengan upload HP / Laptop & Kompresi Cloud */}
              <div className="pt-2 border-t border-stone-100">
                <ImageUploadField
                  label="Foto Sampul Berita / Lampiran Pengumuman"
                  value={image}
                  onChange={setImage}
                  description="Pilih foto sampul warta dari perangkat. Foto otomatis tersimpan di Cloud Firestore."
                  aspectRatioClass="aspect-16/9"
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
                  Simpan Konten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
