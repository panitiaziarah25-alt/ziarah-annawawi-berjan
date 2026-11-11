import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Users,
  Compass,
  AlertCircle,
  Share2,
  Phone,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  Scroll,
  Printer,
  Eye,
  CheckCircle2,
  X,
  Bus,
  Navigation,
  Radio,
  Megaphone,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    siteSettings,
    rundownList,
    agendaList,
    makamList,
    tokohList,
    postsList,
    doaList,
    documentationList,
    navigateTo,
    openShareModal,
    openLightbox,
    setIsBukuSakuOpen,
    setIsNavModalOpen,
    ziarahMode,
  } = useApp();

  const priorityPost = postsList.find((p) => p.isPriority && p.status === 'published');
  const publishedPosts = postsList.filter((p) => p.status === 'published');
  const publishedMakam = makamList.filter((m) => m.status === 'published');
  const publishedTokoh = tokohList.filter((t) => t.status === 'published');
  const nextAgenda = agendaList.filter((a) => a.status === 'published').slice(0, 4);

  // Horizontal scroll ref for Lokasi Makam (Kartu Makam Horizontal Geser)
  const makamScrollRef = useRef<HTMLDivElement>(null);

  const scrollMakam = (direction: 'left' | 'right') => {
    if (makamScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      makamScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // 1. REALTIME DIGITAL CLOCK SAAT INI (WIB) - BERDETAK SETIAP DETIK
  const [currentRealTime, setCurrentRealTime] = useState<{
    timeString: string;
    dayString: string;
    dateString: string;
  }>({
    timeString: '--:--:--',
    dayString: 'Memuat...',
    dateString: '...',
  });

  useEffect(() => {
    const updateRealClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now);
      const fullDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      setCurrentRealTime({
        timeString: `${hours}:${minutes}:${seconds} WIB`,
        dayString: dayName,
        dateString: fullDate,
      });
    };

    updateRealClock();
    const clockInterval = setInterval(updateRealClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // 2. COUNTDOWN TIMER MENUJU PELAKSANAAN SAFAR
  const [countdownTime, setCountdownTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calcCountdown = () => {
      const targetStr = siteSettings.eventCountdownTarget || '2026-10-06T06:00:00';
      const target = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownTime({ days, hours, minutes, seconds, isPast: false });
    };

    calcCountdown();
    const cInterval = setInterval(calcCountdown, 1000);
    return () => clearInterval(cInterval);
  }, [siteSettings.eventCountdownTarget]);

  // 3. ACTIVE AGENDA YANG SEDANG BERLANGSUNG (LIVE ACTIVE AGENDA)
  const activeAgendaData = useMemo(() => {
    if (siteSettings.showActiveAgendaBanner === false) {
      return null;
    }

    // 1. Cek dari RundownList (Prioritas Utama Rundown Kegiatan Realtime)
    let activeRundown: (typeof rundownList)[0] | undefined;
    if (siteSettings.activeAgendaMode === 'manual' && siteSettings.activeRundownId) {
      activeRundown = rundownList.find((r) => r.id === siteSettings.activeRundownId);
    }
    if (!activeRundown) {
      activeRundown = rundownList.find((r) => r.status === 'berlangsung');
    }

    if (activeRundown) {
      const loc = activeRundown.locationId
        ? makamList.find((m) => m.id === activeRundown.locationId)
        : makamList.find((m) => m.name.toLowerCase().includes(activeRundown.location.toLowerCase()));

      const figs = tokohList.filter(
        (t) =>
          activeRundown.figureIds?.includes(t.id) ||
          (activeRundown.locationId && t.tombLocationId === activeRundown.locationId)
      );

      const timeStr = activeRundown.timeIn
        ? `${activeRundown.timeIn} - ${activeRundown.timeOut || 'Selesai'} WIB`
        : activeRundown.time;

      return {
        isFromRundown: true,
        title: activeRundown.location,
        dayNumber: activeRundown.dayNumber,
        dayName: activeRundown.dayName,
        date: activeRundown.date,
        timeStr,
        duration: activeRundown.durationAtLocation || activeRundown.duration,
        activity: activeRundown.activity,
        subActivities: activeRundown.subActivities || [],
        locationObj: loc,
        figures: figs,
        badge: 'SEDANG BERLANGSUNG SAAT INI (POSISI REAL-TIME)',
        isLive: true,
      };
    }

    // 2. Fallback: Cek dari AgendaList jika ada agenda manual
    if (siteSettings.activeAgendaMode === 'manual' && siteSettings.manualActiveAgendaId) {
      const selected = agendaList.find((a) => a.id === siteSettings.manualActiveAgendaId);
      if (selected) {
        const loc = makamList.find((m) => m.id === selected.locationId);
        const figs = tokohList.filter((t) => selected.figureIds?.includes(t.id));
        return {
          isFromRundown: false,
          title: selected.title,
          dayNumber: selected.dayNumber,
          dayName: selected.dayName,
          date: selected.date,
          timeStr: `${selected.startTime} - ${selected.endTime} WIB`,
          duration: `± ${selected.durationMinutes} Menit`,
          activity: selected.description,
          subActivities: [],
          locationObj: loc,
          figures: figs,
          agendaSlug: selected.slug,
          badge: 'SEDANG BERLANGSUNG (PANDUAN RESMI)',
          isLive: true,
        };
      }
    }

    // 3. Fallback: Titik rundown berikutnya
    const nextItem = rundownList.find((r) => r.status === 'berikutnya') || rundownList[0];
    if (nextItem) {
      const loc = nextItem.locationId
        ? makamList.find((m) => m.id === nextItem.locationId)
        : makamList.find((m) => m.name.toLowerCase().includes(nextItem.location.toLowerCase()));

      const figs = tokohList.filter(
        (t) =>
          nextItem.figureIds?.includes(t.id) ||
          (nextItem.locationId && t.tombLocationId === nextItem.locationId)
      );

      const timeStr = nextItem.timeIn
        ? `${nextItem.timeIn} - ${nextItem.timeOut || 'Selesai'} WIB`
        : nextItem.time;

      return {
        isFromRundown: true,
        title: nextItem.location,
        dayNumber: nextItem.dayNumber,
        dayName: nextItem.dayName,
        date: nextItem.date,
        timeStr,
        duration: nextItem.durationAtLocation || nextItem.duration,
        activity: nextItem.activity,
        subActivities: nextItem.subActivities || [],
        locationObj: loc,
        figures: figs,
        badge: 'AGENDA BERIKUTNYA DALAM RUNDOWN',
        isLive: false,
      };
    }

    return null;
  }, [
    siteSettings.showActiveAgendaBanner,
    siteSettings.activeAgendaMode,
    siteSettings.activeRundownId,
    siteSettings.manualActiveAgendaId,
    rundownList,
    agendaList,
    makamList,
    tokohList,
  ]);

  // Modal State for Quick Agenda Selector
  const [isQuickAgendaOpen, setIsQuickAgendaOpen] = useState(false);

  const modeName = ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur & Madura)' : 'Ziarah Ngulon (Jawa Barat & Banten)';
  const activeLocation = activeAgendaData?.locationObj || null;
  const activeFigures = activeAgendaData?.figures || [];
  const activeFiguresText = activeFigures.length > 0 ? activeFigures.map((f) => f.name).join(', ') : 'Para Masyayikh & Auliya\'';

  // Dynamic Theme Styling Calculations
  const headingFontClass =
    siteSettings.themeFontHeading === 'amiri'
      ? 'font-heading-amiri'
      : siteSettings.themeFontHeading === 'sans'
      ? 'font-heading-sans'
      : siteSettings.themeFontHeading === 'serif'
      ? 'font-heading-serif'
      : 'font-heading-cinzel';

  const cardRadius = siteSettings.themeCardRadius || 'rounded-2xl';

  const heroGradient =
    siteSettings.themeColorScheme === 'teal'
      ? 'bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 border-amber-300'
      : siteSettings.themeColorScheme === 'gold'
      ? 'bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-amber-500'
      : siteSettings.themeColorScheme === 'navy'
      ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-yellow-400'
      : siteSettings.themeColorScheme === 'forest'
      ? 'bg-gradient-to-b from-green-950 via-green-900 to-green-950 border-emerald-400'
      : 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 border-amber-400';

  const showPattern = siteSettings.themeShowPattern !== false;

  // Ordered Sections List
  const defaultSectionOrder = [
    'hero',
    'livetracker',
    'infokilat',
    'countdown',
    'bukusaku',
    'makam',
    'tokoh',
    'doa',
    'berita',
  ];
  const sectionOrder = siteSettings.sectionOrderHome || defaultSectionOrder;
  const sectionVisibility = siteSettings.sectionVisibilityHome || {};

  // ========================================================
  // SECTION RENDERERS
  // ========================================================

  // 1. HERO SECTION
  const renderHeroSection = () => (
    <section
      key="hero"
      className={`${heroGradient} text-white border-b-4 shadow-xl relative overflow-hidden w-full`}
    >
      {showPattern && (
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
      )}

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10 text-center space-y-5 sm:space-y-6">
        {/* Institution Header Tag & Mode Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/20 rounded-full text-xs text-amber-300 font-semibold tracking-wide shadow-xs">
            <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{siteSettings.organizer}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-stone-950 rounded-full text-xs font-bold tracking-wide shadow-xs">
            <span>{siteSettings.uiHeaderBadgeText || `Mode: ${modeName}`}</span>
          </div>
        </div>

        {/* Main Large Title */}
        <h1 className={`text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-snug px-2 ${headingFontClass}`}>
          {siteSettings.siteTitle}
        </h1>

        <p className="text-xs sm:text-sm text-stone-200/90 max-w-2xl mx-auto leading-relaxed">
          {siteSettings.heroHeadline} — {siteSettings.heroSubheadline}
        </p>

        {/* REALTIME DIGITAL CLOCK SAAT INI (WIB) - DOMINAN & BERDETAK AKTIF */}
        <div className={`max-w-md mx-auto bg-black/40 border-2 border-amber-400/80 ${cardRadius} p-4 shadow-xl text-center space-y-1 backdrop-blur-md`}>
          <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Waktu Real-Time Sekarang (WIB)</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight tabular-nums py-1">
            {currentRealTime.timeString}
          </div>
          <div className="text-xs text-stone-200 font-medium">
            {currentRealTime.dayString}, {currentRealTime.dateString}
          </div>
        </div>

        {/* Tanggal Resmi Minimalis */}
        <div className="max-w-2xl mx-auto bg-black/20 border border-white/20 rounded-xl p-2.5 text-center text-xs text-stone-200">
          <span className="text-amber-300 font-bold">{siteSettings.eventDates}</span> · Pukul {siteSettings.eventTimeStart} · Maqbarah Masyayikh Berjan Purworejo
        </div>
      </div>
    </section>
  );

  // 2. LIVE TRACKER BANNER (AGENDA SEDANG BERLANGSUNG)
  const renderLiveTrackerSection = () => {
    if (!activeAgendaData) return null;

    return (
      <section key="livetracker" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-400 ${cardRadius} p-4 sm:p-6 shadow-2xl text-white space-y-4 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar with Badge & Day Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-amber-300">
                {siteSettings.uiHomeLiveTrackerTitle || activeAgendaData.badge}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-700 text-[11px] font-semibold text-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Hari ke-{activeAgendaData.dayNumber} · {activeAgendaData.dayName}</span>
            </div>
          </div>

          {/* Instruksi Siaran Panitia */}
          {siteSettings.liveBroadcastNote && (
            <div className="bg-amber-400/20 border border-amber-400/70 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5 shadow-xs">
              <Megaphone className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[10px] block">
                  Instruksi Panitia Safar:
                </span>
                <p className="text-white font-medium text-xs mt-0.5 leading-relaxed">
                  {siteSettings.liveBroadcastNote}
                </p>
              </div>
            </div>
          )}

          {/* Core Info Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Titik Safar:</span>
                <span className="text-white font-bold">{activeLocation?.district || 'Wilayah Transit'}</span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold text-white leading-tight ${headingFontClass}`}>
                {activeAgendaData.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {activeAgendaData.activity}
              </p>
            </div>

            <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-300">
                <span>Waktu Kegiatan:</span>
                <span className="font-bold text-amber-300 font-mono">{activeAgendaData.timeStr}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span>Estimasi Durasi:</span>
                <span className="font-bold text-white">{activeAgendaData.duration}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span>Tokoh Shalihin:</span>
                <span className="font-semibold text-amber-200 truncate max-w-[130px]">{activeFiguresText}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-emerald-300/80 italic">
              *Status agenda disinkronkan langsung via Panel Administrator Ziarah
            </span>

            <div className="flex items-center gap-2">
              {activeLocation && (
                <button
                  onClick={() => navigateTo('lokasi-detail', activeLocation.slug)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  Profil Makam
                </button>
              )}
              <button
                onClick={() => navigateTo('rundown')}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all cursor-pointer font-sans"
              >
                <span>{siteSettings.uiBtnJadwalText || 'Buka Rundown Lengkap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // 3. PUSAT NAVIGASI & INFORMASI KILAT
  const renderInfoKilatSection = () => (
    <section key="infokilat" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{siteSettings.infoKilatBadge || 'Akses Cepat Jamaah & Direktori Safar'}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-0.5">
            {siteSettings.infoKilatTitle || 'Pusat Navigasi & Informasi Kilat'}
          </h2>
          {siteSettings.infoKilatDescription && (
            <p className="text-xs text-stone-500 mt-0.5">{siteSettings.infoKilatDescription}</p>
          )}
        </div>
        <div className="text-xs text-stone-500">
          Jalur Resmi:{' '}
          <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {ziarahMode === 'ngetan' ? 'Rute Ngetan (Jatim)' : 'Rute Ngulon (Jabar)'}
          </span>
        </div>
      </div>

      {/* SATU KARTU PANJANG UTAMA: POP-UP DIREKTORI LENGKAP SEMUA MENU NAVIGASI */}
      {siteSettings.showLongNavCard !== false && (
        <div
          onClick={() => setIsNavModalOpen(true)}
          className={`relative overflow-hidden ${cardRadius} bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-4 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-emerald-800/80 hover:border-amber-400/50 group`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsNavModalOpen(true);
            }
          }}
          aria-label="Buka Pop-up Direktori & Navigasi Lengkap"
        >
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-600/15 blur-2xl pointer-events-none group-hover:bg-emerald-500/25 transition-all" />
          <div className="absolute right-1/3 -bottom-10 w-48 h-48 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/40">
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  <span>Navigasi Pop-up Utama</span>
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-200 bg-emerald-900/80 px-2.5 py-1 rounded-full border border-emerald-700/60 font-semibold">
                  Rute: {ziarahMode === 'ngetan' ? 'Ziarah Ngetan' : 'Ziarah Ngulon'}
                </span>
                <span className="text-[11px] text-emerald-300/80 hidden md:inline">
                  · Klik Kartu untuk Membuka Menu
                </span>
              </div>

              <div>
                <h3 className={`text-base sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors leading-snug ${headingFontClass}`}>
                  {siteSettings.longNavTitle || 'Direktori Seluruh Menu & Panduan Safar Ziarah An-Nawawi 2026'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
                  {siteSettings.longNavDescription ||
                    "Buka jendela pop-up interaktif memuat seluruh navigasi safar: jadwal harian per hari, rundown jam di jalan, titik makam auliya', biografi tokoh masyayikh, tuntunan Yasin & tahlil, info peserta, buku saku digital, dan warta resmi."}
                </p>
              </div>

              {/* Chips Menu Pilihan */}
              <div className="pt-1.5 flex flex-wrap gap-1.5 sm:gap-2">
                {(!siteSettings.longNavChips || siteSettings.longNavChips.includes('jadwal')) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-[11px] font-semibold text-emerald-100 border border-emerald-700/70">
                    <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>Jadwal Safar</span>
                  </span>
                )}
                {(!siteSettings.longNavChips || siteSettings.longNavChips.includes('rundown')) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-[11px] font-semibold text-emerald-100 border border-emerald-700/70">
                    <Clock className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>Rundown Jam</span>
                  </span>
                )}
                {(!siteSettings.longNavChips || siteSettings.longNavChips.includes('makam')) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-[11px] font-semibold text-emerald-100 border border-emerald-700/70">
                    <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>Titik Maqbarah</span>
                  </span>
                )}
                {(!siteSettings.longNavChips || siteSettings.longNavChips.includes('tokoh')) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-[11px] font-semibold text-emerald-100 border border-emerald-700/70">
                    <Users className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>Biografi Tokoh</span>
                  </span>
                )}
                {(!siteSettings.longNavChips || siteSettings.longNavChips.includes('doa')) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-[11px] font-semibold text-emerald-100 border border-emerald-700/70">
                    <BookOpen className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>Doa & Tahlil</span>
                  </span>
                )}
              </div>
            </div>

            {/* Tombol Call to Action */}
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNavModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-950 shrink-0" />
                <span>{siteSettings.uiBtnNavigasiText || siteSettings.longNavButtonText || 'Buka Pop-up Navigasi'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-950 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 KARTU MENU INFORMASI KILAT PINTASAN */}
      {(siteSettings.showKilatAgenda !== false ||
        siteSettings.showKilatTokoh !== false ||
        siteSettings.showKilatQuickSchedule !== false ||
        siteSettings.showKilatDoa !== false) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
          {siteSettings.showKilatAgenda !== false && (
            <div
              onClick={() => navigateTo('agenda')}
              className={`bg-white ${cardRadius} border-2 border-emerald-800/20 hover:border-emerald-700 p-3.5 sm:p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group bg-gradient-to-b from-white to-emerald-50/40`}
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-base text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {siteSettings.kilatAgendaTitle || 'Agenda Ziarah'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {siteSettings.kilatAgendaDesc || 'Timeline urutan safar per hari, rute maqbarah, jam tiba, dan peta transit.'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] sm:text-xs font-bold text-emerald-800">
                <span>Buka Agenda</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {siteSettings.showKilatTokoh !== false && (
            <div
              onClick={() => navigateTo('tokoh')}
              className={`bg-white ${cardRadius} border-2 border-emerald-800/20 hover:border-emerald-700 p-3.5 sm:p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group bg-gradient-to-b from-white to-amber-50/40`}
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-base text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {siteSettings.kilatTokohTitle || 'Biografi Tokoh'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {siteSettings.kilatTokohDesc || "Kisah auliya' shalihin, silsilah KH. Zarkasyi, dan masyayikh yang diziarahi."}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-800">
                <span>Baca Biografi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {siteSettings.showKilatQuickSchedule !== false && (
            <div
              onClick={() => setIsQuickAgendaOpen(true)}
              className={`bg-white ${cardRadius} border-2 border-emerald-800/20 hover:border-emerald-700 p-3.5 sm:p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group bg-gradient-to-b from-white to-sky-50/40`}
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-base text-stone-900 group-hover:text-sky-800 transition-colors leading-snug">
                    {siteSettings.kilatQuickScheduleTitle || 'Pilih Agenda Hari'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {siteSettings.kilatQuickScheduleDesc || 'Pilih hari atau destinasi agenda, langsung diarahkan ke jadwal spesifik.'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] sm:text-xs font-bold text-sky-800">
                <span>Pilih Jadwal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {siteSettings.showKilatDoa !== false && (
            <div
              onClick={() => navigateTo('doa')}
              className={`bg-white ${cardRadius} border-2 border-emerald-800/20 hover:border-emerald-700 p-3.5 sm:p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group bg-gradient-to-b from-white to-emerald-50/40`}
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform font-serif-islamic font-bold text-lg">
                  دعاء
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-base text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {siteSettings.kilatDoaTitle || 'Yasin & Doa Ziarah'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {siteSettings.kilatDoaDesc || 'Teks Arab harakat, Latin & terjemahan Tawassul, Yasin, Tahlil, serta Doa Safar.'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] sm:text-xs font-bold text-emerald-800">
                <span>Buka Doa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );

  // 4. COUNTDOWN HITUNG MUNDUR KEBERANGKATAN AKBAR
  const renderCountdownSection = () => (
    <section key="countdown" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className={`bg-white border-2 border-amber-300 ${cardRadius} p-5 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="space-y-1.5 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>HITUNG MUNDUR SAFAR</span>
          </div>
          <h3 className={`text-lg sm:text-2xl font-bold text-stone-900 leading-tight ${headingFontClass}`}>
            {siteSettings.uiHomeCountdownTitle || 'Hitung Mundur Keberangkatan Akbar Safar Ziarah'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {siteSettings.uiHomeCountdownSubtitle || `Menuju safar akbar maqbarah auliya' shalihin PP. An-Nawawi Berjan Purworejo (${siteSettings.eventDates}).`}
          </p>
        </div>

        {/* 4 Unit Countdown Box */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 shrink-0 text-center">
          {[
            { label: 'HARI', val: countdownTime.days },
            { label: 'JAM', val: countdownTime.hours },
            { label: 'MENIT', val: countdownTime.minutes },
            { label: 'DETIK', val: countdownTime.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-emerald-950 text-white rounded-xl p-2.5 sm:p-3 min-w-[62px] sm:min-w-[76px] border border-emerald-800 shadow-2xs"
            >
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight tabular-nums">
                {String(item.val).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-emerald-200 tracking-wider mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // 5. BANNER KHUSUS BUKU SAKU ZIARAH
  const renderBukuSakuSection = () => (
    <section key="bukusaku" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className={`bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white ${cardRadius} p-5 sm:p-8 border border-emerald-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="space-y-2 text-center md:text-left max-w-2xl">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
            Publikasi Resmi Pesantren Berjan
          </span>
          <h3 className={`text-xl sm:text-2xl font-bold text-white ${headingFontClass}`}>
            {siteSettings.pocketBookTitle}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {siteSettings.uiHomeBukuSakuSubtitle ||
              'Dilengkapi panduan adab di maqbarah, fadlilah ziarah kubur, manaqib ulama, doa safar kendaraan, dan tuntunan shalat musafir jamak qashar.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => setIsBukuSakuOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{siteSettings.uiBtnBukuSakuText || 'Preview / Baca Buku Saku'}</span>
          </button>
          {siteSettings.linkBukuSakuPdf && siteSettings.linkBukuSakuPdf !== '#' ? (
            <a
              href={siteSettings.linkBukuSakuPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-600 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Download PDF Berkas ↗</span>
            </a>
          ) : (
            <button
              onClick={() => setIsBukuSakuOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-600 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Download / Cetak PDF</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );

  // 6. DESTINASI MAKAM AULIYA (CAROUSEL GESER HORIZONTAL)
  const renderMakamSection = () => (
    <section key="makam" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
            Destinasi Maqbarah
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-0.5">
            {siteSettings.uiHomeMakamTitle || 'Lokasi Makam yang Diziarahi'}
          </h2>
          {siteSettings.uiHomeMakamSubtitle && (
            <p className="text-xs text-stone-500 mt-0.5">{siteSettings.uiHomeMakamSubtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('lokasi')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hidden sm:flex items-center gap-1"
          >
            <span>Lihat Semua {publishedMakam.length} Lokasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollMakam('left')}
              className="w-8 h-8 rounded-full border border-stone-300 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer shadow-2xs"
              aria-label="Geser Makam ke Kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollMakam('right')}
              className="w-8 h-8 rounded-full border border-stone-300 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer shadow-2xs"
              aria-label="Geser Makam ke Kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={makamScrollRef}
        className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory scrollbar-none no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0"
        style={{ scrollBehavior: 'smooth' }}
      >
        {publishedMakam.map((makam) => (
          <div
            key={makam.id}
            onClick={() => navigateTo('lokasi-detail', makam.slug)}
            className={`snap-start shrink-0 w-[270px] sm:w-[320px] bg-white ${cardRadius} border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group`}
          >
            <div>
              <div className="aspect-16/10 overflow-hidden relative bg-stone-100">
                <img
                  src={makam.image}
                  alt={makam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950/85 text-amber-300 border border-emerald-700">
                  {makam.regency}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-stone-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{makam.estimatedDuration}</span>
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="text-[11px] text-stone-500 font-medium block">
                  Kec. {makam.district}
                </span>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                  {makam.name}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {makam.description}
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                <span>Lihat Detail Makam</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // 7. TOKOH & MASYAYIKH SECTION
  const renderTokohSection = () => (
    <section key="tokoh" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
            Keteladanan Masyayikh
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-0.5">
            {siteSettings.uiHomeTokohTitle || "Biografi Auliya' & Masyayikh"}
          </h2>
          {siteSettings.uiHomeTokohSubtitle && (
            <p className="text-xs text-stone-500 mt-0.5">{siteSettings.uiHomeTokohSubtitle}</p>
          )}
        </div>
        <button
          onClick={() => navigateTo('tokoh')}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
        >
          <span>Lihat Semua ({publishedTokoh.length}) Tokoh</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {publishedTokoh.slice(0, 4).map((tokoh) => (
          <div
            key={tokoh.id}
            onClick={() => navigateTo('tokoh-detail', tokoh.slug)}
            className={`bg-white ${cardRadius} border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group p-4`}
          >
            <div className="space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 relative">
                <img
                  src={tokoh.photo}
                  alt={tokoh.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-stone-900/80 text-amber-300 backdrop-blur-xs">
                  {tokoh.birthYear ? `${tokoh.birthYear} - ${tokoh.deathYear || 'Wafat'}` : 'Auliya'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1 leading-snug">
                  {tokoh.name}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1">{tokoh.titleOrHonorific}</p>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                  {tokoh.biography}
                </p>
              </div>
            </div>
            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Biografi Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // 8. DOA & TAHLIL SECTION
  const renderDoaSection = () => (
    <section key="doa" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
            Amaliah Ziarah
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-0.5">
            {siteSettings.uiHomeDoaTitle || 'Tuntunan Aurad, Yasin & Tahlil'}
          </h2>
          {siteSettings.uiHomeDoaSubtitle && (
            <p className="text-xs text-stone-500 mt-0.5">{siteSettings.uiHomeDoaSubtitle}</p>
          )}
        </div>
        <button
          onClick={() => navigateTo('doa')}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
        >
          <span>Buka Semua Bacaan Doa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doaList.slice(0, 3).map((doa) => (
          <div
            key={doa.id}
            onClick={() => navigateTo('doa')}
            className={`bg-white ${cardRadius} border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
                {doa.category.replace('_', ' ')}
              </span>
              <h3 className={`text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug ${headingFontClass}`}>
                {doa.title}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {doa.description}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Buka Teks Arab & Terjemah</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // 9. ARTIKEL & WARTA BERITA SECTION
  const renderBeritaSection = () => (
    <section key="berita" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
            Warta & Informasi
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-0.5">
            {siteSettings.uiHomeBeritaTitle || 'Artikel & Warta Pilihan Ziarah'}
          </h2>
          {siteSettings.uiHomeBeritaSubtitle && (
            <p className="text-xs text-stone-500 mt-0.5">{siteSettings.uiHomeBeritaSubtitle}</p>
          )}
        </div>
        <button
          onClick={() => navigateTo('berita')}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
        >
          <span>Lihat Semua ({publishedPosts.length}) Berita & Warta</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {publishedPosts.slice(0, 6).map((post) => (
          <div
            key={post.id}
            onClick={() => navigateTo('berita-detail', post.slug)}
            className={`bg-white ${cardRadius} border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
          >
            <div>
              <div className="aspect-16/10 overflow-hidden relative bg-stone-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950/80 text-amber-300 border border-emerald-700">
                  {post.category}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-[11px] text-stone-500 font-medium">
                  {post.publishDate} · oleh {post.author}
                </div>
                <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>
            <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
              <span className="text-xs text-stone-500">Kategori: {post.category}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // Map of Section ID to Component Render
  const sectionRenderMap: Record<string, () => React.ReactNode> = {
    hero: renderHeroSection,
    livetracker: renderLiveTrackerSection,
    infokilat: renderInfoKilatSection,
    countdown: renderCountdownSection,
    bukusaku: renderBukuSakuSection,
    makam: renderMakamSection,
    tokoh: renderTokohSection,
    doa: renderDoaSection,
    berita: renderBeritaSection,
  };

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 w-full max-w-full overflow-x-hidden">
      {/* DYNAMIC ORDERED SECTIONS BASED ON ADMIN THEME POSITION & VISIBILITY */}
      {sectionOrder.map((sectionId) => {
        const isVisible = sectionVisibility[sectionId] !== false;
        if (!isVisible) return null;

        const renderFn = sectionRenderMap[sectionId];
        return renderFn ? <React.Fragment key={sectionId}>{renderFn()}</React.Fragment> : null;
      })}

      {/* POPUP / MODAL PILIH AGENDA CEPAT (DARI KILAT 3) */}
      {isQuickAgendaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`bg-white ${cardRadius} max-w-lg w-full max-h-[85vh] overflow-hidden border border-stone-200 shadow-2xl flex flex-col`}>
            <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Pilih Agenda Perjalanan Ziarah
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Klik agenda untuk langsung melihat rincian lengkapnya
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickAgendaOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-stone-100">
              {agendaList.map((agenda) => (
                <div
                  key={agenda.id}
                  onClick={() => {
                    setIsQuickAgendaOpen(false);
                    navigateTo('agenda-detail', agenda.slug);
                  }}
                  className="pt-2 pb-2 hover:bg-emerald-50/70 p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                        Hari ke-{agenda.dayNumber}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {agenda.startTime} - {agenda.endTime} WIB
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                      {agenda.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {agenda.dayName}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
              <button
                onClick={() => {
                  setIsQuickAgendaOpen(false);
                  navigateTo('agenda');
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Lihat Seluruh Timeline Agenda Lengkap →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
