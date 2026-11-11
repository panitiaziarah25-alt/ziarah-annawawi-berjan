import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  User,
  MapPin,
  Search,
  ArrowRight,
  BookOpen,
  Share2,
} from 'lucide-react';

export const TokohView: React.FC = () => {
  const { tokohList, makamList, navigateTo, openShareModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokoh = useMemo(() => {
    return tokohList
      .filter((t) => t.status === 'published')
      .filter((t) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.titleOrHonorific.toLowerCase().includes(q) ||
          t.biography.toLowerCase().includes(q) ||
          t.strugglesAndContributions.toLowerCase().includes(q) ||
          t.worksAndLegacy.toLowerCase().includes(q)
        );
      });
  }, [tokohList, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8 w-full max-w-full overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Profil Tokoh' }]} />

      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          Biografi & Keteladanan
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Profil Tokoh Auliya', Ulama', dan Pejuang
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          Mengenal lebih dekat rekam jejak, silsilah nasab, kiprah perjuangan, serta karya peninggalan para shalihin yang menjadi tujuan safar ziarah Pondok Pesantren An-Nawawi Berjan Purworejo.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <span className="text-xs text-stone-500 font-medium">
          Menampilkan {filteredTokoh.length} profil tokoh shalihin
        </span>
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tokoh, gelar, atau karya..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Figures Grid */}
      {filteredTokoh.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-xs text-stone-500">
          Tidak ada profil tokoh yang sesuai dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokoh.map((tokoh) => {
            const tombLocation = makamList.find((m) => m.id === tokoh.tombLocationId);

            return (
              <div
                key={tokoh.id}
                onClick={() => navigateTo('tokoh-detail', tokoh.slug)}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                {/* Photo & Honorific Header */}
                <div className="p-5 flex items-start gap-4 border-b border-stone-100 bg-stone-50/50">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-700 shrink-0 bg-stone-200 shadow-xs">
                    <img
                      src={tokoh.photo}
                      alt={tokoh.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-emerald-800 line-clamp-1">
                      {tokoh.titleOrHonorific}
                    </span>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {tokoh.name}
                    </h3>
                    {(tokoh.birthYear || tokoh.deathYear) && (
                      <div className="text-xs text-stone-600 mt-0.5">
                        {tokoh.birthYear || '?'} - {tokoh.deathYear || '?'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Biography Snippet */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-stone-600 font-serif line-clamp-3 leading-relaxed">
                      {tokoh.biography}
                    </p>

                    {/* Works / Legacy if available */}
                    {tokoh.worksAndLegacy && (
                      <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                        <span className="font-semibold text-stone-800 block mb-0.5">
                          Karya / Peninggalan:
                        </span>
                        <span className="line-clamp-2">{tokoh.worksAndLegacy}</span>
                      </div>
                    )}
                  </div>

                  {/* Tomb Location & Action */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    {tombLocation && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">
                          Makam: <strong className="text-stone-900">{tombLocation.name}</strong>
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 pt-1">
                      <span className="flex items-center gap-1">
                        <span>Baca Biografi Lengkap</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal({
                            title: `${tokoh.name} (${tokoh.titleOrHonorific})`,
                            summary: `${tokoh.biography.slice(0, 120)}...`,
                            url: `${window.location.origin}/#/tokoh/${tokoh.slug}`,
                            image: tokoh.photo,
                          });
                        }}
                        className="p-1.5 text-stone-400 hover:text-emerald-800 rounded-md transition-colors"
                        title="Bagikan Profil Tokoh"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
