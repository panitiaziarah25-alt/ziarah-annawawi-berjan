import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { DownloadableDoc } from '../../types';
import {
  Bus,
  Clock,
  MapPin,
  Utensils,
  ShieldAlert,
  Briefcase,
  HeartPulse,
  Phone,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Users,
  MessageCircle,
  X,
  Search,
  Printer,
  AlertCircle,
} from 'lucide-react';

export const InformasiPesertaView: React.FC = () => {
  const {
    participantInfo,
    siteSettings,
    downloadableDocs,
    panitiaList,
    previewDoc,
    openPreviewDoc,
    closePreviewDoc,
    showToast,
  } = useApp();

  const [panitiaSearch, setPanitiaSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  const filteredPanitia = panitiaList
    .filter((p) => {
      if (selectedDivision === 'all') return true;
      return p.division === selectedDivision;
    })
    .filter((p) => {
      if (!panitiaSearch.trim()) return true;
      const q = panitiaSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    });

  const handleDownloadDoc = (doc: DownloadableDoc) => {
    window.print();
    showToast(`Membuka berkas "${doc.title}" untuk diunduh / dicetak...`, 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-10 w-full max-w-full overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Informasi Peserta & Panitia' }]} />

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-emerald-950 text-white p-6 sm:p-10 border border-emerald-900 shadow-md">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <span className="inline-block text-[11px] font-bold text-amber-300 uppercase tracking-widest">
            Pusat Informasi Jamaah Satu Pintu
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif-islamic font-bold leading-tight text-white">
            Informasi Peserta, Berkas & Susunan Panitia
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Petunjuk operasional safar ziarah, unduh berkas resmi, pembagian armada bus, tata tertib, perlengkapan, dan direktori lengkap nomor kontak panitia.
          </p>
        </div>
      </div>

      {/* Maklumat / Himbauan Resmi Panitia dari Admin */}
      {siteSettings.participantNoticeNarration && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Maklumat Resmi Panitia Safar
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {siteSettings.participantNoticeNarration}
            </p>
          </div>
        </div>
      )}

      {/* 1. BAGIAN BERKAS DOKUMEN RESMI (DOWNLOAD & PREVIEW) */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <FileText className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Berkas & Dokumen Resmi Perjalanan (Download & Preview)
              </h2>
              <p className="text-xs text-stone-500">
                Unduh atau baca langsung dokumen resmi ziarah tanpa perlu aplikasi tambahan
              </p>
            </div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md font-semibold shrink-0">
            {downloadableDocs.length} Dokumen Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {downloadableDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-stone-50/90 rounded-xl border border-stone-200 hover:border-emerald-600/40 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {doc.fileSize}
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-600 line-clamp-2">
                  {doc.description}
                </p>
                <div className="text-[10px] text-stone-400">
                  Diperbarui: {doc.uploadedAt}
                </div>
              </div>

              {/* Action Buttons: Preview & Download */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-200/70">
                <button
                  type="button"
                  onClick={() => openPreviewDoc(doc)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Preview / Baca</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(doc)}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
                  title="Unduh Berkas PDF"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. MODAL PREVIEW DOKUMEN BILA SEDANG DIBUKA */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-stone-200 shadow-2xl flex flex-col">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-amber-300 shrink-0" />
                <div className="truncate">
                  <h4 className="font-bold text-sm text-white truncate">
                    {previewDoc.title}
                  </h4>
                  <span className="text-[10px] text-emerald-300">
                    {previewDoc.fileName} · {previewDoc.fileSize}
                  </span>
                </div>
              </div>
              <button
                onClick={closePreviewDoc}
                className="text-emerald-200 hover:text-white p-1 rounded-md cursor-pointer ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif whitespace-pre-line bg-stone-50">
              {previewDoc.previewContent || previewDoc.description}
            </div>

            <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-stone-500">
                Dokumen Resmi Pesantren An-Nawawi Berjan
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDoc(previewDoc)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={closePreviewDoc}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUSUNAN PANITIA PELAKSANA LENGKAP & HOTLINE WHATSAPP */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <Users className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Susunan Panitia Pelaksana & Kontak Langsung
              </h2>
              <p className="text-xs text-stone-500">
                Daftar lengkap nomor HP dan WhatsApp panitia yang dapat dihubungi peserta
              </p>
            </div>
          </div>

          {/* Division Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium"
            >
              <option value="all">Semua Divisi ({panitiaList.length})</option>
              <option value="pengarah">Pengarah & Penasihat</option>
              <option value="inti">Pengurus Inti</option>
              <option value="acara">Seksi Acara</option>
              <option value="transportasi">Seksi Transportasi</option>
              <option value="kesehatan">Seksi Medis & Kesehatan</option>
              <option value="ubudiyyah">Seksi Ubudiyyah</option>
              <option value="konsumsi">Seksi Konsumsi</option>
              <option value="dokumentasi">Seksi Dokumentasi</option>
            </select>
          </div>
        </div>

        {/* Panitia Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPanitia.map((p) => (
            <div
              key={p.id}
              className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200 space-y-2 hover:border-emerald-600/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {p.position}
                  </span>
                  <div className="font-bold text-xs sm:text-sm text-stone-900">
                    {p.name}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                  {p.name.charAt(0)}
                </div>
              </div>

              {p.description && (
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {p.description}
                </p>
              )}

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-700 font-mono">
                  {p.phone}
                </span>
                <a
                  href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                  title="Hubungi WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-amber-300" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Jadwal Keberangkatan & Titik Kumpul */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 border-b border-stone-100 pb-3">
          <Clock className="w-5 h-5 text-amber-500 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Jadwal Keberangkatan & Titik Kumpul
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl space-y-2">
            <span className="font-semibold text-emerald-950 block text-xs uppercase tracking-wider">
              Titik Kumpul Utama
            </span>
            <div className="flex items-start gap-2 text-stone-800">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="font-bold">{participantInfo.departureSchedule.meetingPoint}</span>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              {participantInfo.departureSchedule.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-600">Waktu Kumpul & Manifes:</span>
              <strong className="text-emerald-900 font-bold tabular-nums">
                {participantInfo.departureSchedule.assemblyTime}
              </strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-600">Apel & Pelepasan Armada:</span>
              <strong className="text-emerald-900 font-bold tabular-nums">
                {participantInfo.departureSchedule.departureTime}
              </strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-600">Estimasi Kepulangan:</span>
              <strong className="text-emerald-900 font-bold tabular-nums">
                {participantInfo.departureSchedule.returnEstimate}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Informasi Kendaraan & Armada Bus */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <Bus className="w-5 h-5 text-amber-500 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Daftar Armada Bus & Koordinator
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Total {participantInfo.busFleets.length} Unit Bus Eksekutif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {participantInfo.busFleets.map((bus, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-emerald-900">{bus.busNumber}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                  {bus.capacity}
                </span>
              </div>
              <div className="text-xs text-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Koordinator:</span>
                  <span className="font-semibold text-stone-900">{bus.coordinator}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Kontak:</span>
                  <a
                    href={`https://wa.me/${bus.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-mono"
                  >
                    {bus.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Ketentuan, Barang Bawaan & Kesehatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Checklist Barang Bawaan */}
        <section className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 border-b border-stone-100 pb-2">
            <Briefcase className="w-5 h-5 text-amber-500 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-stone-900">Daftar Barang Bawaan Wajib</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-700">
            {participantInfo.luggageChecklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Informasi Kesehatan & Medis */}
        <section className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 border-b border-stone-100 pb-2">
            <HeartPulse className="w-5 h-5 text-rose-500 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-stone-900">Kesehatan & Ambulans 24 Jam</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-700">
            {participantInfo.healthAndSafety.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
