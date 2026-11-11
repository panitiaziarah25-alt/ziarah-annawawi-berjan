import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Download, Bookmark, Printer, ChevronRight, ChevronLeft, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const BukuSakuModal: React.FC = () => {
  const { isBukuSakuOpen, setIsBukuSakuOpen, siteSettings, bukuSakuChapters, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'preview' | 'download'>('preview');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

  if (!isBukuSakuOpen) return null;

  const currentChapter = bukuSakuChapters[selectedChapterIndex] || bukuSakuChapters[0];

  const handleDownload = () => {
    window.print();
    showToast('Membuka dialog cetak / simpan ke format PDF Buku Saku...', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-stone-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-4 sm:p-6 border-b border-emerald-900 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
              Buku Saku Digital Resmi
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif-islamic text-white">
              {siteSettings.pocketBookTitle}
            </h3>
            <p className="text-xs text-emerald-200">
              {siteSettings.organizer} · Tahun {siteSettings.yearMasehi} / {siteSettings.yearHijriah}
            </p>
          </div>
          <button
            onClick={() => setIsBukuSakuOpen(false)}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg cursor-pointer hover:bg-emerald-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'border-emerald-800 text-emerald-900 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Preview & Baca Isi Bab</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'download'
                ? 'border-emerald-800 text-emerald-900 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Download & Cetak PDF</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-stone-800 space-y-4">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              {/* Chapter Pill Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {bukuSakuChapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => setSelectedChapterIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      selectedChapterIndex === idx
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    Bab {chap.chapterNumber}
                  </button>
                ))}
              </div>

              {/* Active Chapter Card */}
              {currentChapter && (
                <div className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      Bab {currentChapter.chapterNumber}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-950 font-serif-islamic">
                      {currentChapter.title}
                    </h4>
                    <p className="text-xs text-stone-600 font-medium">
                      {currentChapter.subtitle}
                    </p>
                  </div>

                  {/* Arabic quote if available */}
                  {currentChapter.arabicSnippet && (
                    <div className="p-4 bg-emerald-950 text-white rounded-xl text-center space-y-1 border border-emerald-800 my-2">
                      <p className="font-arabic text-lg sm:text-xl text-amber-300 leading-loose">
                        {currentChapter.arabicSnippet}
                      </p>
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif whitespace-pre-line pt-2">
                    {currentChapter.content}
                  </div>

                  {currentChapter.notes && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
                      <strong className="block font-semibold">Catatan Khusus Panitia:</strong>
                      <span>{currentChapter.notes}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Prev / Next chapter controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={selectedChapterIndex === 0}
                  onClick={() => setSelectedChapterIndex((p) => Math.max(0, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 disabled:opacity-30 border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Bab Sebelumnya</span>
                </button>
                <span className="text-xs text-stone-500 font-medium">
                  Bab {selectedChapterIndex + 1} dari {bukuSakuChapters.length}
                </span>
                <button
                  disabled={selectedChapterIndex === bukuSakuChapters.length - 1}
                  onClick={() => setSelectedChapterIndex((p) => Math.min(bukuSakuChapters.length - 1, p + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 disabled:opacity-30 border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  <span>Bab Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* TAB DOWNLOAD & CETAK PDF */
            <div className="space-y-4">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <FileText className="w-5 h-5 text-emerald-800" />
                  <span>Dokumen Siap Cetak (Edisi Format Saku)</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-serif">
                  Buku saku ini diformat khusus agar nyaman dibaca di layar HP maupun dicetak secara mandiri. File mencakup doa safar, istighatsah tahlil, silsilah masyayikh Berjan, tata tertib 10 armada bus, dan kontak darurat.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <h5 className="font-bold text-stone-900">Spesifikasi Dokumen:</h5>
                <ul className="space-y-1.5 text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Format: PDF / Cetak Lembar A5 Booklet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Jumlah Bab: {bukuSakuChapters.length} Bab Lengkap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Tashih: Majelis Ubudiyyah Pondok Pesantren An-Nawawi Berjan</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Cetak / Unduh PDF Buku Saku</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 truncate">
            Format resmi Pondok Pesantren An-Nawawi Berjan Purworejo
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh PDF</span>
            </button>
            <button
              onClick={() => setIsBukuSakuOpen(false)}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
