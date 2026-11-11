import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { initialSiteSettings } from '../../data/initialData';
import { ImageUploadField } from './ImageUploadField';
import {
  Paintbrush,
  Type,
  Layout,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Sliders,
  Globe,
  Compass,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Users,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface SectionItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

const ALL_HOME_SECTIONS: SectionItem[] = [
  { id: 'hero', name: 'Header Hero & Jam Real-Time', desc: 'Judul akbar, identitas instansi & jam digital WIB berdetak', icon: Clock },
  { id: 'livetracker', name: 'Agenda Berjalan (Live Tracker)', desc: 'Banner real-time posisi kegiatan & instruksi darurat panitia', icon: Compass },
  { id: 'infokilat', name: 'Pusat Navigasi & Info Kilat', desc: 'Kartu panjang pembuka pop-up navigasi & 4 kartu pintasan', icon: Layout },
  { id: 'countdown', name: 'Hitung Mundur Keberangkatan', desc: 'Panel countdown hari, jam, menit menuju pelaksanaan safar', icon: Calendar },
  { id: 'bukusaku', name: 'Banner Buku Saku Ziarah', desc: 'Akses cepat baca buku saku digital dan download file PDF', icon: BookOpen },
  { id: 'makam', name: 'Destinasi Makam Auliya', desc: 'Carousel kartu geser horizontal daftar maqbarah tujuan', icon: MapPin },
  { id: 'tokoh', name: 'Biografi Masyayikh & Tokoh', desc: 'Daftar riwayat ulama, muassis, dan sanad keilmuan', icon: Users },
  { id: 'doa', name: 'Tuntunan Doa & Tahlil Pilihan', desc: 'Bacaan tawassul, Yasin, tahlil lengkap, dan doa safar', icon: FileText },
  { id: 'berita', name: 'Artikel & Warta Berita Ziarah', desc: 'Grid berita, pengumuman resmi teknis dan arahan panitia', icon: MessageSquare },
];

export const AdminTemaManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast, isCloudConnected } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'kata' | 'posisi' | 'gambar' | 'link' | 'font' | 'warna'>('kata');

  // Form State initialized from siteSettings
  const [formData, setFormData] = useState({
    // 1. Tipografi & Font
    themeFontBody: siteSettings.themeFontBody || 'jakarta',
    themeFontHeading: siteSettings.themeFontHeading || 'cinzel',
    themeFontSize: siteSettings.themeFontSize || 'standard',

    // 2. Skema Warna & Nuansa Visual
    themeColorScheme: siteSettings.themeColorScheme || 'emerald',
    themeAccentColor: siteSettings.themeAccentColor || 'amber',
    themeBgTint: siteSettings.themeBgTint || 'stone',
    themeCardRadius: siteSettings.themeCardRadius || 'rounded-2xl',
    themeShowPattern: siteSettings.themeShowPattern !== false,

    // 3. Tata Letak Posisi Urutan Beranda
    sectionOrderHome: siteSettings.sectionOrderHome || [
      'hero',
      'livetracker',
      'infokilat',
      'countdown',
      'bukusaku',
      'makam',
      'tokoh',
      'doa',
      'berita',
    ],
    sectionVisibilityHome: siteSettings.sectionVisibilityHome || {
      hero: true,
      livetracker: true,
      infokilat: true,
      countdown: true,
      bukusaku: true,
      makam: true,
      tokoh: true,
      doa: true,
      berita: true,
    },

    // 4. Gambar & Brand
    logoUrl: siteSettings.logoUrl || '',
    heroImageUrl: siteSettings.heroImageUrl || '/src/assets/images/hero_ziarah_annawawi_1794285626739.jpg',

    // 5. Semua Tautan / Link
    linkPesantrenWeb: siteSettings.linkPesantrenWeb || 'https://annawawi-berjan.id',
    linkMapsLocation: siteSettings.linkMapsLocation || 'https://maps.google.com/?q=Pondok+Pesantren+An-Nawawi+Berjan+Purworejo',
    linkYoutube: siteSettings.linkYoutube || 'https://youtube.com/@annawawiberjan',
    linkInstagram: siteSettings.linkInstagram || 'https://instagram.com/annawawi_berjan',
    linkFacebook: siteSettings.linkFacebook || 'https://facebook.com/annawawiberjan',
    linkTikTok: siteSettings.linkTikTok || 'https://tiktok.com/@annawawi_berjan',
    linkBukuSakuPdf: siteSettings.linkBukuSakuPdf || siteSettings.pocketBookUrl || '#',
    linkEmergencyCall: siteSettings.linkEmergencyCall || siteSettings.contactWhatsApp || '+6281234567890',
    contactWhatsApp: siteSettings.contactWhatsApp || '+6281234567890',
    contactEmail: siteSettings.contactEmail || 'panitiaziarah2026@annawawi-berjan.id',
    hotline: siteSettings.hotline || '+6281234567890',

    // 6. Kustomisasi Semua Kata-Kata & Judul Tampilan
    siteTitle: siteSettings.siteTitle || 'Ziarah An-Nawawi 2026',
    tagline: siteSettings.tagline || "Ziarah Makam Auliya', Ulama', dan Pejuang",
    organizer: siteSettings.organizer || 'Pondok Pesantren An-Nawawi Berjan Purworejo',
    heroHeadline: siteSettings.heroHeadline || 'Meneladani Jejak Perjuangan Para Kekasih Allah',
    heroSubheadline: siteSettings.heroSubheadline || "Sistem Informasi & Panduan Perjalanan Ziarah Makam Auliya', Ulama', dan Pejuang Pondok Pesantren An-Nawawi Berjan Purworejo Tahun 2026 M. / 1448 H.",
    uiHeaderBadgeText: siteSettings.uiHeaderBadgeText || 'RESMI TAHUN 2026 M. / 1448 H.',
    uiBtnNavigasiText: siteSettings.uiBtnNavigasiText || 'Buka Pusat Navigasi & Direktori Lengkap',
    uiBtnBukuSakuText: siteSettings.uiBtnBukuSakuText || 'Preview / Baca Buku Saku Digital',
    uiBtnJadwalText: siteSettings.uiBtnJadwalText || 'Buka Jadwal & Rundown Lengkap',
    uiHomeCountdownTitle: siteSettings.uiHomeCountdownTitle || 'Hitung Mundur Keberangkatan Akbar Safar Ziarah',
    uiHomeCountdownSubtitle: siteSettings.uiHomeCountdownSubtitle || "Menuju safar akbar maqbarah auliya' shalihin PP. An-Nawawi Berjan Purworejo",
    uiHomeLiveTrackerTitle: siteSettings.uiHomeLiveTrackerTitle || 'Agenda Sedang Berlangsung Saat Ini (Posisi Real-Time)',
    uiHomeMakamTitle: siteSettings.uiHomeMakamTitle || 'Lokasi Makam yang Diziarahi',
    uiHomeMakamSubtitle: siteSettings.uiHomeMakamSubtitle || "Maqbarah para auliya', penyebar syiar Islam nusantara dan perintis pesantren",
    uiHomeTokohTitle: siteSettings.uiHomeTokohTitle || "Biografi Auliya' & Masyayikh",
    uiHomeTokohSubtitle: siteSettings.uiHomeTokohSubtitle || 'Teladan keilmuan, kezuhudan, tarekat, dan perjuangan dakwah',
    uiHomeDoaTitle: siteSettings.uiHomeDoaTitle || 'Tuntunan Aurad, Yasin & Tahlil',
    uiHomeDoaSubtitle: siteSettings.uiHomeDoaSubtitle || "Kompilasi bacaan doa ziarah makam auliya' sesuai tuntunan para guru",
    uiHomeBeritaTitle: siteSettings.uiHomeBeritaTitle || 'Artikel & Warta Pilihan Ziarah',
    uiHomeBeritaSubtitle: siteSettings.uiHomeBeritaSubtitle || 'Informasi resmi, maklumat panitia, dan kabar seputar pelaksanaan safar',
    pocketBookTitle: siteSettings.pocketBookTitle || 'Buku Saku Panduan & Tuntunan Ziarah An-Nawawi 2026 (Edisi Lux)',
    uiHomeBukuSakuSubtitle: siteSettings.uiHomeBukuSakuSubtitle || 'Dilengkapi adab ziarah kubur, fadlilah, manaqib ulama, dan doa safar kendaraan',
    footerNarration: siteSettings.footerNarration || "Sistem Informasi & Panduan Digital Resmi Ziarah Makam Auliya', Ulama', dan Pejuang. Dikelola oleh Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo.",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Section Reorder Handlers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...formData.sectionOrderHome];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setFormData((prev) => ({
      ...prev,
      sectionOrderHome: newOrder,
    }));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sectionVisibilityHome: {
        ...prev.sectionVisibilityHome,
        [sectionId]: !(prev.sectionVisibilityHome[sectionId] !== false),
      },
    }));
  };

  // Save changes to Firebase Firestore (Realtime Push)
  const handleSaveTheme = () => {
    setIsSaving(true);
    try {
      updateSiteSettings(formData);
      showToast('Pengaturan tema & tampilan berhasil disimpan! Otomatis tersinkron ke semua perangkat jamaah.', 'success');
    } catch {
      showToast('Terjadi kesalahan saat menyimpan tema.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh tema dan narasi tampilan ke pengaturan default bawaan?')) {
      const resetValues = {
        themeFontBody: initialSiteSettings.themeFontBody || 'jakarta',
        themeFontHeading: initialSiteSettings.themeFontHeading || 'cinzel',
        themeFontSize: initialSiteSettings.themeFontSize || 'standard',
        themeColorScheme: initialSiteSettings.themeColorScheme || 'emerald',
        themeAccentColor: initialSiteSettings.themeAccentColor || 'amber',
        themeBgTint: initialSiteSettings.themeBgTint || 'stone',
        themeCardRadius: initialSiteSettings.themeCardRadius || 'rounded-2xl',
        themeShowPattern: true,
        sectionOrderHome: initialSiteSettings.sectionOrderHome || [
          'hero',
          'livetracker',
          'infokilat',
          'countdown',
          'bukusaku',
          'makam',
          'tokoh',
          'doa',
          'berita',
        ],
        sectionVisibilityHome: initialSiteSettings.sectionVisibilityHome || {
          hero: true,
          livetracker: true,
          infokilat: true,
          countdown: true,
          bukusaku: true,
          makam: true,
          tokoh: true,
          doa: true,
          berita: true,
        },
        linkPesantrenWeb: initialSiteSettings.linkPesantrenWeb || '',
        linkMapsLocation: initialSiteSettings.linkMapsLocation || '',
        linkYoutube: initialSiteSettings.linkYoutube || '',
        linkInstagram: initialSiteSettings.linkInstagram || '',
        linkFacebook: initialSiteSettings.linkFacebook || '',
        linkTikTok: initialSiteSettings.linkTikTok || '',
        uiHeaderBadgeText: initialSiteSettings.uiHeaderBadgeText || 'RESMI TAHUN 2026 M. / 1448 H.',
        uiBtnNavigasiText: initialSiteSettings.uiBtnNavigasiText || 'Buka Pusat Navigasi & Direktori Lengkap',
        uiBtnBukuSakuText: initialSiteSettings.uiBtnBukuSakuText || 'Preview / Baca Buku Saku Digital',
        uiBtnJadwalText: initialSiteSettings.uiBtnJadwalText || 'Buka Jadwal & Rundown Lengkap',
        uiHomeCountdownTitle: initialSiteSettings.uiHomeCountdownTitle || 'Hitung Mundur Keberangkatan Akbar Safar Ziarah',
        uiHomeCountdownSubtitle: initialSiteSettings.uiHomeCountdownSubtitle || '',
        uiHomeLiveTrackerTitle: initialSiteSettings.uiHomeLiveTrackerTitle || 'Agenda Sedang Berlangsung Saat Ini (Posisi Real-Time)',
        uiHomeMakamTitle: initialSiteSettings.uiHomeMakamTitle || 'Lokasi Makam yang Diziarahi',
        uiHomeMakamSubtitle: initialSiteSettings.uiHomeMakamSubtitle || '',
        uiHomeTokohTitle: initialSiteSettings.uiHomeTokohTitle || "Biografi Auliya' & Masyayikh",
        uiHomeTokohSubtitle: initialSiteSettings.uiHomeTokohSubtitle || '',
        uiHomeDoaTitle: initialSiteSettings.uiHomeDoaTitle || 'Tuntunan Aurad, Yasin & Tahlil',
        uiHomeDoaSubtitle: initialSiteSettings.uiHomeDoaSubtitle || '',
        uiHomeBeritaTitle: initialSiteSettings.uiHomeBeritaTitle || 'Artikel & Warta Pilihan Ziarah',
        uiHomeBeritaSubtitle: initialSiteSettings.uiHomeBeritaSubtitle || '',
        uiHomeBukuSakuTitle: initialSiteSettings.uiHomeBukuSakuTitle || 'Buku Saku Panduan & Tuntunan Ziarah',
        uiHomeBukuSakuSubtitle: initialSiteSettings.uiHomeBukuSakuSubtitle || '',
      };

      setFormData((prev) => ({ ...prev, ...resetValues }));
      updateSiteSettings(resetValues);
      showToast('Tema berhasil dikembalikan ke default bawaan sistem.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Paintbrush className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>Pengaturan Tema & Kustomisasi Tampilan</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Sesuaikan (Live Customizer)
                </span>
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Kustomisasi semua kata-kata, tata letak posisi, gambar & logo, tautan/link, tipografi & font, serta warna. Otomatis tersinkron ke semua perangkat secara real-time via Cloud Firestore.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors cursor-pointer"
            title="Kembalikan semua nilai ke default"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <button
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Tema & Sinkronkan'}</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Status Badge */}
      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${isCloudConnected ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
          <span>
            <strong>Cloud Sync Real-Time:</strong> {isCloudConnected ? 'Terhubung ke Google Firebase Firestore. Setiap perubahan yang disimpan langsung tayang di gawai jamaah dalam hitungan detik.' : 'Mode Lokal (Siap disambungkan ke Cloud saat online).'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-stone-500 hidden md:inline">
          Koleksi: settings/global
        </span>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex overflow-x-auto gap-2 border-b border-stone-200 pb-2 scrollbar-none no-scrollbar">
        {[
          { id: 'kata', label: '1. Kata-Kata & Teks', icon: Type, desc: 'Semua teks, judul & tombol' },
          { id: 'posisi', label: '2. Posisi & Urutan Bagian', icon: Layout, desc: 'Tata letak beranda & visibilitas' },
          { id: 'gambar', label: '3. Gambar & Brand', icon: ImageIcon, desc: 'Logo, hero banner & media' },
          { id: 'link', label: '4. Tautan & Link', icon: LinkIcon, desc: 'WhatsApp, Maps, IG & YouTube' },
          { id: 'font', label: '5. Tipografi & Font', icon: Sliders, desc: 'Pilihan font judul & isi' },
          { id: 'warna', label: '6. Warna & Nuansa Visual', icon: Paintbrush, desc: 'Skema warna & kartu' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: SEMUA KATA-KATA & TEKS TAMPILAN               */}
      {/* ======================================================== */}
      {activeSubTab === 'kata' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-800" />
              <span>Kustomisasi Semua Kata-Kata & Judul Tampilan Frontend</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Ubah judul utama website, slogan, headline hero, nama seksi tampilan, dan teks tombol aksi. Perubahan ini akan segera memperbarui tampilan seluruh perangkat pengunjung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Identitas Pokok */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-800">
                Nama / Judul Utama Website (Site Title)
              </label>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Contoh: Ziarah An-Nawawi 2026"
              />
              <span className="text-[11px] text-stone-400">Tampil di bilah navigasi atas, footer, dan tab browser.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Slogan / Tagline Kegiatan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Contoh: Ziarah Makam Auliya', Ulama', dan Pejuang"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Nama Penyelenggara / Instansi Pesantren
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Contoh: Pondok Pesantren An-Nawawi Berjan Purworejo"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Teks Badge Header Atas
              </label>
              <input
                type="text"
                value={formData.uiHeaderBadgeText}
                onChange={(e) => setFormData({ ...formData, uiHeaderBadgeText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Contoh: RESMI TAHUN 2026 M. / 1448 H."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Teks Tombol Pop-up Navigasi (Kartu Panjang)
              </label>
              <input
                type="text"
                value={formData.uiBtnNavigasiText}
                onChange={(e) => setFormData({ ...formData, uiBtnNavigasiText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Contoh: Buka Pusat Navigasi & Direktori Lengkap"
              />
            </div>

            {/* Headline Hero Section */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-800">
                Headline Hero Beranda (Kalimat Utama Pembuka)
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Contoh: Meneladani Jejak Perjuangan Para Kekasih Allah"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-800">
                Sub-Headline Hero Beranda (Deskripsi Singkat Safar)
              </label>
              <textarea
                rows={2}
                value={formData.heroSubheadline}
                onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Deskripsi singkat kegiatan safar di bawah judul hero..."
              />
            </div>

            {/* Judul Seksi-Seksi Beranda */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Seksi Hitung Mundur (Countdown)
              </label>
              <input
                type="text"
                value={formData.uiHomeCountdownTitle}
                onChange={(e) => setFormData({ ...formData, uiHomeCountdownTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Subjudul Seksi Hitung Mundur
              </label>
              <input
                type="text"
                value={formData.uiHomeCountdownSubtitle}
                onChange={(e) => setFormData({ ...formData, uiHomeCountdownSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Banner Live Tracker Kegiatan
              </label>
              <input
                type="text"
                value={formData.uiHomeLiveTrackerTitle}
                onChange={(e) => setFormData({ ...formData, uiHomeLiveTrackerTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Teks Tombol Buka Rundown / Jadwal
              </label>
              <input
                type="text"
                value={formData.uiBtnJadwalText}
                onChange={(e) => setFormData({ ...formData, uiBtnJadwalText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Seksi Makam Auliya'
              </label>
              <input
                type="text"
                value={formData.uiHomeMakamTitle}
                onChange={(e) => setFormData({ ...formData, uiHomeMakamTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Subjudul Seksi Makam Auliya'
              </label>
              <input
                type="text"
                value={formData.uiHomeMakamSubtitle}
                onChange={(e) => setFormData({ ...formData, uiHomeMakamSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Seksi Tokoh & Masyayikh
              </label>
              <input
                type="text"
                value={formData.uiHomeTokohTitle}
                onChange={(e) => setFormData({ ...formData, uiHomeTokohTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Subjudul Seksi Tokoh
              </label>
              <input
                type="text"
                value={formData.uiHomeTokohSubtitle}
                onChange={(e) => setFormData({ ...formData, uiHomeTokohSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Seksi Doa & Tahlil
              </label>
              <input
                type="text"
                value={formData.uiHomeDoaTitle}
                onChange={(e) => setFormData({ ...formData, uiHomeDoaTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Seksi Artikel & Warta Berita
              </label>
              <input
                type="text"
                value={formData.uiHomeBeritaTitle}
                onChange={(e) => setFormData({ ...formData, uiHomeBeritaTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Judul Buku Saku Digital
              </label>
              <input
                type="text"
                value={formData.pocketBookTitle}
                onChange={(e) => setFormData({ ...formData, pocketBookTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Teks Tombol Buku Saku
              </label>
              <input
                type="text"
                value={formData.uiBtnBukuSakuText}
                onChange={(e) => setFormData({ ...formData, uiBtnBukuSakuText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: POSISI & URUTAN BAGIAN BERANDA                */}
      {/* ======================================================== */}
      {activeSubTab === 'posisi' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Layout className="w-5 h-5 text-emerald-800" />
              <span>Tata Letak, Urutan Posisi & Visibilitas Bagian Beranda</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Geser urutan posisi bagian ke atas atau ke bawah sesuai alur yang Anda inginkan. Anda juga dapat menyembunyikan atau menampilkan bagian tertentu dengan sakelar visibilitas.
            </p>
          </div>

          <div className="space-y-2.5">
            {formData.sectionOrderHome.map((sectionId, index) => {
              const meta = ALL_HOME_SECTIONS.find((s) => s.id === sectionId) || {
                id: sectionId,
                name: sectionId.toUpperCase(),
                desc: 'Bagian beranda kustom',
                icon: Layout,
              };
              const Icon = meta.icon;
              const isVisible = formData.sectionVisibilityHome[sectionId] !== false;

              return (
                <div
                  key={sectionId}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isVisible
                      ? 'bg-stone-50/70 border-stone-200 text-stone-900'
                      : 'bg-stone-100/50 border-stone-200 text-stone-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="p-2 rounded-lg bg-white border border-stone-200 text-emerald-800 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {meta.name}
                        </h4>
                        {!isVisible && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                            Disembunyikan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate hidden sm:block">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Move Up */}
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Naikkan posisi ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-stone-700" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === formData.sectionOrderHome.length - 1}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Turunkan posisi ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-stone-700" />
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => toggleSectionVisibility(sectionId)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isVisible
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-stone-300 bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                      title={isVisible ? 'Sembunyikan bagian ini dari pengunjung' : 'Tampilkan bagian ini'}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Tips Posisi:</strong> Urutan di atas menentukan bagaimana seluruh blok konten beranda tersusun dari paling atas hingga ke bawah. Setelah menekan tombol <em>Simpan Tema & Sinkronkan</em>, seluruh browser pengunjung langsung menyusun ulang tampilannya secara otomatis tanpa reload!
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: GAMBAR & BRAND TAMPILAN                       */}
      {/* ======================================================== */}
      {activeSubTab === 'gambar' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-800" />
              <span>Gambar, Logo Resmi & Banner Tampilan</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Ganti logo pesantren/kegiatan, gambar latar belakang hero header, dan thumbnail media yang tampil di seluruh portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Pesantren */}
            <div className="space-y-3">
              <ImageUploadField
                label="Logo Resmi Instansi / Pesantren"
                value={formData.logoUrl}
                onChange={(val) => setFormData({ ...formData, logoUrl: val })}
                description="Disarankan Persegi 1:1 (PNG transparan atau JPEG)"
                aspectRatioClass="aspect-square"
                presets={[
                  { label: 'Logo Resmi', url: '/public/assets/aistudio/image_4fdad8d4.png' },
                ]}
              />
              <span className="text-[11px] text-stone-500 block">
                Logo ini akan muncul di pojok kiri atas bilah navigasi header, footer, dan dokumen panduan resmi.
              </span>
            </div>

            {/* Hero Image */}
            <div className="space-y-3">
              <ImageUploadField
                label="Gambar Hero Banner Utama"
                value={formData.heroImageUrl}
                onChange={(val) => setFormData({ ...formData, heroImageUrl: val })}
                description="Disarankan Rasio Lebar 16:9 / Landscape HD"
                aspectRatioClass="aspect-16/9"
                presets={[
                  { label: 'Hero Ziarah', url: '/src/assets/images/hero_ziarah_annawawi_1794285626739.jpg' },
                  { label: 'Makam Kudus', url: '/src/assets/images/makam_wali_kudus_1794285626298.jpg' },
                  { label: 'Gerbang Berjan', url: '/src/assets/images/pesantren_berjan_gate_1794285627951.jpg' },
                  { label: 'Doa Ulama', url: '/src/assets/images/ulama_ziarah_doa_1794285627516.jpg' },
                ]}
              />
              <span className="text-[11px] text-stone-500 block">
                Latar belakang visual megah di bagian atas website beranda dan kartu share OpenGraph media sosial.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: SEMUA TAUTAN / LINK EKSTERNAL & INTERNAL      */}
      {/* ======================================================== */}
      {activeSubTab === 'link' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-emerald-800" />
              <span>Semua Tautan, Link Eksternal, Kontak & Berkas</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Atur seluruh link resmi yang terhubung dengan tombol-tombol di situs: WhatsApp Panitia, Google Maps, Media Sosial Pesantren, dan Unduhan PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>Website Resmi Pondok Pesantren</span>
              </label>
              <input
                type="url"
                value={formData.linkPesantrenWeb}
                onChange={(e) => setFormData({ ...formData, linkPesantrenWeb: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="https://annawawi-berjan.id"
              />
              <span className="text-[11px] text-stone-400">Tautan portal resmi pesantren di footer dan menu profil.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Link Google Maps Titik Kumpul / Pesantren</span>
              </label>
              <input
                type="url"
                value={formData.linkMapsLocation}
                onChange={(e) => setFormData({ ...formData, linkMapsLocation: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="https://maps.google.com/..."
              />
              <span className="text-[11px] text-stone-400">Tautan navigasi GPS langsung menuju titik kumpul Berjan.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nomor WhatsApp Resmi Panitia</span>
              </label>
              <input
                type="text"
                value={formData.contactWhatsApp}
                onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value, linkEmergencyCall: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="+6281234567890"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Hotline / Nomor Darurat Jamaah</span>
              </label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="+6281234567890"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                <span>Kanal YouTube Resmi (Live Streaming)</span>
              </label>
              <input
                type="url"
                value={formData.linkYoutube}
                onChange={(e) => setFormData({ ...formData, linkYoutube: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="https://youtube.com/@annawawiberjan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
                <span>Akun Instagram Resmi Pesantren / Ziarah</span>
              </label>
              <input
                type="url"
                value={formData.linkInstagram}
                onChange={(e) => setFormData({ ...formData, linkInstagram: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="https://instagram.com/annawawi_berjan"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-800" />
                <span>Link Download Berkas PDF Buku Saku Langsung</span>
              </label>
              <input
                type="text"
                value={formData.linkBukuSakuPdf}
                onChange={(e) => setFormData({ ...formData, linkBukuSakuPdf: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-emerald-800 bg-white"
                placeholder="Link file PDF di Google Drive atau server pesantren (isi '#' untuk membuka dialog cetak)"
              />
              <span className="text-[11px] text-stone-400">Jika diisi URL langsung (misal link Google Drive/Cloud Storage), tombol unduh di beranda langsung mengunduh file tersebut.</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 5: TIPOGRAFI & FONT                              */}
      {/* ======================================================== */}
      {activeSubTab === 'font' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-800" />
              <span>Tipografi, Pilihan Font & Skala Ukuran Teks</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Pilih perpaduan font judul dan font isi yang memberikan kenyamanan membaca maksimal bagi seluruh santri, jamaah sepuh, dan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pilihan Font Judul / Heading */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 block">
                Font Judul Besar & Heading
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'cinzel', name: 'Cinzel Serif Megah', desc: 'Serif berwibawa, klasik, ornamen kerajaan & pesantren', fontClass: 'font-heading-cinzel' },
                  { id: 'amiri', name: 'Amiri Kaligrafi Arabesque', desc: 'Nuansa Arab klasik yang anggun dan sarat makna ziarah', fontClass: 'font-heading-amiri' },
                  { id: 'sans', name: 'Plus Jakarta Sans Modern', desc: 'Modern, geometris, tegas, dan mudah dibaca cepat', fontClass: 'font-heading-sans' },
                  { id: 'serif', name: 'Merriweather Klasik', desc: 'Huruf berkait ramah, hangat, dan sastrawi', fontClass: 'font-heading-serif' },
                ].map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setFormData({ ...formData, themeFontHeading: f.id as typeof formData.themeFontHeading })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.themeFontHeading === f.id
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className={`text-sm font-bold text-stone-900 ${f.fontClass}`}>
                        {f.name}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{f.desc}</div>
                    </div>
                    {formData.themeFontHeading === f.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pilihan Font Isi / Body */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 block">
                Font Isi / Teks Bacaan (Body Text)
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'jakarta', name: 'Plus Jakarta Sans (Standar)', desc: 'Sangat bersih, geometris, dan nyaman di ponsel', fontClass: 'font-body-jakarta' },
                  { id: 'inter', name: 'Inter UI Pro', desc: 'Struktur huruf teratur presisi untuk teks panduan panjang', fontClass: 'font-body-inter' },
                  { id: 'poppins', name: 'Poppins Ramah', desc: 'Bentuk membulat modern yang bersahabat dan santai', fontClass: 'font-body-poppins' },
                  { id: 'roboto', name: 'Roboto Universal', desc: 'Standar netral cepat responsif di segala layar', fontClass: 'font-body-roboto' },
                ].map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setFormData({ ...formData, themeFontBody: f.id as typeof formData.themeFontBody })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.themeFontBody === f.id
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className={`text-sm font-bold text-stone-900 ${f.fontClass}`}>
                        {f.name}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{f.desc}</div>
                    </div>
                    {formData.themeFontBody === f.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skala Ukuran Teks */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-bold text-stone-800 block">
                Skala Ukuran Teks (Membantu Kenyamanan Jamaah)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', title: 'Ukuran Standar', desc: 'Ukuran default bawaan sistem (100%)' },
                  { id: 'medium', title: 'Ukuran Sedang (+5%)', desc: 'Lebih besar sedikit, sangat nyaman di gawai genggam' },
                  { id: 'large', title: 'Nyaman Besar (+10%)', desc: 'Rekomendasi untuk jamaah sepuh agar mudah terbaca' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setFormData({ ...formData, themeFontSize: s.id as typeof formData.themeFontSize })}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      formData.themeFontSize === s.id
                        ? 'border-emerald-700 bg-emerald-50/80 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">{s.title}</span>
                      {formData.themeFontSize === s.id && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 6: WARNA & GAYA VISUAL                           */}
      {/* ======================================================== */}
      {activeSubTab === 'warna' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-emerald-800" />
              <span>Skema Warna Utama, Aksen & Nuansa Visual</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Pilih palet warna nuansa islami, warna aksen sorotan tombol, dan kelengkungan sudut kartu tampilan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skema Warna Utama */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 block">
                Skema Warna Primer (Tema Identitas)
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'emerald', name: 'Zamrud Madinah (Emerald & Gold)', color: 'bg-emerald-900', border: 'border-amber-400', desc: 'Nuansa hijau kubah Nabawi & emas khidmat (Default)' },
                  { id: 'teal', name: 'Teal Samudera (Teal & Amber)', color: 'bg-teal-900', border: 'border-amber-300', desc: 'Nuansa hijau toska laut dalam dengan sorotan amber terang' },
                  { id: 'gold', name: 'Royal Khidmah (Cokelat Emas Aristokrat)', color: 'bg-stone-900', border: 'border-amber-500', desc: 'Nuansa wibawa pesona pesantren salaf nan mewah' },
                  { id: 'navy', name: 'Sapphire Night (Navy & Gold)', color: 'bg-slate-900', border: 'border-yellow-400', desc: 'Biru tua megah bak langit safar malam bertabur bintang' },
                  { id: 'forest', name: 'Hutan Pinus Abadi (Deep Forest)', color: 'bg-green-950', border: 'border-emerald-400', desc: 'Hijau alam asri, damai dan menyejukkan hati' },
                ].map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setFormData({ ...formData, themeColorScheme: c.id as typeof formData.themeColorScheme })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.themeColorScheme === c.id
                        ? 'border-emerald-700 bg-emerald-50/80 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg ${c.color} border-2 ${c.border} shadow-2xs shrink-0`} />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-stone-900">{c.name}</div>
                        <div className="text-[11px] text-stone-500">{c.desc}</div>
                      </div>
                    </div>
                    {formData.themeColorScheme === c.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Warna Aksen & Nuansa Background */}
            <div className="space-y-5">
              {/* Nuansa Background */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  Nuansa Warna Latar Belakang (Page Background Tint)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'stone', name: 'Stone Warm', desc: 'Abu hangat ziarah' },
                    { id: 'ivory', name: 'Ivory Krem', desc: 'Gading klasik' },
                    { id: 'white', name: 'Putih Bersih', desc: 'Modern netral' },
                  ].map((bg) => (
                    <div
                      key={bg.id}
                      onClick={() => setFormData({ ...formData, themeBgTint: bg.id as typeof formData.themeBgTint })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.themeBgTint === bg.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{bg.name}</div>
                      <div className="text-[10px] text-stone-500">{bg.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kelengkungan Sudut Kartu (Radius) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  Kelengkungan Sudut Kartu (Corner Radius)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rounded-xl', name: 'Modern (12px)', classPreview: 'rounded-xl' },
                    { id: 'rounded-2xl', name: 'Lembut (16px - Default)', classPreview: 'rounded-2xl' },
                    { id: 'rounded-3xl', name: 'Elegan Bulat (24px)', classPreview: 'rounded-3xl' },
                    { id: 'rounded-lg', name: 'Tegas Klasik (8px)', classPreview: 'rounded-lg' },
                  ].map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setFormData({ ...formData, themeCardRadius: r.id as typeof formData.themeCardRadius })}
                      className={`p-2.5 border transition-all cursor-pointer flex items-center justify-between ${r.classPreview} ${
                        formData.themeCardRadius === r.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-xs">{r.name}</span>
                      {formData.themeCardRadius === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggle Ornamen Islami */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">
                    Ornamen Islami Halus di Latar Belakang
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Motif ornamen geometris syar'i subtle di banner hero dan bagian penting
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.themeShowPattern}
                  onChange={(e) => setFormData({ ...formData, themeShowPattern: e.target.checked })}
                  className="w-4 h-4 accent-emerald-800 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE LIVE PREVIEW BOX                             */}
      {/* ======================================================== */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-stone-800 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
              Live Preview Komponen Berdasarkan Pilihan Tema Saat Ini
            </span>
          </div>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Pratinjau langsung sebelum disimpan ke cloud
          </span>
        </div>

        {/* Mini Simulated Header & Hero Banner */}
        <div className={`p-4 sm:p-6 rounded-xl border border-emerald-700/60 text-white ${
          formData.themeColorScheme === 'teal'
            ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950'
            : formData.themeColorScheme === 'gold'
            ? 'bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950'
            : formData.themeColorScheme === 'navy'
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950'
            : formData.themeColorScheme === 'forest'
            ? 'bg-gradient-to-r from-green-950 via-green-900 to-green-950'
            : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950'
        } ${formData.themeCardRadius}`}>
          <div className="flex items-center justify-between text-xs text-amber-300 border-b border-white/10 pb-2 mb-3">
            <span className="font-bold">{formData.organizer}</span>
            <span className="px-2 py-0.5 rounded bg-amber-400 text-emerald-950 font-bold text-[10px]">
              {formData.uiHeaderBadgeText}
            </span>
          </div>

          <h3 className={`text-lg sm:text-2xl font-bold text-white ${
            formData.themeFontHeading === 'amiri'
              ? 'font-heading-amiri'
              : formData.themeFontHeading === 'sans'
              ? 'font-heading-sans'
              : formData.themeFontHeading === 'serif'
              ? 'font-heading-serif'
              : 'font-heading-cinzel'
          }`}>
            {formData.siteTitle}
          </h3>

          <p className={`text-xs text-stone-300 mt-1 line-clamp-2 ${
            formData.themeFontBody === 'inter'
              ? 'font-body-inter'
              : formData.themeFontBody === 'poppins'
              ? 'font-body-poppins'
              : formData.themeFontBody === 'roboto'
              ? 'font-body-roboto'
              : 'font-body-jakarta'
          }`}>
            {formData.heroHeadline} — {formData.heroSubheadline}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <button className="px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 text-xs font-bold shadow-xs">
              {formData.uiBtnNavigasiText}
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-800/80 border border-emerald-600 text-white text-xs font-medium">
              {formData.uiBtnBukuSakuText}
            </button>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-stone-400">
            Pastikan klik tombol simpan untuk menerbitkan pengaturan tema ke seluruh perangkat jamaah.
          </div>
          <button
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Tema & Sinkronkan ke Semua Perangkat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
