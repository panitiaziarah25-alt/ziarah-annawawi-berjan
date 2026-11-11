import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  User,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Scroll,
  GraduationCap,
  Share2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const TokohDetailView: React.FC = () => {
  const {
    tokohList,
    makamList,
    selectedDetailSlug,
    navigateTo,
    openShareModal,
    openLightbox,
  } = useApp();

  const tokoh = tokohList.find((t) => t.slug === selectedDetailSlug) || tokohList[0];

  if (!tokoh) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900">Profil Tokoh Tidak Ditemukan</h2>
        <button
          onClick={() => navigateTo('tokoh')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg"
        >
          Kembali ke Direktori Tokoh
        </button>
      </div>
    );
  }

  const tombLocation = makamList.find((m) => m.id === tokoh.tombLocationId);

  // Prev & Next figures
  const currentIndex = tokohList.findIndex((t) => t.id === tokoh.id);
  const prevTokoh = currentIndex > 0 ? tokohList[currentIndex - 1] : null;
  const nextTokoh = currentIndex < tokohList.length - 1 ? tokohList[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Profil Tokoh', view: 'tokoh' },
          { label: tokoh.name },
        ]}
      />

      {/* Main Biography Card */}
      <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Top Header Strip with Portrait */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            onClick={() =>
              openLightbox({
                url: tokoh.photo,
                title: tokoh.name,
                caption: tokoh.titleOrHonorific,
              })
            }
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400/80 shrink-0 shadow-lg cursor-zoom-in bg-stone-800"
          >
            <img
              src={tokoh.photo}
              alt={tokoh.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0 space-y-2">
            <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest">
              {tokoh.titleOrHonorific}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-islamic font-bold text-white leading-tight">
              {tokoh.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-emerald-200 pt-1">
              {(tokoh.birthYear || tokoh.deathYear) && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Masa Hidup: {tokoh.birthYear || '?'} - {tokoh.deathYear || '?'}
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() =>
                  openShareModal({
                    title: `${tokoh.name} (${tokoh.titleOrHonorific})`,
                    summary: `${tokoh.biography.slice(0, 150)}...`,
                    url: `${window.location.origin}/#/tokoh/${tokoh.slug}`,
                    image: tokoh.photo,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Biografi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Riwayat Kehidupan (Biography) */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Riwayat Hidup & Keteladanan</span>
            </h2>
            <div className="text-sm text-stone-700 font-serif leading-relaxed space-y-3">
              <p>{tokoh.biography}</p>
            </div>
          </section>

          {/* Silsilah & Nasab Keluarga */}
          {tokoh.genealogy && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Scroll className="w-4 h-4 text-emerald-700" />
                <span>Silsilah & Nasab Keilmuan</span>
              </h2>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                {tokoh.genealogy}
              </div>
            </section>
          )}

          {/* Riwayat Pendidikan */}
          {tokoh.education && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Riwayat Pendidikan & Pesantren</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                {tokoh.education}
              </p>
            </section>
          )}

          {/* Perjuangan & Kontribusi */}
          {tokoh.strugglesAndContributions && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Perjuangan, Dakwah & Kontribusi Kebangsaan</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                {tokoh.strugglesAndContributions}
              </p>
            </section>
          )}

          {/* Karya & Peninggalan */}
          {tokoh.worksAndLegacy && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Scroll className="w-4 h-4 text-emerald-700" />
                <span>Karya Kitab, Warisan & Peninggalan</span>
              </h2>
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs sm:text-sm text-emerald-950 font-serif leading-relaxed">
                {tokoh.worksAndLegacy}
              </div>
            </section>
          )}

          {/* Lokasi Makam (LINKED LOKASI) */}
          {tombLocation && (
            <section className="pt-4 border-t border-stone-200">
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-emerald-800 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-800">
                      Lokasi Pusara / Maqbarah Beliau
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {tombLocation.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {tombLocation.address}, {tombLocation.regency}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('lokasi-detail', tombLocation.slug)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span>Buka Profil Lokasi Makam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          )}
        </div>
      </article>

      {/* Prev / Next Figure Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-200">
        {prevTokoh ? (
          <button
            onClick={() => navigateTo('tokoh-detail', prevTokoh.slug)}
            className="flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-emerald-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="line-clamp-1">Sebelumnya: {prevTokoh.name}</span>
          </button>
        ) : (
          <div />
        )}

        {nextTokoh ? (
          <button
            onClick={() => navigateTo('tokoh-detail', nextTokoh.slug)}
            className="flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-emerald-800 cursor-pointer"
          >
            <span className="line-clamp-1">Berikutnya: {nextTokoh.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
