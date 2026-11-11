import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Compass,
  Check,
  Home,
  Info,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  Newspaper,
  Image,
  Search,
  Shield,
  UserCircle,
  BookMarked,
  Sparkles,
} from 'lucide-react';

export const NavigationModal: React.FC = () => {
  const {
    isNavModalOpen,
    setIsNavModalOpen,
    currentView,
    navigateTo,
    currentUser,
    setIsSearchOpen,
    setIsBukuSakuOpen,
    siteSettings,
    ziarahMode,
  } = useApp();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavModalOpen) {
        setIsNavModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavModalOpen, setIsNavModalOpen]);

  if (!isNavModalOpen) return null;

  const navCategories = [
    {
      category: 'Jadwal & Agenda Safar',
      items: [
        { label: 'Beranda Utama', view: 'beranda', icon: Home, desc: 'Pusat informasi & hitung mundur' },
        { label: 'Profil Kegiatan', view: 'profil-kegiatan', icon: Info, desc: 'Latar belakang & maksud ziarah' },
        { label: 'Agenda Safar', view: 'agenda', icon: Calendar, desc: 'Jadwal perjalanan per hari' },
        { label: 'Rundown Waktu', view: 'rundown', icon: Clock, desc: 'Tabel estimasi waktu & di jalan' },
      ],
    },
    {
      category: 'Makam Auliya & Tuntunan Amaliah',
      items: [
        { label: 'Lokasi Makam', view: 'lokasi', icon: MapPin, desc: 'Daftar maqbarah yang diziarahi' },
        { label: 'Profil Tokoh Ulama', view: 'tokoh', icon: Users, desc: 'Biografi auliya & pejuang' },
        { label: 'Doa & Tahlil Ziarah', view: 'doa', icon: BookOpen, desc: 'Tuntunan Yasin, Tahlil & amaliah' },
      ],
    },
    {
      category: 'Panduan Peserta & Publikasi',
      items: [
        { label: 'Informasi & Panitia', view: 'informasi-peserta', icon: FileText, desc: 'Tata tertib & susunan panitia' },
        { label: 'Berita & Pengumuman', view: 'berita', icon: Newspaper, desc: 'Warta safar & instruksi panitia' },
        { label: 'Dokumentasi Kegiatan', view: 'dokumentasi', icon: Image, desc: 'Galeri foto & liputan video' },
      ],
    },
  ];

  const handleNavClick = (view: string) => {
    navigateTo(view);
    setIsNavModalOpen(false);
  };

  const modeShort = ziarahMode === 'ngetan' ? 'Rute Ngetan' : 'Rute Ngulon';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nav-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsNavModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Popup */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {siteSettings?.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt="Logo An-Nawawi"
                className="w-10 h-10 object-contain rounded-lg border border-emerald-700 bg-white p-0.5 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-serif-islamic font-bold text-base border border-emerald-700 shrink-0 shadow-xs">
                AN
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 id="nav-modal-title" className="font-bold text-sm sm:text-base text-white truncate">
                  Navigasi & Direktori Safar
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shrink-0">
                  {modeShort}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 truncate flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                <span>Pondok Pesantren An-Nawawi Berjan Purworejo</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNavModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2 border border-emerald-800"
            aria-label="Tutup Menu Navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Scrollable Categories & Navigation Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Informasi Rute Resmi Yang Sedang Berjalan (Ditetapkan Admin) */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Rute Resmi Yang Ditetapkan Panitia:
                </span>
                <span className="text-xs font-bold text-emerald-950 block truncate">
                  {ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur & Madura)' : 'Ziarah Ngulon (Jawa Barat & Banten)'}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 shrink-0">
              {modeShort}
            </span>
          </div>

          {/* Categorized Menu Links (Grid Card Style) */}
          {navCategories.map((cat) => (
            <div key={cat.category} className="space-y-1.5">
              <div className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider px-1">
                {cat.category}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.view ||
                    (item.view === 'lokasi' && currentView === 'lokasi-detail') ||
                    (item.view === 'tokoh' && currentView === 'tokoh-detail') ||
                    (item.view === 'agenda' && currentView === 'agenda-detail') ||
                    (item.view === 'berita' && currentView === 'berita-detail');

                  return (
                    <button
                      key={item.view}
                      type="button"
                      onClick={() => handleNavClick(item.view)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isActive
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm font-bold'
                          : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-emerald-900 text-amber-300'
                              : 'bg-white text-emerald-800 border border-stone-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block truncate leading-tight">
                            {item.label}
                          </span>
                          <span
                            className={`text-[10px] block truncate leading-tight ${
                              isActive ? 'text-emerald-200' : 'text-stone-500'
                            }`}
                          >
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      {isActive && <Check className="w-4 h-4 text-amber-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Akses Khusus: Buku Saku Digital */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                <BookMarked className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-amber-950 block truncate">
                  Buku Saku Digital Jamaah
                </span>
                <span className="text-[10px] text-amber-800/80 block truncate">
                  Panduan lengkap ziarah, aurad & adab saku
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsNavModalOpen(false);
                setIsBukuSakuOpen(true);
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Buka Kitab
            </button>
          </div>
        </div>

        {/* Footer Modal: Quick Actions & Close */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsNavModalOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-emerald-800" />
              <span>Pencarian Cepat</span>
            </button>

            {currentUser ? (
              <button
                type="button"
                onClick={() => handleNavClick('admin-dashboard')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('login-admin')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <UserCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Login Panitia</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsNavModalOpen(false)}
            className="w-full py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 bg-white border border-stone-200 rounded-lg transition-colors cursor-pointer text-center"
          >
            Tutup Menu Navigasi
          </button>
        </div>
      </div>
    </div>
  );
};
