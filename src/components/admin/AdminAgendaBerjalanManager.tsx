import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Navigation,
  CheckCircle2,
  PlayCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Radio,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Megaphone,
  Save,
  Compass,
  AlertCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { RundownItem, Tokoh, MakamLokasi } from '../../types';
import { formatPerAgendaWAMessage, shareToWhatsApp } from '../../utils/whatsappShare';

export const AdminAgendaBerjalanManager: React.FC = () => {
  const {
    rundownList,
    tokohList,
    makamList,
    siteSettings,
    updateSiteSettings,
    setActiveRundownProgress,
    advanceRundownProgress,
    resetAllRundownStatus,
    setLiveBroadcastNote,
    ziarahMode,
    navigateTo,
    showToast,
  } = useApp();

  const [broadcastNote, setBroadcastNote] = useState(siteSettings.liveBroadcastNote || '');
  const [dayFilter, setDayFilter] = useState<number | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Map of Tokoh by ID
  const tokohMap = useMemo(() => {
    const map = new Map<string, Tokoh>();
    tokohList.forEach((t) => map.set(t.id, t));
    return map;
  }, [tokohList]);

  // Map of Makam by ID
  const makamMap = useMemo(() => {
    const map = new Map<string, MakamLokasi>();
    makamList.forEach((m) => map.set(m.id, m));
    return map;
  }, [makamList]);

  // Find currently active rundown item
  const activeItemIndex = useMemo(() => {
    const idx = rundownList.findIndex(
      (r) => r.id === siteSettings.activeRundownId || r.status === 'berlangsung'
    );
    return idx;
  }, [rundownList, siteSettings.activeRundownId]);

  const activeItem: RundownItem | undefined = activeItemIndex !== -1 ? rundownList[activeItemIndex] : undefined;
  const activeLocation = activeItem && activeItem.locationId ? makamMap.get(activeItem.locationId) : undefined;
  const activeFigures = activeItem?.figureIds?.map((id) => tokohMap.get(id)).filter(Boolean) as Tokoh[] || [];

  // Group days
  const days = useMemo(() => {
    const set = new Set<number>();
    rundownList.forEach((r) => set.add(r.dayNumber));
    return Array.from(set).sort((a, b) => a - b);
  }, [rundownList]);

  // Filtered list
  const filteredRundowns = useMemo(() => {
    return rundownList.filter((r) => {
      if (dayFilter !== 'all' && r.dayNumber !== dayFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchLoc = r.location.toLowerCase().includes(q);
        const matchAct = r.activity.toLowerCase().includes(q);
        return matchLoc || matchAct;
      }
      return true;
    });
  }, [rundownList, dayFilter, searchFilter]);

  const handleSaveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setLiveBroadcastNote(broadcastNote);
  };

  const handleToggleBanner = () => {
    const current = siteSettings.showActiveAgendaBanner !== false;
    updateSiteSettings({ showActiveAgendaBanner: !current });
    showToast(
      !current
        ? 'Banner agenda berjalan diaktifkan di beranda frontend.'
        : 'Banner agenda berjalan disembunyikan dari beranda.',
      'info'
    );
  };

  const handleToggleMode = (mode: 'manual' | 'auto') => {
    updateSiteSettings({ activeAgendaMode: mode });
    showToast(`Mode pelacakan diatur ke: ${mode === 'manual' ? 'Mode Manual Panitia' : 'Mode Otomatis Jam'}`);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg">
              <Navigation className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              Pengaturan Agenda Berjalan (Live Posisi Jamaah)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Tentukan titik maqbarah atau agenda yang sedang berlangsung saat ini. Memilih posisi sekarang akan otomatis mensinkronkan seluruh rundown (titik sebelumnya Selesai, titik sekarang Berlangsung, titik setelahnya Menunggu) dan menampilkan pelacak live di beranda bagi jamaah.
          </p>
        </div>

        <button
          onClick={() => navigateTo('beranda')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-700" />
          <span>Lihat Live Tracker Beranda</span>
        </button>
      </div>

      {/* 1. KARTU POSISI BERLANGSUNG SAAT INI (LIVE CONTROLLER) */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-7 border-2 border-amber-400 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
              POSISI AGENDA BERJALAN SAAT INI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-200 font-medium">Mode:</span>
            <div className="inline-flex rounded-lg bg-emerald-950/80 p-0.5 border border-emerald-700">
              <button
                onClick={() => handleToggleMode('manual')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                  siteSettings.activeAgendaMode !== 'auto'
                    ? 'bg-amber-400 text-emerald-950 shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Manual Panitia
              </button>
              <button
                onClick={() => handleToggleMode('auto')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                  siteSettings.activeAgendaMode === 'auto'
                    ? 'bg-amber-400 text-emerald-950 shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Otomatis Jam
              </button>
            </div>

            <button
              onClick={handleToggleBanner}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                siteSettings.showActiveAgendaBanner !== false
                  ? 'bg-emerald-800 text-emerald-100 border-emerald-600'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}
            >
              {siteSettings.showActiveAgendaBanner !== false ? 'Banner Beranda: Aktif' : 'Banner Beranda: Nonaktif'}
            </button>
          </div>
        </div>

        {/* Current Active Item Detail */}
        {activeItem ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold">
                  Titik ke-{activeItem.order || activeItemIndex + 1} dari {rundownList.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-200 font-semibold">
                  {activeItem.dayName} · {activeItem.date}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-semibold">
                  Hari ke-{activeItem.dayNumber}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
                  Nama Makam / Destinasi Saat Ini:
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-islamic text-white">
                  {activeItem.location}
                </h3>
              </div>

              {/* Linked Figures */}
              {activeFigures.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Tokoh Auliya' / Ulama' yang Diziarahi:</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {activeFigures.map((t) => (
                      <span
                        key={t.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/90 border border-emerald-700 text-xs font-semibold text-emerald-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{t.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timing */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100 pt-1">
                <div className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    Masuk: <strong className="text-white">{activeItem.timeIn || '-'}</strong> · Keluar:{' '}
                    <strong className="text-white">{activeItem.timeOut || '-'}</strong>
                  </span>
                </div>
                <div className="bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
                  Durasi: <strong className="text-amber-300">{activeItem.durationAtLocation || activeItem.duration}</strong>
                </div>
                {activeItem.travelDuration && activeItem.travelDuration !== '-' && (
                  <div className="bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
                    Di Jalan: <strong className="text-emerald-200">{activeItem.travelDuration}</strong>
                  </div>
                )}
              </div>

              {/* Activities */}
              <div className="text-xs text-emerald-200 bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-900/80">
                <span className="font-bold text-white">Kegiatan: </span>
                <span>{activeItem.activity}</span>
                {activeItem.subActivities && activeItem.subActivities.length > 0 && (
                  <span className="text-emerald-300 block mt-1">
                    Tambahan: {activeItem.subActivities.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Step Controls: Next / Prev */}
            <div className="bg-emerald-950/90 border border-emerald-800 rounded-xl p-4 space-y-3 flex flex-col justify-center">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 text-center block">
                Pengendali Cepat (1-Klik)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => advanceRundownProgress('prev')}
                  disabled={activeItemIndex <= 0}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Titik Lalu</span>
                </button>

                <button
                  onClick={() => advanceRundownProgress('next')}
                  disabled={activeItemIndex >= rundownList.length - 1}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
                >
                  <span>Lanjut Titik</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activeItem) {
                    const msg = formatPerAgendaWAMessage(activeItem, siteSettings, tokohList, makamList);
                    shareToWhatsApp(msg);
                    showToast(`Membuka WhatsApp untuk agenda "${activeItem.location}"`, 'success');
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer"
                title="Bagikan informasi titik aktif saat ini ke grup WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                <span>Share Posisi Ini ke WA</span>
              </button>

              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => resetAllRundownStatus('berikutnya')}
                  className="px-2.5 py-1 text-[11px] text-emerald-300 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                  title="Reset status semua agenda ke menunggu/belum dimulai"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Awal</span>
                </button>

                <button
                  onClick={() => resetAllRundownStatus('selesai')}
                  className="px-2.5 py-1 text-[11px] text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Tandai seluruh agenda ziarah selesai"
                >
                  <Check className="w-3 h-3" />
                  <span>Selesai Semua</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-emerald-950/70 border border-emerald-800 rounded-xl space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-semibold text-white">
              Belum ada titik rundown yang disetel sebagai "Sedang Berlangsung".
            </p>
            <p className="text-xs text-emerald-300 max-w-md mx-auto">
              Silakan pilih salah satu titik lokasi dari tabel di bawah ini dan klik tombol{' '}
              <strong>"Jadikan Posisi Berlangsung Sekarang"</strong> untuk mengaktifkannya.
            </p>
          </div>
        )}
      </div>

      {/* 2. BROADCAST PENGUMUMAN / CATATAN LANGSUNG UNTUK JAMAAH */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-emerald-800" />
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              Siaran Pengumuman Langsung Panitia (Live Broadcast)
            </h3>
            <p className="text-xs text-stone-500">
              Pesan ini akan tampil di bagian atas banner agenda berjalan untuk menginstruksikan para jamaah atau koordinator bus.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveBroadcast} className="space-y-3">
          <textarea
            value={broadcastNote}
            onChange={(e) => setBroadcastNote(e.target.value)}
            rows={2}
            placeholder="Contoh: Rombongan bus 1-10 saat ini sedang tahlil di maqbarah. Estimasi menuju bus pukul 11.30 WIB."
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-500 italic">
              *Akan langsung diperbarui di portal jamaah tanpa perlu muat ulang halaman.
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan & Siarkan Pengumuman</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. TABEL RUNDOWN LENGKAP: 1-KLIK SET POSISI SEKARANG (SINKRONISASI OTOMATIS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Pilih Titik Lokasi & Sinkronkan Status Rundown
            </h3>
            <p className="text-xs text-stone-500">
              Klik <strong>"Jadikan Posisi Sekarang"</strong> pada titik yang Anda tuju. Sistem akan otomatis menandai titik sebelum ini sebagai <em>Selesai</em>, titik ini sebagai <em>Berlangsung</em>, dan titik sesudahnya sebagai <em>Menunggu</em>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-800 font-medium"
            >
              <option value="all">Semua Hari ({rundownList.length} Titik)</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  Hari ke-{d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-12 text-center">Urutan</th>
                  <th className="py-3 px-3 w-32">Hari & Tanggal</th>
                  <th className="py-3 px-4">Nama Lokasi & Maqbarah</th>
                  <th className="py-3 px-3 w-40">Rencana Waktu</th>
                  <th className="py-3 px-3 w-28 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRundowns.map((item, idx) => {
                  const isCurrentActive =
                    item.id === siteSettings.activeRundownId || item.status === 'berlangsung';
                  const figures = item.figureIds?.map((id) => tokohMap.get(id)).filter(Boolean) as Tokoh[] || [];

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCurrentActive
                          ? 'bg-emerald-50/90 font-medium'
                          : 'hover:bg-stone-50/80'
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-mono font-bold text-stone-500">
                        {item.order || idx + 1}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-stone-900 block">Hari ke-{item.dayNumber}</span>
                        <span className="text-[11px] text-stone-500">{item.dayName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-stone-900 block">
                            {item.location}
                          </span>
                          {figures.length > 0 && (
                            <div className="text-[11px] text-emerald-800 line-clamp-1">
                              🕌 {figures.map((f) => f.name).join(', ')}
                            </div>
                          )}
                          <div className="text-[11px] text-stone-500 line-clamp-1">
                            {item.activity}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-stone-800">
                        <div className="space-y-0.5 text-[11px]">
                          <div>
                            Masuk: <strong className="text-stone-900">{item.timeIn || item.time.split('-')[0]?.trim()}</strong>
                          </div>
                          <div>
                            Keluar: <strong className="text-stone-900">{item.timeOut || item.time.split('-')[1]?.trim()}</strong>
                          </div>
                          <div className="text-amber-800 text-[10px]">
                            Durasi: {item.durationAtLocation || item.duration}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.status === 'selesai' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-300 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Selesai</span>
                          </span>
                        )}
                        {item.status === 'berlangsung' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-950 bg-amber-400 border border-amber-500 px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                            <Radio className="w-3 h-3 text-emerald-900" />
                            <span>Berlangsung</span>
                          </span>
                        )}
                        {item.status === 'berikutnya' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>Menunggu</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const msg = formatPerAgendaWAMessage(item, siteSettings, tokohList, makamList);
                              shareToWhatsApp(msg);
                              showToast(`Membuka WhatsApp untuk agenda "${item.location}"`, 'success');
                            }}
                            className="p-1.5 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                            title="Share agenda ini ke WA"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          {isCurrentActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-200/90 border border-emerald-400 rounded-lg">
                              <Check className="w-3.5 h-3.5 text-emerald-800" />
                              <span>Posisi Aktif Saat Ini</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setActiveRundownProgress(item.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-xs"
                            >
                              <span>Jadikan Posisi Sekarang</span>
                              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
