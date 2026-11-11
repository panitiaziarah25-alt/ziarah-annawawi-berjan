import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BukuSakuChapter } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  CheckCircle2,
  Bookmark,
  FileText,
} from 'lucide-react';

export const AdminBukuSakuManager: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    bukuSakuChapters,
    addBukuSakuChapter,
    updateBukuSakuChapter,
    deleteBukuSakuChapter,
    setIsBukuSakuOpen,
    showToast,
  } = useApp();

  const [bookTitle, setBookTitle] = useState(siteSettings.pocketBookTitle);
  const [bookUrl, setBookUrl] = useState(siteSettings.pocketBookUrl || '');

  // Chapter Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChap, setEditingChap] = useState<BukuSakuChapter | null>(null);
  const [chapNum, setChapNum] = useState<number>(1);
  const [chapTitle, setChapTitle] = useState('');
  const [chapSub, setChapSub] = useState('');
  const [chapContent, setChapContent] = useState('');
  const [chapArabic, setChapArabic] = useState('');
  const [chapNotes, setChapNotes] = useState('');

  const handleSaveBookSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      pocketBookTitle: bookTitle,
      pocketBookUrl: bookUrl,
    });
    showToast('Pengaturan Buku Saku berhasil disimpan');
  };

  const handleOpenAddChapter = () => {
    setEditingChap(null);
    setChapNum(bukuSakuChapters.length + 1);
    setChapTitle('');
    setChapSub('');
    setChapContent('');
    setChapArabic('');
    setChapNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditChapter = (chap: BukuSakuChapter) => {
    setEditingChap(chap);
    setChapNum(chap.chapterNumber);
    setChapTitle(chap.title);
    setChapSub(chap.subtitle);
    setChapContent(chap.content);
    setChapArabic(chap.arabicSnippet || '');
    setChapNotes(chap.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapTitle.trim() || !chapContent.trim()) {
      showToast('Judul dan isi bab wajib diisi', 'error');
      return;
    }

    if (editingChap) {
      updateBukuSakuChapter(editingChap.id, {
        chapterNumber: Number(chapNum) || 1,
        title: chapTitle.trim(),
        subtitle: chapSub.trim(),
        content: chapContent.trim(),
        arabicSnippet: chapArabic.trim() || undefined,
        notes: chapNotes.trim() || undefined,
      });
    } else {
      addBukuSakuChapter({
        chapterNumber: Number(chapNum) || bukuSakuChapters.length + 1,
        title: chapTitle.trim(),
        subtitle: chapSub.trim(),
        content: chapContent.trim(),
        arabicSnippet: chapArabic.trim() || undefined,
        notes: chapNotes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteChapter = (chap: BukuSakuChapter) => {
    if (bukuSakuChapters.length <= 1) {
      showToast('Buku saku minimal harus memiliki 1 bab', 'error');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus ${chap.title}?`)) {
      deleteBukuSakuChapter(chap.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Pengaturan Buku Saku Digital Ziarah</h2>
          <p className="text-xs text-stone-500">
            Kelola judul buku saku, isi bab panduan, kutipan dalil Arab, serta pratinjau tampilan bagi peserta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBukuSakuOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Test Preview Modal</span>
          </button>
          <button
            onClick={handleOpenAddChapter}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Tambah Bab Baru</span>
          </button>
        </div>
      </div>

      {/* Book Metadata Settings Form */}
      <form onSubmit={handleSaveBookSettings} className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
          <Bookmark className="w-4 h-4 text-emerald-700" />
          <span>Informasi Identitas Buku Saku</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Judul Utama Buku Saku</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Tautan Berkas PDF (Opsional)</label>
            <input
              type="text"
              value={bookUrl}
              onChange={(e) => setBookUrl(e.target.value)}
              placeholder="https://... atau /documents/buku-saku.pdf"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Identitas Buku</span>
          </button>
        </div>
      </form>

      {/* Chapters Management Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
            Daftar Bab Buku Saku ({bukuSakuChapters.length} Bab)
          </h4>
        </div>

        <div className="divide-y divide-stone-100">
          {bukuSakuChapters.map((chap) => (
            <div key={chap.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-900">
                    Bab {chap.chapterNumber}
                  </span>
                  <h5 className="font-bold text-sm text-stone-900 truncate">
                    {chap.title}
                  </h5>
                </div>
                <p className="text-xs text-stone-500 truncate">
                  {chap.subtitle}
                </p>
                <p className="text-xs text-stone-600 line-clamp-2 font-serif pt-1">
                  {chap.content}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEditChapter(chap)}
                  className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                  title="Edit Bab"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteChapter(chap)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Hapus Bab"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Chapter */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingChap ? 'Edit Bab Buku Saku' : 'Tambah Bab Buku Saku'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nomor Bab</label>
                  <input
                    type="number"
                    value={chapNum}
                    onChange={(e) => setChapNum(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    min={1}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Judul Bab</label>
                  <input
                    type="text"
                    value={chapTitle}
                    onChange={(e) => setChapTitle(e.target.value)}
                    placeholder="Contoh: Bab I: Fadlilah Ziarah..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Subjudul / Pokok Bahasan</label>
                <input
                  type="text"
                  value={chapSub}
                  onChange={(e) => setChapSub(e.target.value)}
                  placeholder="Contoh: Menyambung Tali Mahabbah Spiritual..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Kutipan Dalil Arab (Opsional)</label>
                <textarea
                  value={chapArabic}
                  onChange={(e) => setChapArabic(e.target.value)}
                  placeholder="Teks hadits / ayat Al-Quran..."
                  rows={2}
                  dir="rtl"
                  className="w-full px-3 py-2 text-sm font-arabic bg-stone-50 border border-stone-300 rounded-lg text-emerald-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Isi Lengkap Bab</label>
                <textarea
                  value={chapContent}
                  onChange={(e) => setChapContent(e.target.value)}
                  placeholder="Tulis uraian panduan bab ini..."
                  rows={5}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Catatan Khusus (Opsional)</label>
                <input
                  type="text"
                  value={chapNotes}
                  onChange={(e) => setChapNotes(e.target.value)}
                  placeholder="Contoh: Dianjurkan membaca fatihah khusus..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Bab Buku Saku</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
