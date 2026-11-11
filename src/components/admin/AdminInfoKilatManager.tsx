import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Bookmark,
  Scroll,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const AdminInfoKilatManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast, ziarahMode } = useApp();

  // Local state initialized with current siteSettings values
  const [badge, setBadge] = useState(siteSettings.infoKilatBadge || 'Akses Cepat Jamaah & Direktori Safar');
  const [sectionTitle, setSectionTitle] = useState(siteSettings.infoKilatTitle || 'Pusat Navigasi & Informasi Kilat');
  const [sectionDesc, setSectionDesc] = useState(
    siteSettings.infoKilatDescription || 'Akses seluruh jadwal, rute makam, biografi tokoh, dan panduan safar ziarah dalam satu pintu.'
  );

  // Kartu Panjang Utama
  const [showLongNavCard, setShowLongNavCard] = useState(siteSettings.showLongNavCard !== false);
  const [longNavTitle, setLongNavTitle] = useState(
    siteSettings.longNavTitle || 'Direktori Seluruh Menu & Panduan Safar Ziarah An-Nawawi 2026'
  );
  const [longNavDesc, setLongNavDesc] = useState(
    siteSettings.longNavDescription ||
      'Buka jendela pop-up interaktif memuat seluruh navigasi safar: jadwal harian per hari, rundown jam di jalan, titik makam auliya\', biografi tokoh masyayikh, tuntunan Yasin & tahlil, info peserta, buku saku digital, dan warta resmi.'
  );
  const [longNavButtonText, setLongNavButtonText] = useState(siteSettings.longNavButtonText || 'Buka Pop-up Navigasi');

  // Chips Pilihan Data di Kartu Panjang
  const defaultChips = ['jadwal', 'rundown', 'makam', 'tokoh', 'doa', 'buku_saku', 'peserta'];
  const [selectedChips, setSelectedChips] = useState<string[]>(
    siteSettings.longNavChips && siteSettings.longNavChips.length > 0 ? siteSettings.longNavChips : defaultChips
  );

  // 4 Kartu Pintasan Kilat
  const [showKilatAgenda, setShowKilatAgenda] = useState(siteSettings.showKilatAgenda !== false);
  const [kilatAgendaTitle, setKilatAgendaTitle] = useState(siteSettings.kilatAgendaTitle || 'Agenda Ziarah');
  const [kilatAgendaDesc, setKilatAgendaDesc] = useState(
    siteSettings.kilatAgendaDesc || 'Timeline urutan safar per hari, rute maqbarah, jam tiba, dan peta transit.'
  );

  const [showKilatTokoh, setShowKilatTokoh] = useState(siteSettings.showKilatTokoh !== false);
  const [kilatTokohTitle, setKilatTokohTitle] = useState(siteSettings.kilatTokohTitle || 'Biografi Tokoh');
  const [kilatTokohDesc, setKilatTokohDesc] = useState(
    siteSettings.kilatTokohDesc || 'Kisah auliya\' shalihin, silsilah KH. Zarkasyi, dan masyayikh yang diziarahi.'
  );

  const [showKilatQuickSchedule, setShowKilatQuickSchedule] = useState(siteSettings.showKilatQuickSchedule !== false);
  const [kilatQuickScheduleTitle, setKilatQuickScheduleTitle] = useState(
    siteSettings.kilatQuickScheduleTitle || 'Pilih Agenda Hari'
  );
  const [kilatQuickScheduleDesc, setKilatQuickScheduleDesc] = useState(
    siteSettings.kilatQuickScheduleDesc || 'Pilih hari atau destinasi agenda, langsung diarahkan ke jadwal spesifik.'
  );

  const [showKilatDoa, setShowKilatDoa] = useState(siteSettings.showKilatDoa !== false);
  const [kilatDoaTitle, setKilatDoaTitle] = useState(siteSettings.kilatDoaTitle || 'Yasin & Doa Ziarah');
  const [kilatDoaDesc, setKilatDoaDesc] = useState(
    siteSettings.kilatDoaDesc || 'Teks Arab harakat, Latin & terjemahan Tawassul, Yasin, Tahlil, serta Doa Safar.'
  );

  const availableChips = [
    { id: 'jadwal', label: 'Jadwal Safar', icon: Calendar },
    { id: 'rundown', label: 'Rundown Waktu', icon: Clock },
    { id: 'makam', label: 'Lokasi Makam', icon: MapPin },
    { id: 'tokoh', label: 'Profil Tokoh', icon: Users },
    { id: 'doa', label: 'Doa & Tahlil', icon: BookOpen },
    { id: 'buku_saku', label: 'Buku Saku Digital', icon: Bookmark },
    { id: 'peserta', label: 'Info Peserta', icon: Scroll },
  ];

  const toggleChip = (id: string) => {
    if (selectedChips.includes(id)) {
      setSelectedChips(selectedChips.filter((c) => c !== id));
    } else {
      setSelectedChips([...selectedChips, id]);
    }
  };

  const handleSave = () => {
    updateSiteSettings({
      infoKilatBadge: badge,
      infoKilatTitle: sectionTitle,
      infoKilatDescription: sectionDesc,
      showLongNavCard,
      longNavTitle,
      longNavDescription: longNavDesc,
      longNavButtonText,
      longNavChips: selectedChips,
      showKilatAgenda,
      kilatAgendaTitle,
      kilatAgendaDesc,
      showKilatTokoh,
      kilatTokohTitle,
      kilatTokohDesc,
      showKilatQuickSchedule,
      kilatQuickScheduleTitle,
      kilatQuickScheduleDesc,
      showKilatDoa,
      kilatDoaTitle,
      kilatDoaDesc,
    });
    showToast('Pengaturan Pusat Navigasi & Info Kilat berhasil disimpan dan tersinkronisasi ke seluruh perangkat!', 'success');
  };

  const handleReset = () => {
    setBadge('Akses Cepat Jamaah & Direktori Safar');
    setSectionTitle('Pusat Navigasi & Informasi Kilat');
    setSectionDesc('Akses seluruh jadwal, rute makam, biografi tokoh, dan panduan safar ziarah dalam satu pintu.');
    setShowLongNavCard(true);
    setLongNavTitle('Direktori Seluruh Menu & Panduan Safar Ziarah An-Nawawi 2026');
    setLongNavDesc(
      'Buka jendela pop-up interaktif memuat seluruh navigasi safar: jadwal harian per hari, rundown jam di jalan, titik makam auliya\', biografi tokoh masyayikh, tuntunan Yasin & tahlil, info peserta, buku saku digital, dan warta resmi.'
    );
    setLongNavButtonText('Buka Pop-up Navigasi');
    setSelectedChips(defaultChips);
    setShowKilatAgenda(true);
    setKilatAgendaTitle('Agenda Ziarah');
    setKilatAgendaDesc('Timeline urutan safar per hari, rute maqbarah, jam tiba, dan peta transit.');
    setShowKilatTokoh(true);
    setKilatTokohTitle('Biografi Tokoh');
    setKilatTokohDesc('Kisah auliya\' shalihin, silsilah KH. Zarkasyi, dan masyayikh yang diziarahi.');
    setShowKilatQuickSchedule(true);
    setKilatQuickScheduleTitle('Pilih Agenda Hari');
    setKilatQuickScheduleDesc('Pilih hari atau destinasi agenda, langsung diarahkan ke jadwal spesifik.');
    setShowKilatDoa(true);
    setKilatDoaTitle('Yasin & Doa Ziarah');
    setKilatDoaDesc('Teks Arab harakat, Latin & terjemahan Tawassul, Yasin, Tahlil, serta Doa Safar.');
    showToast('Formulir direset ke pengaturan standar awal.', 'info');
  };

  const modeShort = ziarahMode === 'ngetan' ? 'Rute Ngetan' : 'Rute Ngulon';

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                Kelola Pusat Navigasi & Informasi Kilat
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Ubah nama, narasi, tombol pop-up, visibilitas (sembunyikan/tampilkan), dan data kartu kilat.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Awal</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Kolom (Kiri Form Pengaturan, Kanan Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KOLOM FORMULIR PENGATURAN (7 SPAN) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Header Bagian Info Kilat */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-800" />
              <h3 className="font-bold text-sm text-stone-900">
                1. Judul & Label Bagian (Seksi)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Label / Badge Kecil Atas
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  placeholder="Misal: Akses Cepat Jamaah & Direktori Safar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Seksi Utama
                </label>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                  placeholder="Misal: Pusat Navigasi & Informasi Kilat"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Keterangan Ringkas (Opsional)
                </label>
                <input
                  type="text"
                  value={sectionDesc}
                  onChange={(e) => setSectionDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  placeholder="Keterangan pendukung..."
                />
              </div>
            </div>
          </div>

          {/* 2. Kartu Panjang Pop-up Utama */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-800" />
                <h3 className="font-bold text-sm text-stone-900">
                  2. Kartu Panjang Pop-up Utama
                </h3>
              </div>

              {/* Toggle Sembunyikan / Tampilkan */}
              <button
                type="button"
                onClick={() => setShowLongNavCard(!showLongNavCard)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  showLongNavCard
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {showLongNavCard ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Ditampilkan</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-rose-700" />
                    <span>Disembunyikan</span>
                  </>
                )}
              </button>
            </div>

            {showLongNavCard ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama / Judul Kartu Panjang
                  </label>
                  <input
                    type="text"
                    value={longNavTitle}
                    onChange={(e) => setLongNavTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                    placeholder="Judul kartu panjang..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Narasi / Deskripsi Lengkap Kartu Panjang
                  </label>
                  <textarea
                    rows={3}
                    value={longNavDesc}
                    onChange={(e) => setLongNavDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                    placeholder="Deskripsi penjelasan isi pop-up..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Teks Tombol Pop-up
                  </label>
                  <input
                    type="text"
                    value={longNavButtonText}
                    onChange={(e) => setLongNavButtonText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-semibold"
                    placeholder="Misal: Buka Pop-up Navigasi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Pilihan Chip / Tag Data yang Ditampilkan di Kartu
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableChips.map((chip) => {
                      const Icon = chip.icon;
                      const isSelected = selectedChips.includes(chip.id);
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => toggleChip(chip.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <Icon className="w-3 h-3 text-amber-300" />
                          <span>{chip.label}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-300 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-center text-xs text-stone-500">
                Kartu panjang pop-up saat ini <strong>disembunyikan</strong> dari beranda jamaah.
              </div>
            )}
          </div>

          {/* 3. Empat Kartu Pintasan Kilat */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">
                3. Kelola 4 Kartu Pintasan Kilat (Nama, Narasi & Sembunyikan)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Atur judul, penjelasan teks, dan tampilkan/sembunyikan setiap kartu secara individual.
              </p>
            </div>

            <div className="space-y-4">
              {/* KARTU 1: AGENDA */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">Kartu 1: Agenda Safar</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKilatAgenda(!showKilatAgenda)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                      showKilatAgenda ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {showKilatAgenda ? 'Tampil' : 'Sembunyi'}
                  </button>
                </div>
                {showKilatAgenda && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Judul Kartu</label>
                      <input
                        type="text"
                        value={kilatAgendaTitle}
                        onChange={(e) => setKilatAgendaTitle(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Narasi / Keterangan</label>
                      <input
                        type="text"
                        value={kilatAgendaDesc}
                        onChange={(e) => setKilatAgendaDesc(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* KARTU 2: TOKOH */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">Kartu 2: Biografi Tokoh</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKilatTokoh(!showKilatTokoh)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                      showKilatTokoh ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {showKilatTokoh ? 'Tampil' : 'Sembunyi'}
                  </button>
                </div>
                {showKilatTokoh && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Judul Kartu</label>
                      <input
                        type="text"
                        value={kilatTokohTitle}
                        onChange={(e) => setKilatTokohTitle(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Narasi / Keterangan</label>
                      <input
                        type="text"
                        value={kilatTokohDesc}
                        onChange={(e) => setKilatTokohDesc(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* KARTU 3: PILIH JADWAL HARI */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">Kartu 3: Pilih Jadwal Hari</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKilatQuickSchedule(!showKilatQuickSchedule)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                      showKilatQuickSchedule ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {showKilatQuickSchedule ? 'Tampil' : 'Sembunyi'}
                  </button>
                </div>
                {showKilatQuickSchedule && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Judul Kartu</label>
                      <input
                        type="text"
                        value={kilatQuickScheduleTitle}
                        onChange={(e) => setKilatQuickScheduleTitle(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Narasi / Keterangan</label>
                      <input
                        type="text"
                        value={kilatQuickScheduleDesc}
                        onChange={(e) => setKilatQuickScheduleDesc(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* KARTU 4: YASIN & DOA */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center font-serif-islamic font-bold text-xs">
                      دعاء
                    </div>
                    <span className="font-bold text-xs text-stone-900">Kartu 4: Yasin & Doa Ziarah</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKilatDoa(!showKilatDoa)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                      showKilatDoa ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {showKilatDoa ? 'Tampil' : 'Sembunyi'}
                  </button>
                </div>
                {showKilatDoa && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Judul Kartu</label>
                      <input
                        type="text"
                        value={kilatDoaTitle}
                        onChange={(e) => setKilatDoaTitle(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Narasi / Keterangan</label>
                      <input
                        type="text"
                        value={kilatDoaDesc}
                        onChange={(e) => setKilatDoaDesc(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM PRATINJAU LANGSUNG (LIVE PREVIEW) (5 SPAN) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-stone-900 text-white rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  Pratinjau Tampilan Jamaah
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Mode: {modeShort}
              </span>
            </div>

            {/* Simulasi Tampilan Seksi */}
            <div className="bg-stone-50 text-stone-900 rounded-xl p-3.5 space-y-3 border border-stone-200">
              {/* Header Seksi */}
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                  {badge}
                </span>
                <h4 className="text-sm font-bold text-stone-900">{sectionTitle}</h4>
                {sectionDesc && <p className="text-[10px] text-stone-500 mt-0.5">{sectionDesc}</p>}
              </div>

              {/* Kartu Panjang Utama */}
              {showLongNavCard && (
                <div className="rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-3.5 space-y-2 border border-emerald-800 shadow-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                      Navigasi Pop-up
                    </span>
                    <span className="text-[9px] text-emerald-200 bg-emerald-900/80 px-2 py-0.5 rounded-full font-semibold">
                      {modeShort}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white leading-tight">{longNavTitle}</h5>
                  <p className="text-[10px] text-emerald-100/80 line-clamp-2 leading-relaxed">{longNavDesc}</p>

                  {/* Chips Pratinjau */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedChips.map((chipId) => {
                      const item = availableChips.find((c) => c.id === chipId);
                      if (!item) return null;
                      return (
                        <span
                          key={chipId}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/90 text-emerald-100 border border-emerald-700 flex items-center gap-1"
                        >
                          <span className="text-amber-300">·</span>
                          <span>{item.label}</span>
                        </span>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <span className="px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 font-bold text-[10px] flex items-center gap-1 shadow-xs">
                      <span>{longNavButtonText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}

              {/* 4 Kartu Pintasan Kilat */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {showKilatAgenda && (
                  <div className="p-2.5 rounded-lg border border-emerald-800/20 bg-white space-y-1">
                    <div className="w-5 h-5 rounded bg-emerald-800 text-amber-300 flex items-center justify-center">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <div className="text-[10px] font-bold text-stone-900 truncate">{kilatAgendaTitle}</div>
                    <div className="text-[9px] text-stone-500 line-clamp-1">{kilatAgendaDesc}</div>
                  </div>
                )}

                {showKilatTokoh && (
                  <div className="p-2.5 rounded-lg border border-emerald-800/20 bg-white space-y-1">
                    <div className="w-5 h-5 rounded bg-amber-600 text-white flex items-center justify-center">
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="text-[10px] font-bold text-stone-900 truncate">{kilatTokohTitle}</div>
                    <div className="text-[9px] text-stone-500 line-clamp-1">{kilatTokohDesc}</div>
                  </div>
                )}

                {showKilatQuickSchedule && (
                  <div className="p-2.5 rounded-lg border border-emerald-800/20 bg-white space-y-1">
                    <div className="w-5 h-5 rounded bg-sky-700 text-white flex items-center justify-center">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="text-[10px] font-bold text-stone-900 truncate">{kilatQuickScheduleTitle}</div>
                    <div className="text-[9px] text-stone-500 line-clamp-1">{kilatQuickScheduleDesc}</div>
                  </div>
                )}

                {showKilatDoa && (
                  <div className="p-2.5 rounded-lg border border-emerald-800/20 bg-white space-y-1">
                    <div className="w-5 h-5 rounded bg-emerald-900 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      دعاء
                    </div>
                    <div className="text-[10px] font-bold text-stone-900 truncate">{kilatDoaTitle}</div>
                    <div className="text-[9px] text-stone-500 line-clamp-1">{kilatDoaDesc}</div>
                  </div>
                )}
              </div>

              {!showLongNavCard && !showKilatAgenda && !showKilatTokoh && !showKilatQuickSchedule && !showKilatDoa && (
                <div className="p-4 text-center text-xs text-rose-600 bg-rose-50 rounded-lg">
                  Perhatian: Semua kartu kilat disembunyikan.
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
