/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ShareModal } from './components/common/ShareModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LightboxModal } from './components/common/LightboxModal';
import { ToastContainer } from './components/common/ToastContainer';
import { NavigationModal } from './components/common/NavigationModal';

// Frontend Views
import { HomeView } from './components/frontend/HomeView';
import { ProfileKegiatanView } from './components/frontend/ProfileKegiatanView';
import { AgendaView } from './components/frontend/AgendaView';
import { AgendaDetailView } from './components/frontend/AgendaDetailView';
import { RundownView } from './components/frontend/RundownView';
import { LokasiView } from './components/frontend/LokasiView';
import { LokasiDetailView } from './components/frontend/LokasiDetailView';
import { TokohView } from './components/frontend/TokohView';
import { TokohDetailView } from './components/frontend/TokohDetailView';
import { BeritaView } from './components/frontend/BeritaView';
import { BeritaDetailView } from './components/frontend/BeritaDetailView';
import { InformasiPesertaView } from './components/frontend/InformasiPesertaView';
import { DokumentasiView } from './components/frontend/DokumentasiView';
import { DoaView } from './components/frontend/DoaView';
import { PanitiaView } from './components/frontend/PanitiaView';
import { BukuSakuModal } from './components/frontend/BukuSakuModal';
import { BottomNav } from './components/common/BottomNav';

// Admin Views
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView, siteSettings } = useApp();

  const fontBodyClass =
    siteSettings.themeFontBody === 'inter'
      ? 'font-body-inter'
      : siteSettings.themeFontBody === 'poppins'
      ? 'font-body-poppins'
      : siteSettings.themeFontBody === 'roboto'
      ? 'font-body-roboto'
      : 'font-body-jakarta';

  const bgTintClass =
    siteSettings.themeBgTint === 'ivory'
      ? 'bg-amber-50/40'
      : siteSettings.themeBgTint === 'white'
      ? 'bg-white'
      : 'bg-stone-50';

  const fontSizeClass =
    siteSettings.themeFontSize === 'large'
      ? 'text-[17px]'
      : siteSettings.themeFontSize === 'medium'
      ? 'text-[16px]'
      : '';

  // If in dedicated login or admin dashboard view
  if (currentView === 'login-admin') {
    return (
      <div className={`min-h-screen bg-stone-100/70 font-sans flex flex-col justify-between ${fontBodyClass}`}>
        <main className="flex-1">
          <AdminLogin />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  if (currentView === 'admin-dashboard') {
    return (
      <div className={`min-h-screen bg-stone-100/60 font-sans ${fontBodyClass}`}>
        <AdminDashboard />
        <ShareModal />
        <GlobalSearchModal />
        <LightboxModal />
        <ToastContainer />
      </div>
    );
  }

  // Frontend Views
  return (
    <div className={`min-h-screen ${bgTintClass} ${fontBodyClass} ${fontSizeClass} text-stone-900 font-sans flex flex-col selection:bg-emerald-800 selection:text-white w-full max-w-full overflow-x-hidden`}>
      <Header />

      <main className="flex-1 pb-20 md:pb-0 w-full max-w-full">
        {currentView === 'beranda' && <HomeView />}
        {currentView === 'profil-kegiatan' && <ProfileKegiatanView />}
        {currentView === 'agenda' && <AgendaView />}
        {currentView === 'agenda-detail' && <AgendaDetailView />}
        {currentView === 'rundown' && <RundownView />}
        {currentView === 'lokasi' && <LokasiView />}
        {currentView === 'lokasi-detail' && <LokasiDetailView />}
        {currentView === 'tokoh' && <TokohView />}
        {currentView === 'tokoh-detail' && <TokohDetailView />}
        {currentView === 'doa' && <DoaView />}
        {currentView === 'panitia' && <PanitiaView />}
        {currentView === 'berita' && <BeritaView />}
        {currentView === 'berita-detail' && <BeritaDetailView />}
        {currentView === 'informasi-peserta' && <InformasiPesertaView />}
        {currentView === 'dokumentasi' && <DokumentasiView />}
        {!['beranda', 'profil-kegiatan', 'agenda', 'agenda-detail', 'rundown', 'lokasi', 'lokasi-detail', 'tokoh', 'tokoh-detail', 'doa', 'panitia', 'berita', 'berita-detail', 'informasi-peserta', 'dokumentasi'].includes(currentView) && (
          <HomeView />
        )}
      </main>

      <Footer />

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <NavigationModal />
      <BukuSakuModal />
      <ShareModal />
      <GlobalSearchModal />
      <LightboxModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
