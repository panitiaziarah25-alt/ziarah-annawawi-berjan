import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Shield, ArrowUp, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, navigateTo, ziarahMode } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const modeLabel = ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur & Madura)' : 'Ziarah Ngulon (Jawa Barat & Banten)';

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-20 no-print w-full max-w-full overflow-x-hidden">
      {/* Decorative Golden Islamic Pattern Bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo An-Nawawi"
                  className="w-10 h-10 object-contain rounded-lg border border-emerald-700 bg-white p-0.5 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-serif-islamic font-bold text-lg border border-emerald-700 shrink-0">
                  AN
                </div>
              )}
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {siteSettings.siteTitle}
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  {siteSettings.yearMasehi} / {siteSettings.yearHijriah}
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              {siteSettings.footerNarration ||
                "Pusat sistem informasi perjalanan ziarah makam para kekasih Allah, ulama pejuang, dan masyayikh nusantara Pondok Pesantren An-Nawawi Berjan Purworejo."}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/80 border border-emerald-700 rounded-lg text-xs text-amber-300 font-medium">
              <Compass className="w-3.5 h-3.5" />
              <span>Rute Aktif: {modeLabel}</span>
            </div>
          </div>

          {/* Column 2: Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <button
                  onClick={() => navigateTo('beranda')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('profil-kegiatan')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Profil & Latar Belakang
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('agenda')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Agenda Perjalanan
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('rundown')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Rundown Waktu & Tabel
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('doa')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Doa, Yasin & Tahlil Ziarah
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('informasi-peserta')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Panduan Peserta, Berkas & Panitia
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Destinasi Makam & Tokoh */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Makam & Profil Tokoh
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <button
                  onClick={() => navigateTo('lokasi')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Maqbarah Masyayikh Berjan
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('lokasi')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Daftar Seluruh Lokasi Makam
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('tokoh')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Direktori Profil Tokoh Auliya'
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('berita')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Warta & Pengumuman Ziarah
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('dokumentasi')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Galeri Foto & Dokumentasi
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Sekretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Sekretariat Panitia
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteSettings.headquarters}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`https://wa.me/${siteSettings.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300"
                >
                  WhatsApp: {siteSettings.contactWhatsApp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </div>
              {siteSettings.linkPesantrenWeb && (
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={siteSettings.linkPesantrenWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-emerald-900/90 text-amber-300 hover:text-white border border-emerald-700 text-[11px] font-medium"
                  >
                    Website Pesantren ↗
                  </a>
                  {siteSettings.linkMapsLocation && (
                    <a
                      href={siteSettings.linkMapsLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-emerald-900/90 text-emerald-200 hover:text-white border border-emerald-700 text-[11px] font-medium"
                    >
                      Peta Maps ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>
            © 2026 {siteSettings.organizer}. Seluruh hak cipta dilindungi undang-undang.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('login-admin')}
              className="flex items-center gap-1.5 text-emerald-300 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Login Administrator</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Kembali ke Atas</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
