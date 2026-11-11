import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Share2,
  ArrowRight,
  Filter,
  CheckCircle,
  Bus,
  Navigation,
  Milestone,
} from 'lucide-react';

export const AgendaView: React.FC = () => {
  const { agendaList, makamList, tokohList, navigateTo, openShareModal } = useApp();

  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique days
  const availableDays = useMemo(() => {
    const days = Array.from(new Set(agendaList.map((a) => a.dayNumber))).sort((a, b) => a - b);
    return days;
  }, [agendaList]);

  // Filtered Agendas
  const filteredAgendas = useMemo(() => {
    return agendaList
      .filter((a) => a.status === 'published')
      .filter((a) => (selectedDay === 'all' ? true : a.dayNumber === selectedDay))
      .filter((a) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.technicalNotes.toLowerCase().includes(q) ||
          a.dayName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [agendaList, selectedDay, searchQuery]);

  // Group agendas by day
  const groupedAgendas = useMemo(() => {
    const map = new Map<number, typeof filteredAgendas>();
    filteredAgendas.forEach((item) => {
      if (!map.has(item.dayNumber)) {
        map.set(item.dayNumber, []);
      }
      map.get(item.dayNumber)!.push(item);
    });
    return map;
  }, [filteredAgendas]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8 w-full max-w-full overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Agenda Perjalanan' }]} />

      {/* Header Section */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          Rangkaian Safar Religi
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Agenda Perjalanan Ziarah An-Nawawi 2026
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          Timeline lengkap rangkaian kegiatan ziarah makam Auliya', Ulama', dan Pejuang Pondok Pesantren An-Nawawi Berjan Purworejo dari hari pertama hingga kepulangan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        {/* Day Switcher / Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Semua Hari
          </button>
          {availableDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Hari ke-{day}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari agenda atau kegiatan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Timeline Section */}
      {groupedAgendas.size === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-xs text-stone-500">
          Tidak ada agenda yang cocok dengan filter hari atau pencarian Anda.
        </div>
      ) : (
        Array.from(groupedAgendas.entries()).map(([dayNum, agendas]) => {
          const firstItem = agendas[0];
          return (
            <div key={dayNum} className="space-y-4">
              {/* Day Header Banner */}
              <div className="flex items-center gap-3 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-xs">
                <Calendar className="w-4 h-4 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    HARI KE-{dayNum} · {firstItem.dayName}
                  </h3>
                </div>
              </div>

              {/* Day's Timeline Items */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
                {agendas.map((agenda) => {
                  const location = makamList.find((m) => m.id === agenda.locationId);
                  const relatedFigures = tokohList.filter((t) => agenda.figureIds?.includes(t.id));

                  return (
                    <React.Fragment key={agenda.id}>
                      <div
                        className="relative bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-emerald-600/50 transition-all space-y-4 group"
                      >
                        {/* Timeline Node Dot */}
                        <div className="absolute -left-6 sm:-left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-emerald-800 bg-white group-hover:bg-emerald-800 transition-colors" />

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-stone-500">
                              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {agenda.startTime} - {agenda.endTime} WIB
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>Durasi ± {agenda.durationMinutes} Menit</span>
                            </div>

                            <h3
                              onClick={() => navigateTo('agenda-detail', agenda.slug)}
                              className="text-base sm:text-lg font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer"
                            >
                              {agenda.title}
                            </h3>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                openShareModal({
                                  title: agenda.title,
                                  summary: `${agenda.dayName} (${agenda.startTime} - ${agenda.endTime} WIB) - ${agenda.description}`,
                                  url: `${window.location.origin}/#/agenda/${agenda.slug}`,
                                })
                              }
                              className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="Bagikan Agenda Ini"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigateTo('agenda-detail', agenda.slug)}
                              className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>Detail</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Description Prose */}
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                          {agenda.description}
                        </p>

                        {/* Technical Notes / Special Notes */}
                        {agenda.technicalNotes && (
                          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600">
                            <span className="font-semibold text-stone-800 block mb-0.5">
                              Keterangan Teknis:
                            </span>
                            <span>{agenda.technicalNotes}</span>
                          </div>
                        )}

                        {/* Associated Links to Lokasi & Tokoh */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-stone-100 text-xs">
                          {location && (
                            <div className="flex items-center gap-1.5 text-stone-600">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Lokasi:</span>
                              <button
                                onClick={() => navigateTo('lokasi-detail', location.slug)}
                                className="font-semibold text-emerald-800 hover:underline cursor-pointer"
                              >
                                {location.name}
                              </button>
                            </div>
                          )}

                          {relatedFigures.length > 0 && (
                            <div className="flex items-center gap-1.5 text-stone-600">
                              <span aria-hidden="true">·</span>
                              <Users className="w-3.5 h-3.5 text-amber-600" />
                              <span>Tokoh Terkait:</span>
                              {relatedFigures.map((figure, idx) => (
                                <React.Fragment key={figure.id}>
                                  <button
                                    onClick={() => navigateTo('tokoh-detail', figure.slug)}
                                    className="font-semibold text-emerald-800 hover:underline cursor-pointer"
                                  >
                                    {figure.name}
                                  </button>
                                  {idx < relatedFigures.length - 1 && <span>,</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ESTIMASI WAKTU PERJALANAN MENUJU MAKBARAH BERIKUTNYA */}
                      {agenda.transitDuration && (
                        <div className="relative my-3 p-3.5 sm:p-4 bg-gradient-to-r from-amber-50/90 via-emerald-50/70 to-amber-50/90 border border-amber-300/80 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Bus className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 font-bold text-emerald-950">
                                <Navigation className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Estimasi Perjalanan Antar-Makam:</span>
                                <span className="text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold">
                                  {agenda.transitDuration}
                                </span>
                              </div>
                              {agenda.travelNotes && (
                                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                                  {agenda.travelNotes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-white/90 px-2.5 py-1 rounded-md border border-stone-200 self-start sm:self-auto shrink-0 shadow-2xs">
                            <Milestone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Rute Konvoi Armada Bus</span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
