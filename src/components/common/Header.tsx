import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Shield,
  UserCircle,
  Compass,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, navigateTo, currentUser, setIsSearchOpen, siteSettings, ziarahMode } = useApp();

  const navLinks = [
    { label: 'Beranda', view: 'beranda' },
    { label: 'Profil Kegiatan', view: 'profil-kegiatan' },
    { label: 'Agenda', view: 'agenda' },
    { label: 'Rundown', view: 'rundown' },
    { label: 'Lokasi Makam', view: 'lokasi' },
    { label: 'Profil Tokoh', view: 'tokoh' },
    { label: 'Doa & Tahlil', view: 'doa' },
    { label: 'Informasi Peserta', view: 'informasi-peserta' },
    { label: 'Berita', view: 'berita' },
    { label: 'Dokumentasi', view: 'dokumentasi' },
  ];

  const handleNavClick = (view: string) => {
    navigateTo(view);
  };

  const modeLabel = ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur)' : 'Ziarah Ngulon (Jawa Barat & Banten)';
  const modeShort = ziarahMode === 'ngetan' ? 'Rute Ngetan' : 'Rute Ngulon';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs w-full max-w-full overflow-x-hidden">
      {/* Top Banner Utility Strip (Desktop Only) */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 hidden md:flex items-center justify-between border-b border-emerald-900 w-full">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="font-arabic text-sm text-amber-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <div className="flex items-center gap-4 text-emerald-200 text-[11px] sm:text-xs">
            <span>{siteSettings?.organizer || 'Pondok Pesantren An-Nawawi Berjan Purworejo'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Mode: {modeLabel}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-100">Hotline: {siteSettings?.hotline || siteSettings?.contactWhatsApp}</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar - Clean Layout Tanpa Garis Tiga */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* IDENTITAS BRAND & LOGO (KIRI) */}
        <div
          onClick={() => handleNavClick('beranda')}
          className="cursor-pointer flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 lg:flex-none group"
        >
          {siteSettings?.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt="Logo An-Nawawi"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg border border-stone-200 bg-white shrink-0 group-hover:border-emerald-600 transition-colors"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-serif-islamic font-bold text-base sm:text-lg shadow-sm border border-emerald-700 shrink-0 group-hover:bg-emerald-900 transition-colors">
              AN
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm sm:text-base tracking-tight text-emerald-950 truncate group-hover:text-emerald-800 transition-colors">
                {siteSettings?.siteTitle || 'Ziarah An-Nawawi 2026'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300 font-bold shrink-0">
                {modeShort}
              </span>
            </div>
            <span className="text-[11px] text-stone-600 truncate hidden sm:inline">
              {siteSettings?.tagline || "Makam Auliya', Ulama' & Pejuang"}
            </span>
          </div>
        </div>

        {/* NAVIGASI DESKTOP (TERSEMBUNYI DI HP) */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-medium text-stone-700">
          {navLinks.map((link) => {
            const isActive =
              currentView === link.view ||
              (link.view === 'lokasi' && currentView === 'lokasi-detail') ||
              (link.view === 'tokoh' && currentView === 'tokoh-detail') ||
              (link.view === 'agenda' && currentView === 'agenda-detail') ||
              (link.view === 'berita' && currentView === 'berita-detail');
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                    : 'hover:text-emerald-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* POJOK KANAN: PENCARIAN & LOGIN / PANEL ADMIN */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Pencarian Global"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Cari makam, tokoh, jadwal, doa..."
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {currentUser ? (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
              <span className="hidden xs:inline">Admin</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('login-admin')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs rounded-lg transition-colors cursor-pointer"
              title="Masuk Login Panitia"
            >
              <UserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
