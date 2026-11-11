import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle,
  Bus,
} from 'lucide-react';

export const AgendaDetailView: React.FC = () => {
  const { agendaList, makamList, tokohList, selectedDetailSlug, navigateTo, openShareModal } = useApp();

  const agenda = agendaList.find((a) => a.slug === selectedDetailSlug) || agendaList[0];

  if (!agenda) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900">Agenda Tidak Ditemukan</h2>
        <button
          onClick={() => navigateTo('agenda')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg"
        >
          Kembali ke Daftar Agenda
        </button>
      </div>
    );
  }

  const location = makamList.find((m) => m.id === agenda.locationId);
  const relatedFigures = tokohList.filter((t) => agenda.figureIds?.includes(t.id));

  // Prev / Next Agenda
  const currentIndex = agendaList.findIndex((a) => a.id === agenda.id);
  const prevAgenda = currentIndex > 0 ? agendaList[currentIndex - 1] : null;
  const nextAgenda = currentIndex < agendaList.length - 1 ? agendaList[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Agenda Perjalanan', view: 'agenda' },
          { label: agenda.title },
        ]}
      />

      {/* Main Card */}
      <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {agenda.photo && (
          <div className="relative aspect-21/9 sm:aspect-16/7 bg-stone-100 overflow-hidden">
            <img
              src={agenda.photo}
              alt={agenda.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-md">
                Hari ke-{agenda.dayNumber}
              </span>
              <span className="flex items-center gap-1 font-medium text-stone-800">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                {agenda.dayName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <Clock className="w-3.5 h-3.5" />
                {agenda.startTime} - {agenda.endTime} WIB
              </span>
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: agenda.title,
                  summary: `${agenda.dayName} - ${agenda.description}`,
                  url: `${window.location.origin}/#/agenda/${agenda.slug}`,
                  image: agenda.photo || location?.image,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-700" />
              <span>Bagikan Agenda</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            {agenda.title}
          </h1>

          {/* Description */}
          <div className="space-y-4 text-stone-700 font-serif leading-relaxed text-sm sm:text-base">
            <p>{agenda.description}</p>
          </div>

          {/* Technical and Special Notes Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {agenda.technicalNotes && (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-stone-900">
                  <Info className="w-4 h-4 text-emerald-800" />
                  <span>Keterangan Teknis & Perlengkapan</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {agenda.technicalNotes}
                </p>
              </div>
            )}

            {agenda.specialNotes && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-950">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Catatan Khusus Panitia</span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  {agenda.specialNotes}
                </p>
              </div>
            )}

            {agenda.transitDuration && (
              <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1 sm:col-span-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                  <Bus className="w-4 h-4 text-amber-700" />
                  <span>Estimasi Waktu Perjalanan Antar-Makam:</span>
                  <span className="bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md font-mono text-[11px]">
                    {agenda.transitDuration}
                  </span>
                </div>
                {agenda.travelNotes && (
                  <p className="text-xs text-amber-900 leading-relaxed pt-0.5">
                    {agenda.travelNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Linked Location & Figures */}
          <div className="pt-6 border-t border-stone-100 space-y-4">
            {location && (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-800 text-white rounded-lg shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-800">
                      Lokasi Tujuan Agenda
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{location.name}</h4>
                    <p className="text-xs text-stone-600 mt-0.5">{location.address}, {location.regency}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('lokasi-detail', location.slug)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Lihat Profil Makam
                </button>
              </div>
            )}

            {relatedFigures.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Tokoh Auliya' / Ulama' Terkait Agenda Ini
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedFigures.map((figure) => (
                    <div
                      key={figure.id}
                      onClick={() => navigateTo('tokoh-detail', figure.slug)}
                      className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-600/50 transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <img
                        src={figure.photo}
                        alt={figure.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-full border border-stone-300"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                          {figure.name}
                        </div>
                        <div className="text-xs text-stone-500 truncate">
                          {figure.titleOrHonorific}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Prev / Next Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-200">
        {prevAgenda ? (
          <button
            onClick={() => navigateTo('agenda-detail', prevAgenda.slug)}
            className="flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-emerald-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="line-clamp-1">Sebelumnya: {prevAgenda.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextAgenda ? (
          <button
            onClick={() => navigateTo('agenda-detail', nextAgenda.slug)}
            className="flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-emerald-800 cursor-pointer"
          >
            <span className="line-clamp-1">Berikutnya: {nextAgenda.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
