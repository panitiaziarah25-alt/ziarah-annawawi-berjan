import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  BookOpen,
  Share2,
  Printer,
  Sparkles,
  Search,
  Type,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const DoaView: React.FC = () => {
  const { doaList, openShareModal, showToast, siteSettings } = useApp();

  const [activeDoaId, setActiveDoaId] = useState<string>(doaList[0]?.id || 'doa-safar');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  const activeDoa = doaList.find((d) => d.id === activeDoaId) || doaList[0];

  const arabicFontSizeClass = {
    normal: 'text-xl sm:text-2xl leading-loose',
    large: 'text-2xl sm:text-3xl leading-loose',
    xlarge: 'text-3xl sm:text-4xl leading-loose font-bold',
  }[fontSizeLevel];

  const handleCopyDoa = () => {
    if (!activeDoa) return;
    const textToCopy = `${activeDoa.title}\n\n${activeDoa.verses
      .map((v) => `${v.arabic}\n${v.latin ? `(${v.latin})\n` : ''}${v.translation}`)
      .join('\n\n')}\n\nSumber: Panduan Doa Ziarah An-Nawawi 2026`;

    navigator.clipboard.writeText(textToCopy);
    showToast('Teks doa berhasil disalin ke clipboard!', 'success');
  };

  const handleShareDoa = () => {
    if (!activeDoa) return;
    openShareModal({
      title: activeDoa.title,
      summary: activeDoa.description,
      url: `${window.location.origin}/#/doa`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="no-print">
        <Breadcrumb items={[{ label: 'Doa & Amaliah Ziarah' }]} />
      </div>

      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buku Doa & Amaliah Digital</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-islamic font-bold text-white">
              Yasin, Tahlil, Tawassul & Doa Ziarah
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-light">
              {siteSettings.doaIntroductionNarration ||
                "Tuntunan bacaan doa resmi Pondok Pesantren An-Nawawi Berjan Purworejo untuk safar ziarah makam Auliya', Ulama', dan Pejuang."}
            </p>
          </div>

          <div className="flex items-center gap-2 no-print shrink-0">
            <button
              onClick={() => window.print()}
              className="p-2 text-emerald-200 hover:text-white bg-emerald-900/80 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors cursor-pointer"
              title="Cetak Teks Doa"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyDoa}
              className="p-2 text-emerald-200 hover:text-white bg-emerald-900/80 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors cursor-pointer"
              title="Salin Teks Doa"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareDoa}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. DAFTAR LENGKAP BACAAN DOA & AMALIAH (LIST VERTIKAL / GRID - JELAS TERLIHAT SEMUA JAMAAH) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-3 no-print">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-xs sm:text-sm text-stone-900">
              Daftar Urutan Tuntunan Doa & Amaliah Ziarah
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            Total: {doaList.length} Bacaan
          </span>
        </div>

        {/* Grid List Doa Vertikal & Rapi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {doaList.map((d, index) => {
            const isSelected = activeDoa?.id === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setActiveDoaId(d.id);
                  // Smooth scroll into reading pane
                  const el = document.getElementById('bacaan-doa-container');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                    : 'border-stone-200 bg-stone-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 text-stone-800'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-amber-400 text-emerald-950 font-black'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs leading-snug truncate">
                    {d.title}
                  </div>
                  <p
                    className={`text-[11px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-emerald-100' : 'text-stone-500'
                    }`}
                  >
                    {d.description || `${d.verses.length} bait/ayat doa`}
                  </p>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-amber-300 shrink-0 self-center" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Reader Controls Toolbar (Font Resizer & Latin/Terjemah Toggles) */}
      <div id="bacaan-doa-container" className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        {/* Doa Aktif Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Sedang Dibaca:
          </span>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 truncate max-w-[220px] sm:max-w-xs">
            {activeDoa?.title}
          </span>
        </div>

        {/* Display Adjusters */}
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-2 py-1 rounded font-bold cursor-pointer ${
                fontSizeLevel === 'normal' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
              }`}
              title="Ukuran Standar"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-2 py-1 rounded font-bold text-sm cursor-pointer ${
                fontSizeLevel === 'large' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
              }`}
              title="Ukuran Sedang"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-2 py-1 rounded font-bold text-base cursor-pointer ${
                fontSizeLevel === 'xlarge' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
              }`}
              title="Ukuran Besar"
            >
              A++
            </button>
          </div>

          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
              showLatin ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            Latin: {showLatin ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
              showTranslation ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            Arti: {showTranslation ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Doa Reading Area */}
      {activeDoa ? (
        <article className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Amaliah Ziarah An-Nawawi
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-islamic font-bold text-stone-900 mt-1">
              {activeDoa.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              {activeDoa.description}
            </p>
          </div>

          {/* Verses List */}
          <div className="space-y-10 divide-y divide-stone-100">
            {activeDoa.verses.map((verse, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-8 space-y-4' : 'space-y-4'}>
                {/* Arabic Text (Right-to-left, dignified font) */}
                <div
                  dir="rtl"
                  className={`font-arabic text-stone-900 text-right ${arabicFontSizeClass} tracking-wide select-text`}
                >
                  {verse.arabic}
                </div>

                {/* Transliteration Latin */}
                {showLatin && verse.latin && (
                  <div className="text-xs sm:text-sm text-emerald-900/90 font-serif italic bg-emerald-50/60 p-3 rounded-lg border border-emerald-100/60 leading-relaxed">
                    <span className="font-sans font-semibold not-italic text-emerald-950 text-xs block mb-0.5">
                      Transliterasi Latin:
                    </span>
                    {verse.latin}
                  </div>
                )}

                {/* Indonesian Translation */}
                {showTranslation && (
                  <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif pl-3 border-l-2 border-amber-400">
                    <span className="font-sans font-semibold text-stone-900 text-xs block mb-0.5">
                      Artinya:
                    </span>
                    {verse.translation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigasi Cepat: Doa Sebelumnya & Doa Berikutnya */}
          {(() => {
            const currentIdx = doaList.findIndex((d) => d.id === activeDoa.id);
            const prevDoa = currentIdx > 0 ? doaList[currentIdx - 1] : null;
            const nextDoa = currentIdx < doaList.length - 1 ? doaList[currentIdx + 1] : null;

            return (
              <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
                {prevDoa ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDoaId(prevDoa.id);
                      document.getElementById('bacaan-doa-container')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3 rounded-xl border border-stone-200 hover:border-emerald-600 bg-stone-50 hover:bg-emerald-50/50 transition-colors text-left flex items-center gap-2.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-emerald-800 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">
                        Bacaan Sebelumnya:
                      </span>
                      <span className="text-xs font-bold text-stone-900 truncate block">
                        {prevDoa.title}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextDoa ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDoaId(nextDoa.id);
                      document.getElementById('bacaan-doa-container')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3 rounded-xl border border-emerald-300 hover:border-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 transition-colors text-right flex items-center justify-end gap-2.5 cursor-pointer sm:col-start-2 shadow-xs"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                        Lanjut ke Bacaan Berikutnya:
                      </span>
                      <span className="text-xs font-bold text-emerald-950 truncate block">
                        {nextDoa.title}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-emerald-800 shrink-0" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            );
          })()}

          {/* Bottom Bar: Tawassul & Surah Reference Note */}
          <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl">
            <span>
              Tuntunan resmi Majelis Ubudiyyah Pondok Pesantren An-Nawawi Berjan Purworejo.
            </span>
            <button
              onClick={handleCopyDoa}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Semua Teks Doa Ini</span>
            </button>
          </div>
        </article>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center text-xs text-stone-500">
          Pilih salah satu menu doa di atas.
        </div>
      )}
    </div>
  );
};
