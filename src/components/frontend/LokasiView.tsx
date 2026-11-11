import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  MapPin,
  Clock,
  Users,
  Search,
  ArrowRight,
  Navigation,
  Share2,
} from 'lucide-react';

export const LokasiView: React.FC = () => {
  const { makamList, tokohList, navigateTo, openShareModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegency, setSelectedRegency] = useState<string>('all');

  const availableRegencies = useMemo(() => {
    return Array.from(new Set(makamList.map((m) => m.regency))).sort();
  }, [makamList]);

  const filteredMakam = useMemo(() => {
    return makamList
      .filter((m) => m.status === 'published')
      .filter((m) => (selectedRegency === 'all' ? true : m.regency === selectedRegency))
      .filter((m) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.address.toLowerCase().includes(q) ||
          m.regency.toLowerCase().includes(q)
        );
      });
  }, [makamList, selectedRegency, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8 w-full max-w-full overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Lokasi Makam Ziarah' }]} />

      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          Destinasi Maqbarah
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Daftar Lokasi Makam Ziarah An-Nawawi 2026
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          Situs maqbarah auliya', ulama', dan pejuang yang diziarahi oleh keluarga besar Pondok Pesantren An-Nawawi Berjan Purworejo. Klik lokasi untuk melihat sejarah, fasilitas, dan tokoh yang dimakamkan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRegency('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedRegency === 'all'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Semua Wilayah ({makamList.length})
          </button>
          {availableRegencies.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegency(reg)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegency === reg
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi makam..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Grid of Makam */}
      {filteredMakam.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-xs text-stone-500">
          Tidak ada lokasi makam yang sesuai kriteria pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMakam.map((makam) => {
            const buriedFigures = tokohList.filter((t) => makam.figureIds.includes(t.id));

            return (
              <div
                key={makam.id}
                onClick={() => navigateTo('lokasi-detail', makam.slug)}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                {/* Photo */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={makam.image}
                    alt={makam.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{makam.regency}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{makam.estimatedDuration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {makam.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {makam.district}, {makam.regency}
                    </p>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {makam.description}
                    </p>
                  </div>

                  {/* Buried Figures badge preview */}
                  {buriedFigures.length > 0 && (
                    <div className="pt-2 border-t border-stone-100">
                      <div className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-medium text-stone-700">Tokoh yang Dimakamkan:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {buriedFigures.map((fig) => (
                          <span
                            key={fig.id}
                            className="text-xs text-emerald-900 font-semibold"
                          >
                            {fig.name}
                            {buriedFigures.indexOf(fig) < buriedFigures.length - 1 && <span className="text-stone-300 ml-1">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                      <span>Lihat Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareModal({
                          title: makam.name,
                          summary: `${makam.address}, ${makam.regency}. ${makam.description}`,
                          url: `${window.location.origin}/#/lokasi/${makam.slug}`,
                          image: makam.image,
                        });
                      }}
                      className="p-1.5 text-stone-400 hover:text-emerald-800 rounded-md transition-colors"
                      title="Bagikan Lokasi"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
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
