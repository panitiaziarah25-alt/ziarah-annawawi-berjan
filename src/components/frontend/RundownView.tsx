import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Clock,
  Printer,
  Share2,
  Calendar,
  MapPin,
  List,
  Table as TableIcon,
  CheckCircle2,
  PlayCircle,
  Timer,
  Search,
  Copy,
  Check,
  Compass,
  User,
  BookOpen,
  X,
  ExternalLink,
  ChevronRight,
  Bus,
  MessageSquare,
} from 'lucide-react';
import { RundownItem, Tokoh, MakamLokasi } from '../../types';
import {
  formatPerAgendaWAMessage,
  formatAllRundownWAMessage,
  shareToWhatsApp,
} from '../../utils/whatsappShare';

export const RundownView: React.FC = () => {
  const { rundownList, tokohList, makamList, updateRundown, openShareModal, siteSettings, ziarahMode, showToast, navigateTo } = useApp();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'selesai' | 'berlangsung' | 'berikutnya'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Quick Biography Modal State
  const [selectedTokohBio, setSelectedTokohBio] = useState<Tokoh | null>(null);

  // Group days with full Day & Date labels
  const dayGroups = useMemo(() => {
    const map = new Map<number, { dayNumber: number; dayName: string; date: string }>();
    rundownList.forEach((r) => {
      if (!map.has(r.dayNumber)) {
        map.set(r.dayNumber, {
          dayNumber: r.dayNumber,
          dayName: r.dayName,
          date: r.date,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.dayNumber - b.dayNumber);
  }, [rundownList]);

  // Map of Tokoh by ID for fast relational lookup
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

  const filteredRundowns = useMemo(() => {
    return rundownList
      .filter((r) => {
        if (selectedDay !== 'all' && r.dayNumber !== selectedDay) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchLoc = r.location?.toLowerCase().includes(q);
          const matchAct = r.activity?.toLowerCase().includes(q);
          const matchNotes = r.notes?.toLowerCase().includes(q);
          const matchSub = r.subActivities?.some((sub) => sub.toLowerCase().includes(q));

          // Also search linked Tokoh names!
          const matchFigures = r.figureIds?.some((fId) => {
            const t = tokohMap.get(fId);
            return t ? t.name.toLowerCase().includes(q) || t.titleOrHonorific.toLowerCase().includes(q) : false;
          });

          if (!matchLoc && !matchAct && !matchNotes && !matchSub && !matchFigures) return false;
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [rundownList, selectedDay, statusFilter, searchQuery, tokohMap]);

  // Group filtered rundowns by day for clean itinerary sections
  const groupedByDay = useMemo(() => {
    const groups: { [key: number]: RundownItem[] } = {};
    filteredRundowns.forEach((item) => {
      if (!groups[item.dayNumber]) {
        groups[item.dayNumber] = [];
      }
      groups[item.dayNumber].push(item);
    });
    return groups;
  }, [filteredRundowns]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    openShareModal({
      title: `Rundown Ziarah An-Nawawi 2026 - ${selectedDay === 'all' ? 'Seluruh Agenda' : `Hari ke-${selectedDay}`}`,
      summary: `Jadwal dan rute resmi Ziarah Makam Auliya', Ulama', dan Pejuang PP. An-Nawawi Berjan Purworejo.`,
      url: `${window.location.origin}/#/rundown`,
    });
  };

  const handleShareAllWhatsApp = () => {
    const message = formatAllRundownWAMessage(
      filteredRundowns,
      siteSettings,
      tokohList,
      selectedDay
    );
    shareToWhatsApp(message);
    showToast('Membuka WhatsApp untuk membagikan seluruh jadwal...', 'success');
  };

  const handleCopyText = () => {
    const lines: string[] = [
      `*RUNDOWN RESMI ZIARAH AN-NAWAWI 2026*`,
      `*Pondok Pesantren An-Nawawi Berjan Purworejo*`,
      `Rute: ${ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur & Pantura)' : 'Ziarah Ngulon (Jawa Barat & Banten)'}`,
      `----------------------------------------`,
    ];

    filteredRundowns.forEach((item, idx) => {
      lines.push(`\n📍 *${idx + 1}. ${item.location.toUpperCase()}* (${item.dayName})`);
      if (item.travelDuration && item.travelDuration !== '-') {
        lines.push(`⏱️ Di Jalan: ${item.travelDuration}`);
      }
      lines.push(`🕒 Masuk: ${item.timeIn || item.time.split('-')[0]?.trim()} | Keluar: ${item.timeOut || item.time.split('-')[1]?.trim()}`);
      lines.push(`⌛ Durasi di Lokasi: ${item.durationAtLocation || item.duration}`);

      // Resolved figures
      if (item.figureIds && item.figureIds.length > 0) {
        lines.push(`🕌 Ziarah Maqbarah:`);
        item.figureIds.forEach((fId, fIdx) => {
          const t = tokohMap.get(fId);
          if (t) {
            lines.push(`   ${fIdx + 1}. ${t.name} (${t.titleOrHonorific})`);
          }
        });
      }

      if (item.subActivities && item.subActivities.length > 0) {
        lines.push(`📝 Agenda Tambahan:`);
        item.subActivities.forEach((sub) => lines.push(`   - ${sub}`));
      } else if (!item.figureIds || item.figureIds.length === 0) {
        lines.push(`📝 Kegiatan: ${item.activity}`);
      }
      lines.push(`Status: [${item.status.toUpperCase()}]`);
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    showToast('Teks rundown berhasil disalin ke format WhatsApp!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const getStatusBadge = (status: 'selesai' | 'berlangsung' | 'berikutnya', isInteractive: boolean = false, itemId?: string) => {
    if (status === 'selesai') {
      return (
        <span
          onClick={() => {
            if (isInteractive && itemId) {
              updateRundown(itemId, { status: 'berikutnya' });
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs cursor-pointer select-none"
          title="Klik untuk ubah status"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Selesai</span>
        </span>
      );
    }
    if (status === 'berlangsung') {
      return (
        <span
          onClick={() => {
            if (isInteractive && itemId) {
              updateRundown(itemId, { status: 'selesai' });
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-950 bg-amber-200 border-2 border-amber-400 px-3 py-1 rounded-full shadow-xs cursor-pointer select-none animate-pulse"
          title="Klik untuk tandai selesai"
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 fill-amber-300" />
          <span>Sedang Berlangsung</span>
        </span>
      );
    }
    return (
      <span
        onClick={() => {
          if (isInteractive && itemId) {
            updateRundown(itemId, { status: 'berlangsung' });
          }
        }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 border border-stone-300 px-3 py-1 rounded-full cursor-pointer select-none hover:bg-stone-200"
        title="Klik untuk tandai berlangsung"
      >
        <Timer className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span>Berikutnya</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="no-print">
        <Breadcrumb items={[{ label: 'Rundown & Jadwal Ziarah' }]} />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              {ziarahMode === 'ngetan' ? 'RUTE NGETAN (JAWA TIMUR & PANTURA)' : 'RUTE NGULON (JAWA BARAT & BANTEN)'}
            </span>
            <span className="text-xs text-stone-400 no-print">· Sinkronisasi Database Tokoh & Makam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
            Rundown & Jadwal Perjalanan Ziarah 2026
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {siteSettings.organizer} · {siteSettings.eventDates} · Panduan Resmi Waktu & Lokasi
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          {/* Switcher Mode: Cards vs Table */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 shadow-2xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              title="Tampilan Kartu Perjalanan Master Modern"
            >
              <List className="w-3.5 h-3.5" />
              <span>Format Kartu</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              title="Tampilan Tabel Resmi Dokumen Cetak"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Format Tabel</span>
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Salin Rundown ke Format WhatsApp"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Tersalin' : 'Salin WA'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Cetak format cetak dokumen A4"
          >
            <Printer className="w-3.5 h-3.5 text-sky-700" />
            <span>Cetak Dokumen</span>
          </button>

          <button
            onClick={handleShareAllWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Kirim seluruh jadwal ke WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Share ke WA</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Filter by Day (with FULL Day & Date as requested) and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 no-print bg-stone-100/80 p-3 rounded-xl border border-stone-200">
        {/* Day selection showing FULL DAY & DATE */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Pilih Tanggal:</span>
          </span>
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Semua Hari
          </button>
          {dayGroups.map((group) => (
            <button
              key={group.dayNumber}
              onClick={() => setSelectedDay(group.dayNumber)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedDay === group.dayNumber
                  ? 'bg-emerald-800 text-white shadow-2xs ring-1 ring-emerald-600'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{group.dayName}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px] md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tokoh, makam, sholat..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* VIEW A: ENHANCED CARD ITINERARY (PRIMARY MODERN FORMAT) */}
      {viewMode === 'cards' ? (
        <div className="space-y-8">
          {Object.entries(groupedByDay).map(([dayNumStr, items]) => {
            const dayNum = parseInt(dayNumStr);
            const firstItem = items[0];

            return (
              <div key={dayNum} className="space-y-4">
                {/* Day Header Banner with Full Day & Date */}
                <div className="flex items-center gap-3 border-b-2 border-emerald-800/30 pb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    H-{dayNum}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                      {firstItem.dayName}
                    </h2>
                    <span className="text-xs text-stone-500 font-medium">
                      Tanggal Pelaksanaan: {firstItem.date}
                    </span>
                  </div>
                </div>

                {/* Items in this Day */}
                <div className="space-y-4 pl-0 sm:pl-3">
                  {items.map((item, idx) => {
                    const isActive = item.status === 'berlangsung';
                    const isDone = item.status === 'selesai';
                    const linkedMakam = item.locationId ? makamMap.get(item.locationId) : null;

                    // Resolve linked figures
                    const linkedTokohList: Tokoh[] = [];
                    if (item.figureIds && item.figureIds.length > 0) {
                      item.figureIds.forEach((fId) => {
                        const t = tokohMap.get(fId);
                        if (t) linkedTokohList.push(t);
                      });
                    }

                    return (
                      <div key={item.id} className="relative">
                        {/* Transit connecting banner from previous stop if there is travel duration */}
                        {item.travelDuration && item.travelDuration !== '-' && idx > 0 && (
                          <div className="flex items-center gap-2 my-2.5 text-xs text-stone-500 pl-4 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                            <div className="flex items-center gap-1.5 bg-sky-50 text-sky-900 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                              <Bus className="w-3.5 h-3.5 text-sky-700" />
                              <span>Estimasi Perjalanan Armada: {item.travelDuration}</span>
                            </div>
                          </div>
                        )}

                        {/* Card Container */}
                        <div
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                            isActive
                              ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300 shadow-md'
                              : isDone
                              ? 'border-stone-200 bg-white hover:border-emerald-300'
                              : 'border-stone-200 bg-white hover:border-sky-300'
                          }`}
                        >
                          {/* Card Top Strip: Cyan / Blue header accent matching official document */}
                          <div className="bg-[#00a2e8] text-black px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/20 font-bold text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-white/90 text-stone-900 flex items-center justify-center font-extrabold text-xs shadow-2xs">
                                {item.order}
                              </span>
                              <span className="text-sm font-extrabold tracking-tight">
                                {item.location}
                              </span>
                            </div>

                            {/* Timing Pills */}
                            <div className="flex items-center gap-2 text-[11px] font-semibold">
                              <span className="bg-white/90 text-stone-900 px-2.5 py-0.5 rounded-md shadow-2xs">
                                Masuk: <strong>{item.timeIn || item.time.split('-')[0]?.trim()}</strong>
                              </span>
                              <span className="bg-white/90 text-stone-900 px-2.5 py-0.5 rounded-md shadow-2xs">
                                Keluar: <strong>{item.timeOut || item.time.split('-')[1]?.trim()}</strong>
                              </span>
                              <span className="bg-white/80 text-stone-800 px-2 py-0.5 rounded-md hidden sm:inline-block">
                                Durasi: {item.durationAtLocation || item.duration}
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-4 sm:p-5 space-y-4">
                            {/* Main Activity Title & Status */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-1">
                                <h3 className="font-extrabold text-stone-900 text-base sm:text-lg leading-snug">
                                  {item.activity}
                                </h3>
                                {linkedMakam && (
                                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span>{linkedMakam.address}, {linkedMakam.district}, {linkedMakam.regency}</span>
                                    <button
                                      onClick={() => navigateTo('lokasi-detail', linkedMakam.slug)}
                                      className="text-emerald-800 font-bold hover:underline ml-1 inline-flex items-center gap-0.5 cursor-pointer"
                                    >
                                      <span>Profil Makam</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Status & WA Share at the end */}
                              <div className="shrink-0 self-start flex flex-wrap items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    const msg = formatPerAgendaWAMessage(item, siteSettings, tokohList, makamList);
                                    shareToWhatsApp(msg);
                                    showToast(`Membuka WhatsApp untuk agenda "${item.location}"`, 'success');
                                  }}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer shadow-2xs no-print"
                                  title="Bagikan rincian agenda ini ke WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Share WA</span>
                                </button>
                                {getStatusBadge(item.status, true, item.id)}
                              </div>
                            </div>

                            {/* RELATIONAL TOKOH LIST (Single Source of Truth, Automatic Biografi Linked!) */}
                            {linkedTokohList.length > 0 && (
                              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-900">
                                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                                    Ziarah Pusara Tokoh & Auliya' ({linkedTokohList.length} Tokoh Terdata):
                                  </span>
                                  <span className="text-[11px] text-stone-400 font-normal hidden sm:inline">
                                    Klik tokoh untuk membaca biografi & perjuangannya
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {linkedTokohList.map((tokoh, tIdx) => (
                                    <div
                                      key={tokoh.id}
                                      onClick={() => setSelectedTokohBio(tokoh)}
                                      className="bg-white p-2.5 rounded-lg border border-stone-200 hover:border-emerald-600 hover:shadow-xs transition-all cursor-pointer flex items-center gap-2.5 group"
                                      title={`Klik untuk membaca biografi lengkap ${tokoh.name}`}
                                    >
                                      <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                                        <img
                                          src={tokoh.photo}
                                          alt={tokoh.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                          onError={(e) => {
                                            (e.target as HTMLElement).style.display = 'none';
                                          }}
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                                          {tIdx + 1}. {tokoh.name}
                                        </div>
                                        <div className="text-[10px] text-stone-500 truncate">
                                          {tokoh.titleOrHonorific}
                                        </div>
                                      </div>
                                      <span className="text-[10px] text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                                        Bio &rarr;
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Additional Sub-activities (Prayer times, meals, briefings) */}
                            {item.subActivities && item.subActivities.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {item.subActivities.map((sub, sIdx) => {
                                  const isSholat = sub.toLowerCase().includes('sholat') || sub.toLowerCase().includes('jama');
                                  return (
                                    <span
                                      key={sIdx}
                                      className={`text-xs font-medium px-3 py-1 rounded-lg border ${
                                        isSholat
                                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold'
                                          : 'bg-stone-100 text-stone-800 border-stone-200'
                                      }`}
                                    >
                                      {isSholat ? '🕌 ' : '• '}
                                      {sub}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            {/* Notes */}
                            {item.notes && (
                              <div className="text-xs text-stone-500 italic pt-1 border-t border-stone-100">
                                Catatan: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW B: OFFICIAL TABLE FORMAT (ACCORDING TO DOCUMENT TEMPLATE) */
        <div className="bg-white rounded-xl border-2 border-stone-800 overflow-hidden shadow-sm print-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm border border-stone-800">
              <thead>
                <tr className="bg-[#00a2e8] text-black font-extrabold uppercase text-xs sm:text-sm tracking-wide border-b-2 border-stone-900">
                  <th
                    rowSpan={2}
                    className="py-3 px-3 sm:px-4 text-center border-r-2 border-stone-900 align-middle w-44 sm:w-52"
                  >
                    NAMA LOKASI & TANGGAL
                  </th>
                  <th
                    colSpan={4}
                    className="py-2 px-2 text-center border-r-2 border-stone-900 border-b border-stone-900 font-extrabold tracking-wider"
                  >
                    RENCANA WAKTU
                  </th>
                  <th
                    rowSpan={2}
                    className="py-3 px-3 sm:px-4 text-center border-r-2 border-stone-900 align-middle min-w-[280px]"
                  >
                    KEGIATAN & TOKOH ZIARAH
                  </th>
                  <th
                    rowSpan={2}
                    className="py-3 px-3 sm:px-4 text-center align-middle w-28 sm:w-36 bg-[#0091d2] border-l border-stone-900"
                  >
                    STATUS
                  </th>
                </tr>
                <tr className="bg-[#00a2e8] text-black font-extrabold uppercase text-[11px] sm:text-xs tracking-wider border-b-2 border-stone-900">
                  <th className="py-2 px-2 text-center border-r border-stone-900 w-24 whitespace-nowrap">
                    DI JALAN
                  </th>
                  <th className="py-2 px-2 text-center border-r border-stone-900 w-20 whitespace-nowrap">
                    MASUK
                  </th>
                  <th className="py-2 px-2 text-center border-r border-stone-900 w-24 whitespace-nowrap">
                    DI LOKASI
                  </th>
                  <th className="py-2 px-2 text-center border-r-2 border-stone-900 w-20 whitespace-nowrap">
                    KELUAR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-stone-800 text-stone-900">
                {filteredRundowns.map((item, index) => {
                  const isStartPoint = index === 0 && (item.travelDuration === '-' || !item.travelDuration);
                  const linkedTokohList: Tokoh[] = [];
                  if (item.figureIds && item.figureIds.length > 0) {
                    item.figureIds.forEach((fId) => {
                      const t = tokohMap.get(fId);
                      if (t) linkedTokohList.push(t);
                    });
                  }

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        item.status === 'berlangsung' ? 'bg-amber-100/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 sm:px-4 font-bold text-stone-900 border-r-2 border-stone-800 align-top">
                        <div className="text-xs sm:text-sm">{item.location}</div>
                        <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">{item.dayName}</div>
                      </td>

                      <td
                        className={`py-3 px-2 text-center border-r border-stone-800 align-middle text-xs whitespace-nowrap tabular-nums ${
                          isStartPoint ? 'bg-[#7f7f7f] text-transparent select-none' : ''
                        }`}
                      >
                        {isStartPoint ? '-' : item.travelDuration || '-'}
                      </td>

                      <td className="py-3 px-2 text-center border-r border-stone-800 align-middle font-semibold text-xs whitespace-nowrap tabular-nums">
                        {item.timeIn || item.time.split('-')[0]?.trim()}
                      </td>

                      <td className="py-3 px-2 text-center border-r border-stone-800 align-middle text-xs whitespace-nowrap tabular-nums">
                        {item.durationAtLocation || item.duration}
                      </td>

                      <td className="py-3 px-2 text-center border-r-2 border-stone-800 align-middle font-semibold text-xs whitespace-nowrap tabular-nums">
                        {item.timeOut || item.time.split('-')[1]?.trim() || '-'}
                      </td>

                      <td className="py-3 px-3 sm:px-4 border-r-2 border-stone-800 align-top text-xs leading-relaxed space-y-1.5">
                        <div className="font-bold text-stone-900">{item.activity}</div>

                        {/* List Tokoh */}
                        {linkedTokohList.length > 0 && (
                          <div className="space-y-0.5 pt-1">
                            <span className="font-bold text-stone-800 underline block pb-0.5">Ziarah :</span>
                            {linkedTokohList.map((t, tIdx) => (
                              <div
                                key={t.id}
                                onClick={() => setSelectedTokohBio(t)}
                                className="hover:text-emerald-800 cursor-pointer text-stone-800 font-medium pl-1 flex items-center gap-1"
                              >
                                <span>{tIdx + 1}. {t.name}</span>
                                <span className="text-[10px] text-stone-400 no-print font-normal">(klik bio)</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sub Activities */}
                        {item.subActivities && item.subActivities.length > 0 && (
                          <div className="pt-1 space-y-0.5">
                            {item.subActivities.map((sub, sIdx) => (
                              <div key={sIdx} className="font-semibold text-emerald-900">
                                {sub}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-2 text-center align-middle whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1.5 justify-center">
                          {getStatusBadge(item.status, true, item.id)}
                          <button
                            onClick={() => {
                              const msg = formatPerAgendaWAMessage(item, siteSettings, tokohList, makamList);
                              shareToWhatsApp(msg);
                              showToast(`Membuka WhatsApp untuk agenda "${item.location}"`, 'success');
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs cursor-pointer no-print"
                            title="Bagikan agenda ini ke WhatsApp"
                          >
                            <MessageSquare className="w-2.5 h-2.5 text-emerald-700" />
                            <span>Share WA</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-stone-50 border-t-2 border-stone-800 flex items-center justify-between text-xs text-stone-500">
            <span>Panitia Ziarah An-Nawawi Berjan 2026 · Master Itinerary</span>
            <span className="font-serif italic font-bold">Halaman 1</span>
          </div>
        </div>
      )}

      {/* QUICK BIOGRAPHY MODAL ("otomatis biografi ikut") */}
      {selectedTokohBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-stone-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-5 flex items-start justify-between gap-3 border-b border-emerald-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-900 border-2 border-amber-300 shrink-0">
                  <img
                    src={selectedTokohBio.photo}
                    alt={selectedTokohBio.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white leading-tight font-serif-islamic">
                    {selectedTokohBio.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">
                    {selectedTokohBio.titleOrHonorific}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTokohBio(null)}
                className="text-stone-300 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {/* Quick Info badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedTokohBio.birthYear && (
                  <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md font-semibold">
                    Lahir: {selectedTokohBio.birthYear}
                  </span>
                )}
                {selectedTokohBio.deathYear && (
                  <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md font-semibold">
                    Wafat: {selectedTokohBio.deathYear}
                  </span>
                )}
              </div>

              {/* Biography Section */}
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-stone-900 uppercase text-xs tracking-wider text-emerald-900">
                  Riwayat Hidup & Biografi Ringkas
                </h4>
                <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                  {selectedTokohBio.biography}
                </p>
              </div>

              {/* Struggles & Contribution */}
              {selectedTokohBio.strugglesAndContributions && (
                <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs text-emerald-900">
                    Perjuangan & Keteladanan Dakwah:
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {selectedTokohBio.strugglesAndContributions}
                  </p>
                </div>
              )}

              {/* Genealogy / Legacy */}
              {selectedTokohBio.genealogy && (
                <div className="text-xs text-stone-500">
                  <strong className="text-stone-800">Silsilah:</strong> {selectedTokohBio.genealogy}
                </div>
              )}

              {/* Action */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedTokohBio(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const slug = selectedTokohBio.slug;
                    setSelectedTokohBio(null);
                    navigateTo('tokoh-detail', slug);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Lihat Profil Lengkap Tokoh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Notes */}
      <div className="text-center text-xs text-stone-400 pt-4 hidden print-only">
        Dicetak dari Sistem Informasi Ziarah An-Nawawi 2026 · Pondok Pesantren An-Nawawi Berjan Purworejo
      </div>
    </div>
  );
};
