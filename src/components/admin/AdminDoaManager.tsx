import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DoaCategory, DoaVerse } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Languages,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const AdminDoaManager: React.FC = () => {
  const { doaList, addDoaCategory, updateDoaCategory, deleteDoaCategory, showToast } = useApp();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DoaCategory | null>(null);

  // Category Form State
  const [catTitle, setCatTitle] = useState('');
  const [catType, setCatType] = useState<DoaCategory['category']>('tahlil');
  const [catDesc, setCatDesc] = useState('');

  // Verse editing in active category
  const [activeCategoryId, setActiveCategoryId] = useState<string>(doaList[0]?.id || '');
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [editingVerseIndex, setEditingVerseIndex] = useState<number | null>(null);
  const [verseArabic, setVerseArabic] = useState('');
  const [verseLatin, setVerseLatin] = useState('');
  const [verseTranslation, setVerseTranslation] = useState('');
  const [verseNote, setVerseNote] = useState('');

  const activeCategory = doaList.find((c) => c.id === activeCategoryId) || doaList[0];

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatTitle('');
    setCatType('tahlil');
    setCatDesc('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: DoaCategory) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatType(cat.category);
    setCatDesc(cat.description);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) {
      showToast('Judul bab doa wajib diisi', 'error');
      return;
    }

    if (editingCategory) {
      updateDoaCategory(editingCategory.id, {
        title: catTitle.trim(),
        category: catType,
        description: catDesc.trim(),
      });
    } else {
      addDoaCategory({
        title: catTitle.trim(),
        category: catType,
        description: catDesc.trim(),
        verses: [
          {
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            latin: "Bismillaahir-rohmaanir-rohiim.",
            translation: 'Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang.',
          },
        ],
      });
    }

    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (cat: DoaCategory) => {
    if (doaList.length <= 1) {
      showToast('Minimal harus ada 1 bab bacaan doa dalam sistem', 'error');
      return;
    }
    if (window.confirm(`Hapus bab doa "${cat.title}"?`)) {
      deleteDoaCategory(cat.id);
      if (activeCategoryId === cat.id) {
        const remaining = doaList.filter((c) => c.id !== cat.id);
        if (remaining.length > 0) setActiveCategoryId(remaining[0].id);
      }
    }
  };

  // Verse operations
  const handleOpenAddVerse = () => {
    setEditingVerseIndex(null);
    setVerseArabic('');
    setVerseLatin('');
    setVerseTranslation('');
    setVerseNote('');
    setIsVerseModalOpen(true);
  };

  const handleOpenEditVerse = (verse: DoaVerse, index: number) => {
    setEditingVerseIndex(index);
    setVerseArabic(verse.arabic);
    setVerseLatin(verse.latin || '');
    setVerseTranslation(verse.translation);
    setVerseNote(verse.note || '');
    setIsVerseModalOpen(true);
  };

  const handleSaveVerse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verseArabic.trim() || !verseTranslation.trim()) {
      showToast('Teks Arab dan terjemahan Indonesia wajib diisi', 'error');
      return;
    }

    if (!activeCategory) return;

    const newVerse: DoaVerse = {
      arabic: verseArabic.trim(),
      latin: verseLatin.trim() || undefined,
      translation: verseTranslation.trim(),
      note: verseNote.trim() || undefined,
    };

    let updatedVerses = [...activeCategory.verses];
    if (editingVerseIndex !== null) {
      updatedVerses[editingVerseIndex] = newVerse;
    } else {
      updatedVerses.push(newVerse);
    }

    updateDoaCategory(activeCategory.id, { verses: updatedVerses });
    setIsVerseModalOpen(false);
    showToast(editingVerseIndex !== null ? 'Butir doa diperbarui' : 'Butir doa baru ditambahkan');
  };

  const handleDeleteVerse = (index: number) => {
    if (!activeCategory) return;
    if (window.confirm('Yakin ingin menghapus butir bacaan doa ini?')) {
      const updatedVerses = activeCategory.verses.filter((_, idx) => idx !== index);
      updateDoaCategory(activeCategory.id, { verses: updatedVerses });
      showToast('Butir doa telah dihapus');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Pengaturan Bacaan Doa, Yasin & Tahlil</h2>
          <p className="text-xs text-stone-500">
            Kelola bab amaliah ziarah, teks Arab berharakat, transliterasi Latin, terjemahan, dan catatan fadhilah.
          </p>
        </div>

        <button
          onClick={handleOpenAddCategory}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Tambah Bab Doa Baru</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2 px-1">
          Pilih Bab Doa yang Dikelola:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {doaList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeCategory?.id === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{cat.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory?.id === cat.id ? 'bg-emerald-950 text-amber-300' : 'bg-stone-200 text-stone-600'}`}>
                {cat.verses.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Detail & Verses */}
      {activeCategory && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300">
                  {activeCategory.category}
                </span>
                <h3 className="text-base font-bold text-stone-900 font-serif-islamic">
                  {activeCategory.title}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {activeCategory.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEditCategory(activeCategory)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Ubah Judul Bab</span>
              </button>
              <button
                onClick={() => handleDeleteCategory(activeCategory)}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="Hapus Bab Doa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Verses List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                Daftar Butir Bacaan ({activeCategory.verses.length} Butir)
              </span>
              <button
                onClick={handleOpenAddVerse}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>Tambah Butir Bacaan</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeCategory.verses.map((verse, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 hover:border-emerald-600/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 text-right">
                      <p className="font-arabic text-xl sm:text-2xl text-emerald-950 leading-loose">
                        {verse.arabic}
                      </p>
                    </div>
                  </div>

                  {verse.latin && (
                    <p className="text-xs font-medium text-emerald-900 italic font-serif pl-9">
                      "{verse.latin}"
                    </p>
                  )}

                  <p className="text-xs text-stone-700 leading-relaxed pl-9">
                    {verse.translation}
                  </p>

                  {verse.note && (
                    <div className="ml-9 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      Fadhilah: {verse.note}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => handleOpenEditVerse(verse, idx)}
                      className="p-1 text-stone-600 hover:text-emerald-800 hover:bg-stone-200 rounded cursor-pointer"
                      title="Edit Butir"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVerse(idx)}
                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Hapus Butir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-stone-900">
                {editingCategory ? 'Ubah Bab Doa' : 'Tambah Bab Doa Baru'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Judul Bab Doa</label>
                <input
                  type="text"
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  placeholder="Contoh: Bacaan Ratib Al-Haddad"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Kategori</label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as DoaCategory['category'])}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                >
                  <option value="safar">Doa Safar Perjalanan</option>
                  <option value="niat">Niat & Masuk Maqbarah</option>
                  <option value="tawassul">Tawassul & Hadhrat</option>
                  <option value="yasin">Surat Yasin</option>
                  <option value="tahlil">Tahlil Lengkap</option>
                  <option value="doa_ziarah">Doa Ziarah Kubur</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Keterangan / Momen Dibaca</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Contoh: Dibaca saat berada di cungkup makam..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Bab Doa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Verse */}
      {isVerseModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-stone-900">
                {editingVerseIndex !== null ? 'Edit Butir Bacaan Doa' : 'Tambah Butir Bacaan Doa'}
              </h3>
              <button
                onClick={() => setIsVerseModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVerse} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Teks Arab Berharakat</label>
                <textarea
                  value={verseArabic}
                  onChange={(e) => setVerseArabic(e.target.value)}
                  placeholder="Ketik atau paste teks Arab berharakat..."
                  rows={3}
                  dir="rtl"
                  className="w-full px-3 py-2 text-sm font-arabic bg-stone-50 border border-stone-300 rounded-lg text-emerald-950"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Transliterasi Latin</label>
                <input
                  type="text"
                  value={verseLatin}
                  onChange={(e) => setVerseLatin(e.target.value)}
                  placeholder="Contoh: Bismillaahir-rohmaanir-rohiim..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Terjemahan Bahasa Indonesia</label>
                <textarea
                  value={verseTranslation}
                  onChange={(e) => setVerseTranslation(e.target.value)}
                  placeholder="Artinya: ..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Catatan / Fadhilah (Opsional)</label>
                <input
                  type="text"
                  value={verseNote}
                  onChange={(e) => setVerseNote(e.target.value)}
                  placeholder="Contoh: Dibaca 3 kali sebelum beranjak..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsVerseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Butir Bacaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
