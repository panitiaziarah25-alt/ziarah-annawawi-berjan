import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Image,
  Video,
  Share2,
  Calendar,
  MapPin,
  ExternalLink,
  Play,
} from 'lucide-react';

export const DokumentasiView: React.FC = () => {
  const {
    documentationList,
    makamList,
    openLightbox,
    openShareModal,
    siteSettings,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'foto' | 'video'>('all');

  const filteredDocs = useMemo(() => {
    return documentationList
      .filter((d) => (selectedDay === 'all' ? true : d.dayNumber === selectedDay))
      .filter((d) => (selectedType === 'all' ? true : d.type === selectedType));
  }, [documentationList, selectedDay, selectedType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Dokumentasi Kegiatan' }]} />

      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          Galeri Visual Safar
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Dokumentasi Ziarah An-Nawawi 2026
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          {siteSettings.dokumentasiIntroNarration ||
            "Koleksi dokumentasi foto dan rekaman video perjalanan ziarah makam Auliya', Ulama', dan Pejuang Pondok Pesantren An-Nawawi Berjan Purworejo. Klik foto untuk memperbesar dengan tampilan lightbox."}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'all'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Semua Media
          </button>
          <button
            onClick={() => setSelectedType('foto')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'foto'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Foto Saja</span>
          </button>
          <button
            onClick={() => setSelectedType('video')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'video'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Saja</span>
          </button>
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-500 font-medium mr-1 shrink-0">Hari:</span>
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Semua
          </button>
          {[1, 2, 3, 4].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              H-{day}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-xs text-stone-500">
          Belum ada dokumentasi untuk filter yang dipilih.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((item) => {
            const location = makamList.find((m) => m.id === item.locationId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Media Container */}
                <div
                  onClick={() => {
                    if (item.type === 'foto') {
                      openLightbox({
                        url: item.mediaUrl,
                        title: item.title,
                        caption: item.caption,
                      });
                    } else {
                      window.open(item.mediaUrl, '_blank');
                    }
                  }}
                  className="relative aspect-16/10 bg-stone-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1 font-medium">
                    {item.type === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                    <span>{item.type === 'video' ? 'Video' : 'Foto'}</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-emerald-900/80 backdrop-blur-xs text-white text-xs px-2 py-0.5 rounded-md font-medium">
                    Hari ke-{item.dayNumber}
                  </div>
                </div>

                {/* Content description */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{item.date}</span>
                      {location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{location.name}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (item.type === 'foto') {
                          openLightbox({
                            url: item.mediaUrl,
                            title: item.title,
                            caption: item.caption,
                          });
                        } else {
                          window.open(item.mediaUrl, '_blank');
                        }
                      }}
                      className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.type === 'video' ? 'Putar Video' : 'Lihat Ukuran Penuh'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openShareModal({
                          title: item.title,
                          summary: item.caption,
                          url: `${window.location.origin}/#/dokumentasi`,
                          image: item.mediaUrl,
                        })
                      }
                      className="p-1.5 text-stone-400 hover:text-emerald-800 rounded-md transition-colors"
                      title="Bagikan Dokumentasi"
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
