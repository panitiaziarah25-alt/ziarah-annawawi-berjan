import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  MapPin,
  Users,
  Newspaper,
  Bus,
  Image,
  UserCheck,
  Settings,
  Download,
  LogOut,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  PhoneCall,
  Palette,
  Compass,
  FileText,
  Bookmark,
  Navigation,
  Cloud,
  MoreVertical,
  ChevronDown,
  X,
  Check,
  FileEdit,
  Paintbrush,
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminAgendaBerjalanManager } from './AdminAgendaBerjalanManager';
import { AdminAgendaManager } from './AdminAgendaManager';
import { AdminRundownManager } from './AdminRundownManager';
import { AdminLokasiManager } from './AdminLokasiManager';
import { AdminTokohManager } from './AdminTokohManager';
import { AdminBeritaManager } from './AdminBeritaManager';
import { AdminPesertaManager } from './AdminPesertaManager';
import { AdminPanitiaManager } from './AdminPanitiaManager';
import { AdminMediaBrandManager } from './AdminMediaBrandManager';
import { AdminDokumentasiManager } from './AdminDokumentasiManager';
import { AdminPenggunaManager } from './AdminPenggunaManager';
import { AdminPengaturanManager } from './AdminPengaturanManager';
import { AdminPluginGuide } from './AdminPluginGuide';
import { AdminDoaManager } from './AdminDoaManager';
import { AdminBukuSakuManager } from './AdminBukuSakuManager';
import { AdminBerkasManager } from './AdminBerkasManager';
import { AdminInfoKilatManager } from './AdminInfoKilatManager';
import { AdminNarasiManager } from './AdminNarasiManager';
import { AdminTemaManager } from './AdminTemaManager';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    navigateTo,
    adminActiveTab,
    setAdminActiveTab,
    siteSettings,
    ziarahMode,
    switchZiarahMode,
    isCloudConnected,
    syncAllToCloud,
  } = useApp();

  // Guard: if not logged in, show access denied prompt
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Akses Dibatasi</h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md leading-relaxed">
          Halaman Dashboard Administrator hanya dapat diakses oleh panitia yang telah berhasil masuk melalui autentikasi login.
        </p>
        <button
          onClick={() => navigateTo('login-admin')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Masuk ke Halaman Login Panitia
        </button>
      </div>
    );
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    // 1. Operasional & Jadwal Safar
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, category: 'Operasional & Jadwal' },
    { id: 'agenda-berjalan', label: 'Agenda Berjalan (Live Tracker)', icon: Navigation, category: 'Operasional & Jadwal' },
    { id: 'agenda', label: 'Kelola Agenda Perjalanan', icon: Calendar, category: 'Operasional & Jadwal' },
    { id: 'rundown', label: 'Kelola Rundown & Waktu', icon: Clock, category: 'Operasional & Jadwal' },

    // 2. Master Data Makam & Ulama
    { id: 'lokasi', label: 'Kelola Lokasi Makam', icon: MapPin, category: 'Master Makam & Ulama' },
    { id: 'tokoh', label: 'Kelola Profil Tokoh Auliya', icon: Users, category: 'Master Makam & Ulama' },
    { id: 'doa', label: 'Pengaturan Bacaan Doa & Amaliah', icon: BookOpen, category: 'Master Makam & Ulama' },
    { id: 'bukusaku', label: 'Pengaturan Buku Saku Digital', icon: Bookmark, category: 'Master Makam & Ulama' },

    // 3. Peserta & Kepanitiaan
    { id: 'peserta', label: 'Kelola Panduan Peserta', icon: Bus, category: 'Peserta & Panitia' },
    { id: 'panitia', label: 'Kelola Susunan Panitia', icon: PhoneCall, category: 'Peserta & Panitia' },
    { id: 'berkas', label: 'Kelola Berkas PDF Download', icon: FileText, category: 'Peserta & Panitia' },

    // 4. Publikasi & Narasi
    { id: 'infokilat', label: 'Kelola Navigasi & Info Kilat', icon: Compass, category: 'Publikasi & Narasi' },
    { id: 'narasi', label: 'Kelola Seluruh Narasi Situs', icon: FileEdit, category: 'Publikasi & Narasi' },
    { id: 'berita', label: 'Kelola Berita & Pengumuman', icon: Newspaper, category: 'Publikasi & Narasi' },
    { id: 'media', label: 'Kelola Logo, Banner & Waktu', icon: Palette, category: 'Publikasi & Narasi' },
    { id: 'dokumentasi', label: 'Kelola Dokumentasi Foto/Video', icon: Image, category: 'Publikasi & Narasi' },

    // 5. Sistem & WordPress
    { id: 'tema', label: 'Pengaturan Tema (Sesuaikan)', icon: Paintbrush, category: 'Sistem & Pengaturan' },
    { id: 'pengguna', label: 'Manajemen Pengguna Admin', icon: UserCheck, category: 'Sistem & Pengaturan', roleRestricted: 'super_admin' },
    { id: 'pengaturan', label: 'Pengaturan Website & WA', icon: Settings, category: 'Sistem & Pengaturan', roleRestricted: 'super_admin' },
    { id: 'plugin', label: 'Unduh Plugin WP & Panduan', icon: Download, category: 'Sistem & Pengaturan' },
  ];

  const currentMenuItem = menuItems.find((m) => m.id === adminActiveTab) || menuItems[0];
  const ActiveIcon = currentMenuItem.icon;

  const getRoleLabel = (role: string) => {
    if (role === 'super_admin') return 'Super Admin (Panitia Inti)';
    if (role === 'admin') return 'Admin Ziarah (Acara)';
    return 'Editor (Publikasi)';
  };

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16 w-full max-w-full overflow-x-hidden">
      {/* Top Admin Header Bar */}
      <div className="bg-emerald-950 text-white border-b border-emerald-900 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {siteSettings.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt="Logo An-Nawawi"
              className="w-8 h-8 object-contain rounded-lg border border-emerald-700 bg-white p-0.5"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-serif-islamic font-bold text-sm border border-emerald-700">
              AN
            </div>
          )}
          <div>
            <div className="font-bold text-sm text-white">
              {siteSettings.siteTitle} · Panel Admin
            </div>
            <div className="text-[11px] text-emerald-300">
              {siteSettings.organizer}
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block text-right">
            <div className="font-semibold text-xs text-white">{currentUser.name}</div>
            <div className="text-[10px] text-amber-300 font-medium">
              {getRoleLabel(currentUser.role)}
            </div>
          </div>

          {/* Cloud Database Status Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
              isCloudConnected
                ? 'bg-emerald-900/90 text-emerald-200 border-emerald-600'
                : 'bg-amber-900/70 text-amber-200 border-amber-600'
            }`}
            title="Tersinkronisasi otomatis dengan Google Cloud Firestore (possible-sphere-t6tvw)"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isCloudConnected ? 'Firebase Cloud: Terhubung' : 'Firebase: Menghubungkan...'}</span>
          </div>

          <button
            onClick={syncAllToCloud}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600 rounded-lg transition-colors cursor-pointer"
            title="Upload dan sinkronkan seluruh database ke Cloud Firestore"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Sinkron ke Cloud</span>
          </button>

          <button
            onClick={() => navigateTo('beranda')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-100 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 rounded-lg transition-colors cursor-pointer"
            title="Buka Website Frontend"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Pratinjau Web</span>
          </button>

          <button
            onClick={logoutUser}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors cursor-pointer"
            title="Keluar dari Panel Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* SAKELAR MODE RUTE ZIARAH TAHUNAN (NGETAN VS NGULON) */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <Compass className="w-4 h-4 text-emerald-800 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">Mode Rute Ziarah Aktif: </span>
              <span className="font-extrabold text-amber-900 uppercase">
                {ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur & Madura)' : 'Ziarah Ngulon (Jawa Barat & Banten)'}
              </span>
              <span className="text-stone-500 block sm:inline sm:ml-2 text-[11px]">
                (Data tiap rute tersimpan mandiri & tidak akan hilang saat berganti mode)
              </span>
            </div>
          </div>

          {/* Toggle Switcher */}
          <div className="flex items-center gap-1.5 bg-amber-100/90 p-1 rounded-xl border border-amber-300 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => switchZiarahMode('ngetan')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                ziarahMode === 'ngetan'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900'
              }`}
            >
              Mode Ziarah Ngetan
            </button>
            <button
              onClick={() => switchZiarahMode('ngulon')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                ziarahMode === 'ngulon'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900'
              }`}
            >
              Mode Ziarah Ngulon
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* MOBILE NAVIGATION BAR & TITIK TIGA (Menggantikan scroll geser yang sulit & tidak terlihat) */}
        <div className="lg:hidden bg-white rounded-xl border border-stone-200 p-3 shadow-xs mb-4 flex items-center justify-between gap-3 sticky top-16 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <ActiveIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Menu Aktif:
              </span>
              <span className="text-xs font-bold text-stone-900 truncate block">
                {currentMenuItem.label}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            title="Klik untuk membuka semua menu admin"
          >
            <MoreVertical className="w-4 h-4 text-emerald-950" />
            <span>Pilih Menu</span>
            <span className="bg-emerald-900 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
              17
            </span>
          </button>
        </div>

        {/* MODAL TITIK TIGA / PUSAT MENU NAVIGASI ADMIN KHUSUS MOBILE */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
              {/* Header Modal */}
              <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
                <div className="flex items-center gap-2">
                  <MoreVertical className="w-5 h-5 text-amber-300" />
                  <div>
                    <h3 className="font-bold text-sm text-white">Navigasi Menu Administrator</h3>
                    <p className="text-[10px] text-emerald-300">Pilih salah satu menu untuk dikelola</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body: Daftar Semua 17 Menu Dikelompokkan Rapi (Tanpa Geser) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {['Operasional & Jadwal', 'Master Makam & Ulama', 'Peserta & Panitia', 'Publikasi & Media', 'Sistem & Pengaturan'].map((catName) => {
                  const itemsInCat = menuItems.filter(
                    (m) =>
                      m.category === catName &&
                      (!m.roleRestricted || (m.roleRestricted === 'super_admin' && currentUser.role === 'super_admin'))
                  );

                  if (itemsInCat.length === 0) return null;

                  return (
                    <div key={catName} className="space-y-1.5">
                      <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider px-1">
                        {catName}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {itemsInCat.map((item) => {
                          const Icon = item.icon;
                          const isActive = adminActiveTab === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setAdminActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                isActive
                                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm font-bold'
                                  : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 border-stone-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
                                <span className="text-xs truncate">{item.label}</span>
                              </div>
                              {isActive && <Check className="w-4 h-4 text-amber-300 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Modal */}
              <div className="p-3 bg-stone-50 border-t border-stone-200 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-lg"
                >
                  Tutup Pilihan Menu
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Menu (Desktop Only - Dikelompokkan Rapi Berdasarkan Kategori) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-1">
            <div className="bg-white rounded-xl border border-stone-200 p-2.5 shadow-xs sticky top-20 space-y-3 max-h-[85vh] overflow-y-auto">
              {['Operasional & Jadwal', 'Master Makam & Ulama', 'Peserta & Panitia', 'Publikasi & Media', 'Sistem & Pengaturan'].map((catName) => {
                const itemsInCat = menuItems.filter(
                  (m) =>
                    m.category === catName &&
                    (!m.roleRestricted || (m.roleRestricted === 'super_admin' && currentUser.role === 'super_admin'))
                );

                if (itemsInCat.length === 0) return null;

                return (
                  <div key={catName} className="space-y-1">
                    <div className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider px-2 pt-1">
                      {catName}
                    </div>
                    {itemsInCat.map((item) => {
                      const Icon = item.icon;
                      const isActive = adminActiveTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setAdminActiveTab(item.id)}
                          className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg text-left transition-colors w-full cursor-pointer ${
                            isActive
                              ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                              : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Tab Content Canvas */}
          <main className="lg:col-span-4 min-w-0">
            {adminActiveTab === 'dashboard' && <AdminOverview setActiveTab={setAdminActiveTab} />}
            {adminActiveTab === 'agenda-berjalan' && <AdminAgendaBerjalanManager />}
            {adminActiveTab === 'agenda' && <AdminAgendaManager />}
            {adminActiveTab === 'rundown' && <AdminRundownManager />}
            {adminActiveTab === 'lokasi' && <AdminLokasiManager />}
            {adminActiveTab === 'tokoh' && <AdminTokohManager />}
            {adminActiveTab === 'doa' && <AdminDoaManager />}
            {adminActiveTab === 'bukusaku' && <AdminBukuSakuManager />}
            {adminActiveTab === 'berkas' && <AdminBerkasManager />}
            {adminActiveTab === 'peserta' && <AdminPesertaManager />}
            {adminActiveTab === 'panitia' && <AdminPanitiaManager />}
            {adminActiveTab === 'berita' && <AdminBeritaManager />}
            {adminActiveTab === 'infokilat' && <AdminInfoKilatManager />}
            {adminActiveTab === 'narasi' && <AdminNarasiManager />}
            {adminActiveTab === 'media' && <AdminMediaBrandManager />}
            {adminActiveTab === 'tema' && <AdminTemaManager />}
            {adminActiveTab === 'dokumentasi' && <AdminDokumentasiManager />}
            {adminActiveTab === 'pengguna' && <AdminPenggunaManager />}
            {adminActiveTab === 'pengaturan' && <AdminPengaturanManager />}
            {adminActiveTab === 'plugin' && <AdminPluginGuide />}
          </main>
        </div>
      </div>
    </div>
  );
};
