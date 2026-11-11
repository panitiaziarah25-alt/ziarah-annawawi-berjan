import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Image, Check, Sparkles, Upload, Clock, Calendar } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export const AdminMediaBrandManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, agendaList, showToast } = useApp();

  const [logoUrl, setLogoUrl] = useState(siteSettings.logoUrl || '');
  const [heroImageUrl, setHeroImageUrl] = useState(siteSettings.heroImageUrl);
  const [eventDates, setEventDates] = useState(siteSettings.eventDates);
  const [eventTimeStart, setEventTimeStart] = useState(siteSettings.eventTimeStart);
  const [eventCountdownTarget, setEventCountdownTarget] = useState(siteSettings.eventCountdownTarget);
  const [pocketBookTitle, setPocketBookTitle] = useState(siteSettings.pocketBookTitle);
  const [pocketBookUrl, setPocketBookUrl] = useState(siteSettings.pocketBookUrl || '');

  // Live Active Agenda Banner Settings
  const [showActiveAgendaBanner, setShowActiveAgendaBanner] = useState<boolean>(
    siteSettings.showActiveAgendaBanner !== false
  );
  const [activeAgendaMode, setActiveAgendaMode] = useState<'auto' | 'manual'>(
    siteSettings.activeAgendaMode || 'auto'
  );
  const [manualActiveAgendaId, setManualActiveAgendaId] = useState<string>(
    siteSettings.manualActiveAgendaId || (agendaList[0]?.id || '')
  );

  React.useEffect(() => {
    setLogoUrl(siteSettings.logoUrl || '');
    setHeroImageUrl(siteSettings.heroImageUrl);
    setEventDates(siteSettings.eventDates);
    setEventTimeStart(siteSettings.eventTimeStart);
    setEventCountdownTarget(siteSettings.eventCountdownTarget);
    setPocketBookTitle(siteSettings.pocketBookTitle);
    setPocketBookUrl(siteSettings.pocketBookUrl || '');
    setShowActiveAgendaBanner(siteSettings.showActiveAgendaBanner !== false);
    setActiveAgendaMode(siteSettings.activeAgendaMode || 'auto');
    if (siteSettings.manualActiveAgendaId) {
      setManualActiveAgendaId(siteSettings.manualActiveAgendaId);
    }
  }, [siteSettings]);

  const availableImagePresets = [
    { label: 'Pesantren Berjan Gerbang', url: '/src/assets/images/pesantren_berjan_gate_1794285627951.jpg' },
    { label: 'Masjid & Kubah Hijau', url: '/src/assets/images/hero_ziarah_annawawi_1794285626739.jpg' },
    { label: 'Menara & Makam Kudus', url: '/src/assets/images/makam_wali_kudus_1794285626298.jpg' },
    { label: 'Jamaah Doa Santri', url: '/src/assets/images/ulama_ziarah_doa_1794285627516.jpg' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      logoUrl,
      heroImageUrl,
      eventDates,
      eventTimeStart,
      eventCountdownTarget,
      pocketBookTitle,
      pocketBookUrl,
      showActiveAgendaBanner,
      activeAgendaMode,
      manualActiveAgendaId,
    });
    showToast('Aset gambar, banner agenda berlangsung, dan jadwal berhasil diperbarui!', 'success');
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Logo, Banner & Jadwal Dominan</h2>
          <p className="text-xs text-stone-500">
            Atur gambar logo pesantren, foto banner hero, teks tanggal/jam pelaksanaan yang tampil besar di atas.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Aset</span>
        </button>
      </div>

      {/* 0. PENGATURAN BANNER AGENDA YANG SEDANG BERLANGSUNG (LIVE ACTIVE AGENDA) */}
      <div className="bg-white rounded-xl border-2 border-emerald-700/30 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Banner Jadwal Agenda yang Sedang Berlangsung di Beranda</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Menampilkan kartu ringkas agenda aktif (nama makam, tokoh, lokasi, waktu, durasi & tombol detail) di halaman utama.
            </p>
          </div>

          {/* Toggle Switch Tampilkan / Hilangkan */}
          <label className="flex items-center gap-2.5 cursor-pointer bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 shrink-0">
            <input
              type="checkbox"
              checked={showActiveAgendaBanner}
              onChange={(e) => setShowActiveAgendaBanner(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-stone-800">
              {showActiveAgendaBanner ? 'Fitur Tampil di Beranda' : 'Fitur Disembunyikan'}
            </span>
          </label>
        </div>

        {showActiveAgendaBanner && (
          <div className="space-y-4 pt-1 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
            {/* Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Mode Penentuan Agenda Aktif:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setActiveAgendaMode('auto')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    activeAgendaMode === 'auto'
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="agenda_mode"
                    checked={activeAgendaMode === 'auto'}
                    onChange={() => setActiveAgendaMode('auto')}
                    className="mt-0.5 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Mode Otomatis (Real-Time)</div>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                      Sistem otomatis mencocokkan agenda yang berlangsung sesuai jam & tanggal sekarang.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setActiveAgendaMode('manual')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    activeAgendaMode === 'manual'
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="agenda_mode"
                    checked={activeAgendaMode === 'manual'}
                    onChange={() => setActiveAgendaMode('manual')}
                    className="mt-0.5 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Mode Manual (Pilihan Admin)</div>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                      Admin menentukan sendiri secara langsung agenda mana yang sedang aktif saat ini.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Dropdown if manual mode */}
            {activeAgendaMode === 'manual' && (
              <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
                <label className="text-xs font-bold text-stone-800 block">
                  Pilih Agenda yang Sedang Berlangsung:
                </label>
                <select
                  value={manualActiveAgendaId}
                  onChange={(e) => setManualActiveAgendaId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600"
                >
                  {agendaList.map((agenda) => (
                    <option key={agenda.id} value={agenda.id}>
                      [Hari {agenda.dayNumber} · {agenda.startTime}-{agenda.endTime}] {agenda.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-800">
                  Agenda yang dipilih di atas akan langsung ditampilkan di beranda sebagai agenda yang sedang berlangsung.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Pengaturan Tanggal & Jam Pelaksanaan yang Tampil Besar di Atas */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>Pengaturan Tanggal & Jam Pelaksanaan Resmi</span>
        </h3>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Teks Tanggal Pelaksanaan Besar</label>
          <input
            type="text"
            value={eventDates}
            onChange={(e) => setEventDates(e.target.value)}
            placeholder="Selasa - Jumat, 6 - 9 Oktober 2026 M / 24 - 28 Rabi'ul Awwal 1448 H"
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-900"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Jam Mulai Pelaksanaan (WIB)</label>
            <input
              type="text"
              value={eventTimeStart}
              onChange={(e) => setEventTimeStart(e.target.value)}
              placeholder="06:00 WIB"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-900"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Target Tanggal Countdown (ISO Format)</label>
            <input
              type="text"
              value={eventCountdownTarget}
              onChange={(e) => setEventCountdownTarget(e.target.value)}
              placeholder="2026-10-06T06:00:00"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Pengaturan Logo & Banner Gambar */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
          <Image className="w-4 h-4 text-emerald-700" />
          <span>Gambar Logo & Foto Banner Utama</span>
        </h3>

        {/* Logo input */}
        <ImageUploadField
          label="Logo Pondok Pesantren An-Nawawi (Opsional)"
          value={logoUrl}
          onChange={setLogoUrl}
          description="Kosongkan jika ingin memakai monogram huruf 'AN' bawaan. Foto logo otomatis terkompresi dan tersinkron ke semua perangkat."
          placeholder="https://... atau pilih foto logo dari perangkat"
          aspectRatioClass="aspect-square max-w-[140px]"
          maxWidth={400}
          maxHeight={400}
        />

        {/* Hero image input */}
        <div className="pt-4 border-t border-stone-100">
          <ImageUploadField
            label="Foto Banner Hero Beranda"
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            description="Banner utama di bagian paling atas beranda. Disarankan foto lanskap/horizontal pemandangan pesantren atau makam."
            placeholder="/src/assets/images/... atau pilih foto dari HP"
            aspectRatioClass="aspect-16/9"
            maxWidth={1200}
            maxHeight={800}
            presets={availableImagePresets}
          />
        </div>
      </div>

      {/* 3. Pengaturan Buku Saku Ziarah */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Pengaturan Buku Saku Ziarah Digital</span>
        </h3>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Judul Buku Saku</label>
          <input
            type="text"
            value={pocketBookTitle}
            onChange={(e) => setPocketBookTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Tautan Berkas PDF / Download (Opsional)</label>
          <input
            type="text"
            value={pocketBookUrl}
            onChange={(e) => setPocketBookUrl(e.target.value)}
            placeholder="https://... atau nama berkas PDF"
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
          />
        </div>
      </div>
    </form>
  );
};
