import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  MapPin,
  Clock,
  Navigation,
  Share2,
  Users,
  Calendar,
  Building,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const LokasiDetailView: React.FC = () => {
  const {
    makamList,
    tokohList,
    agendaList,
    selectedDetailSlug,
    navigateTo,
    openShareModal,
    openLightbox,
  } = useApp();

  const makam = makamList.find((m) => m.slug === selectedDetailSlug) || makamList[0];

  if (!makam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900">Lokasi Makam Tidak Ditemukan</h2>
        <button
          onClick={() => navigateTo('lokasi')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg"
        >
          Kembali ke Daftar Lokasi
        </button>
      </div>
    );
  }

  // Linked Figures (Multi-relation!)
  const buriedFigures = tokohList.filter((t) => makam.figureIds?.includes(t.id));

  // Linked Agendas
  const relatedAgendas = agendaList.filter((a) => a.locationId === makam.id);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    makam.mapsQuery || makam.name + ' ' + makam.regency
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Lokasi Makam', view: 'lokasi' },
          { label: makam.name },
        ]}
      />

      {/* Main Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white border border-stone-200 shadow-md">
        <div className="relative aspect-21/9 sm:aspect-16/7 overflow-hidden">
          <img
            src={makam.image}
            alt={makam.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <MapPin className="w-4 h-4" />
              <span>{makam.district}, {makam.regency}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-200">
                <Clock className="w-3.5 h-3.5" />
                Durasi Kunjungan ± {makam.estimatedDuration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Petunjuk Arah (Maps)</span>
              </a>

              <button
                onClick={() =>
                  openShareModal({
                    title: makam.name,
                    summary: `${makam.address}, ${makam.regency}. ${makam.description}`,
                    url: `${window.location.origin}/#/lokasi/${makam.slug}`,
                    image: makam.image,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-islamic font-bold text-white leading-tight">
            {makam.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            {makam.address}
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Description, History, Figures */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deskripsi & Gambaran */}
          <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2.5">
              Deskripsi Kawasan Maqbarah
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed font-serif">
              {makam.description}
            </p>
          </section>

          {/* Sejarah Tempat */}
          {makam.history && (
            <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 border-b border-stone-100 pb-2.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h2 className="text-lg font-bold text-stone-900">Sejarah & Rekam Jejak</h2>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed font-serif">
                {makam.history}
              </p>
            </section>
          )}

          {/* Tokoh yang Dimakamkan (MULTI-RELATION FEATURE) */}
          <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2 text-emerald-800">
                <Users className="w-4 h-4 text-amber-500" />
                <h2 className="text-lg font-bold text-stone-900">
                  Tokoh yang Dimakamkan di Sini ({buriedFigures.length})
                </h2>
              </div>
            </div>

            {buriedFigures.length === 0 ? (
              <p className="text-xs text-stone-500">Belum ada data tokoh tertaut pada lokasi ini.</p>
            ) : (
              <div className="space-y-3">
                {buriedFigures.map((fig) => (
                  <div
                    key={fig.id}
                    onClick={() => navigateTo('tokoh-detail', fig.slug)}
                    className="p-4 bg-stone-50 hover:bg-emerald-50/50 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={fig.photo}
                        alt={fig.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-full border border-stone-300"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                          {fig.name}
                        </h4>
                        <p className="text-xs text-stone-600 font-medium">
                          {fig.titleOrHonorific}
                        </p>
                        {(fig.birthYear || fig.deathYear) && (
                          <p className="text-xs text-stone-600 mt-0.5">
                            {fig.birthYear || '?'} - {fig.deathYear || '?'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 shrink-0">
                      <span className="hidden sm:inline">Biografi</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Galeri Foto Lokasi */}
          {makam.gallery && makam.gallery.length > 0 && (
            <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2.5">
                Galeri Foto Lokasi
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {makam.gallery.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      openLightbox({
                        url: imgUrl,
                        title: `${makam.name} - Foto ${idx + 1}`,
                      })
                    }
                    className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-200 cursor-zoom-in group bg-stone-100"
                  >
                    <img
                      src={imgUrl}
                      alt={`${makam.name} Foto ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Facilities, Technical Notes, Map Embed */}
        <div className="space-y-6">
          {/* Fasilitas yang Tersedia */}
          <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Fasilitas Peziarah</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-700">
              {makam.facilities.map((fac, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Keterangan Teknis */}
          {makam.technicalNotes && (
            <section className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-2 text-xs text-stone-700">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-emerald-900">
                Instruksi Teknis Kunjungan
              </h3>
              <p className="leading-relaxed text-stone-600">{makam.technicalNotes}</p>
            </section>
          )}

          {/* Agenda Terkait di Lokasi Ini */}
          {relatedAgendas.length > 0 && (
            <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Agenda Terjadwal di Lokasi</span>
              </h3>
              <div className="space-y-2">
                {relatedAgendas.map((ag) => (
                  <div
                    key={ag.id}
                    onClick={() => navigateTo('agenda-detail', ag.slug)}
                    className="p-3 bg-stone-50 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer text-xs"
                  >
                    <div className="font-bold text-stone-900">{ag.title}</div>
                    <div className="text-stone-500 mt-0.5">
                      {ag.dayName} · {ag.startTime} - {ag.endTime} WIB
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Google Maps Preview Card */}
          <section className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>Peta & Lokasi</span>
            </h3>
            <div className="aspect-16/9 bg-stone-100 rounded-lg border border-stone-200 overflow-hidden relative flex items-center justify-center text-center p-4">
              <div className="space-y-2">
                <MapPin className="w-8 h-8 text-emerald-700 mx-auto" />
                <div className="text-xs font-semibold text-stone-800">{makam.name}</div>
                <div className="text-xs text-stone-600 max-w-xs">{makam.address}</div>
              </div>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Petunjuk Arah di Google Maps</span>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};
