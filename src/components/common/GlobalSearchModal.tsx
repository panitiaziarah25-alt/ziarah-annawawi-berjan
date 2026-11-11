import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, MapPin, User, Calendar, Clock, Newspaper, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    makamList,
    tokohList,
    agendaList,
    rundownList,
    postsList,
    navigateTo,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: {
      id: string;
      title: string;
      category: string;
      summary: string;
      image?: string;
      icon: any;
      onClick: () => void;
    }[] = [];

    // Search Makam
    makamList.forEach((m) => {
      if (
        m.name.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.regency.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: m.id,
          title: m.name,
          category: 'Lokasi Makam',
          summary: `${m.regency} · ${m.description.slice(0, 95)}...`,
          image: m.image,
          icon: MapPin,
          onClick: () => {
            navigateTo('lokasi-detail', m.slug);
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Tokoh
    tokohList.forEach((t) => {
      if (
        t.name.toLowerCase().includes(q) ||
        t.titleOrHonorific.toLowerCase().includes(q) ||
        t.biography.toLowerCase().includes(q) ||
        t.strugglesAndContributions.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          title: t.name,
          category: 'Profil Tokoh',
          summary: `${t.titleOrHonorific} · ${t.biography.slice(0, 95)}...`,
          image: t.photo,
          icon: User,
          onClick: () => {
            navigateTo('tokoh-detail', t.slug);
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Agenda
    agendaList.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.technicalNotes.toLowerCase().includes(q)
      ) {
        results.push({
          id: a.id,
          title: a.title,
          category: 'Agenda Perjalanan',
          summary: `${a.dayName} (${a.startTime} - ${a.endTime} WIB) · ${a.description.slice(0, 85)}...`,
          image: a.photo,
          icon: Calendar,
          onClick: () => {
            navigateTo('agenda-detail', a.slug);
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Rundown
    rundownList.forEach((r) => {
      if (
        r.activity?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.notes?.toLowerCase().includes(q) ||
        r.subActivities?.some((sub) => sub.toLowerCase().includes(q))
      ) {
        results.push({
          id: r.id,
          title: r.activity,
          category: 'Rundown Jadwal',
          summary: `${r.dayName} · ${r.time} · ${r.location}`,
          icon: Clock,
          onClick: () => {
            navigateTo('rundown');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Search Berita & Pengumuman
    postsList.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          title: p.title,
          category: p.type === 'pengumuman' ? 'Pengumuman' : 'Berita',
          summary: p.summary.slice(0, 110) + '...',
          image: p.image,
          icon: Newspaper,
          onClick: () => {
            navigateTo('berita-detail', p.slug);
            setIsSearchOpen(false);
          },
        });
      }
    });

    return results;
  }, [query, makamList, tokohList, agendaList, rundownList, postsList, navigateTo, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 bg-stone-50">
          <Search className="w-5 h-5 text-emerald-800 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama makam, tokoh wali, jadwal agenda, berita..."
            className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-600 p-1"
            >
              Hapus
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-stone-500 hover:text-stone-800 p-1 rounded-md"
            aria-label="Tutup Pencarian"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 divide-y divide-stone-100 space-y-1">
          {query.trim() === '' ? (
            <div className="py-10 text-center text-xs text-stone-500 space-y-2">
              <p className="font-medium text-stone-700">Pencarian Terpadu Ziarah An-Nawawi 2026</p>
              <p>Coba kata kunci: "Sunan Kalijaga", "Menara Kudus", "Berjan", "Tebuireng", "Armada Bus"</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-500">
              Tidak ditemukan hasil untuk kata kunci <span className="font-semibold text-stone-700">"{query}"</span>
            </div>
          ) : (
            searchResults.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className="py-3 px-3 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors flex items-start gap-3.5 group"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-md border border-stone-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-medium text-emerald-800">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors truncate mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 shrink-0 self-center" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex justify-between items-center">
          <span>{searchResults.length} hasil ditemukan</span>
          <span className="hidden sm:inline">Tekan Esc untuk menutup</span>
        </div>
      </div>
    </div>
  );
};
