export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface MakamLokasi {
  id: string;
  name: string;
  slug: string;
  image: string;
  gallery: string[];
  address: string;
  regency: string; // Kabupaten
  district: string; // Kecamatan
  description: string;
  history: string;
  figureIds: string[]; // Linked Tokoh IDs
  estimatedDuration: string; // e.g. "90 Menit"
  technicalNotes: string;
  facilities: string[];
  mapsQuery: string;
  lat?: number;
  lng?: number;
  status: 'published' | 'draft';
}

export interface Tokoh {
  id: string;
  name: string;
  titleOrHonorific: string; // Gelar / Sebutan misal "Wali Songo", "Ulama Pendiri Berjan"
  slug: string;
  photo: string;
  birthYear?: string;
  deathYear?: string;
  biography: string;
  genealogy: string; // Silsilah keluarga
  education: string; // Riwayat pendidikan
  strugglesAndContributions: string; // Perjuangan & kontribusi
  worksAndLegacy: string; // Karya / Peninggalan
  tombLocationId: string; // Linked Lokasi Makam
  notes?: string;
  status: 'published' | 'draft';
}

export interface AgendaItem {
  id: string;
  title: string;
  slug: string;
  dayNumber: number; // Hari ke-1, 2, 3, dst.
  dayName: string; // "Kamis, 17 September 2026"
  date: string; // "2026-09-17"
  startTime: string; // "07:30"
  endTime: string; // "09:30"
  durationMinutes: number;
  locationId?: string; // Linked Lokasi Makam
  figureIds?: string[]; // Linked Tokoh
  description: string;
  technicalNotes: string;
  specialNotes?: string;
  photo?: string;
  transitDuration?: string; // Estimasi waktu perjalanan antar makam
  travelNotes?: string; // Catatan rute/jarak perjalanan bus
  status: 'published' | 'draft';
}

export interface RundownItem {
  id: string;
  order: number;
  dayNumber: number;
  dayName: string;
  date: string;
  location: string; // NAMA LOKASI (misal: Berjan, Gunungpring Muntilan, Santren Muntilan, Demak)
  locationId?: string; // ID Relasi Lokasi Makam (Sinkron dengan MakamLokasi)
  figureIds?: string[]; // ID Relasi Tokoh-Tokoh yang Diziarahi (Sinkron dengan Tokoh)
  travelDuration?: string; // RENCANA WAKTU DI JALAN (misal: "1 Jam 30 Menit", "-" untuk awal)
  timeIn?: string; // MASUK (misal: "06.00 WIB", "10.00 WIB")
  durationAtLocation?: string; // DI LOKASI (misal: "2 Jam 30 Menit", "1 Jam 0 Menit")
  timeOut?: string; // KELUAR (misal: "08.30 WIB", "11.00 WIB")
  activity: string; // KEGIATAN utama
  activityTypes?: ('ziarah' | 'makan' | 'belanja' | 'istirahat' | 'mandi' | 'lainnya')[]; // Kategori kegiatan ceklis (ziarah, makan, belanja, istirahat, mandi)
  subActivities?: string[]; // Rincian teks tambahan (misal: Sholat Jama', persiapan)
  time: string; // "08:00 - 09:30 WIB" (kompatibilitas backward)
  duration: string; // Durasi total
  notes?: string; // Keterangan teknis
  status: 'selesai' | 'berlangsung' | 'berikutnya'; // STATUS di akhir
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  type: 'berita' | 'pengumuman';
  isPriority?: boolean; // Tampil prioritas di beranda
  image: string;
  publishDate: string;
  author: string;
  category: string;
  summary: string;
  content: string;
  status: 'published' | 'draft';
}

export interface ParticipantInfo {
  generalRules: string[];
  departureSchedule: {
    meetingPoint: string;
    assemblyTime: string;
    departureTime: string;
    returnEstimate: string;
    description: string;
  };
  busFleets: {
    busNumber: string;
    coordinator: string;
    phone: string;
    capacity: string;
    route: string;
  }[];
  consumption: string;
  facilities: string[];
  ziarahEtiquette: string[];
  luggageChecklist: string[];
  healthAndSafety: string[];
  contacts: {
    role: string;
    name: string;
    phone: string;
  }[];
}

export interface DocumentationItem {
  id: string;
  title: string;
  type: 'foto' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  dayNumber: number;
  locationId?: string;
  caption: string;
  date: string;
}

export interface PanitiaMember {
  id: string;
  name: string;
  position: string; // Jabatan misal: "Ketua Panitia", "Koordinator Transportasi"
  division: string; // "Penanggungjawab", "Pembina", "Pengarah", "Ketua", "Wakil Ketua", "Sekretaris", "Wakil Sekretaris", "Bendahara", "Wakil Bendahara", "Pembantu Umum", atau divisi kustom manual
  phone: string;
  avatar?: string;
  description: string;
  order?: number;
  isContactPublic?: boolean;
}

export interface DoaVerse {
  arabic: string;
  latin?: string;
  translation: string;
  note?: string;
}

export interface DoaCategory {
  id: string;
  title: string;
  category: 'niat' | 'tawassul' | 'yasin' | 'tahlil' | 'doa_ziarah' | 'safar';
  description: string;
  verses: DoaVerse[];
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  yearMasehi: string;
  yearHijriah: string;
  organizer: string;
  headquarters: string;
  eventDates: string;
  eventTimeStart: string; // Jam pelaksanaan besar
  eventCountdownTarget: string; // Target tanggal jam untuk countdown "2026-10-06T06:00:00"
  contactWhatsApp: string;
  contactEmail: string;
  hotline?: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  logoUrl?: string;
  heroImageUrl: string;
  pocketBookUrl?: string;
  pocketBookTitle: string;
  showActiveAgendaBanner?: boolean; // Tampilkan atau sembunyikan fitur banner jadwal berlangsung di beranda
  activeAgendaMode?: 'auto' | 'manual'; // 'auto': otomatis sesuai waktu sekarang, 'manual': dipilih manual oleh admin
  manualActiveAgendaId?: string; // ID agenda yang dipilih jika mode manual
  activeRundownId?: string; // ID item rundown yang sedang berlangsung saat ini
  liveBroadcastNote?: string; // Pengumuman / catatan langsung dari admin untuk jamaah
  waGreeting?: string; // Salam pembuka pesan WhatsApp
  waClosing?: string; // Salam penutup / footer pesan WhatsApp
  waPerAgendaTemplate?: string; // Template teks share per agenda ke WhatsApp
  waAllRundownIntro?: string; // Narasi pengantar share semua rundown ke WhatsApp

  // SINKRONISASI RUTE ADMIN KE SELURUH PERANGKAT
  activeRouteMode?: 'ngetan' | 'ngulon';

  // KELOLA PUSAT NAVIGASI & INFORMASI KILAT
  infoKilatBadge?: string;
  infoKilatTitle?: string;
  infoKilatDescription?: string;
  showLongNavCard?: boolean;
  longNavTitle?: string;
  longNavDescription?: string;
  longNavButtonText?: string;
  longNavChips?: string[];

  // Visibilitas 4 Kartu Pintasan Kilat
  showKilatAgenda?: boolean;
  showKilatTokoh?: boolean;
  showKilatQuickSchedule?: boolean;
  showKilatDoa?: boolean;

  // Konten Kustom 4 Kartu Kilat
  kilatAgendaTitle?: string;
  kilatAgendaDesc?: string;
  kilatTokohTitle?: string;
  kilatTokohDesc?: string;
  kilatQuickScheduleTitle?: string;
  kilatQuickScheduleDesc?: string;
  kilatDoaTitle?: string;
  kilatDoaDesc?: string;

  // KELOLA SELURUH NARASI SITUS (TERUPDATE OTOMATIS DI SEMUA PERANGKAT)
  profileBackgroundNarration?: string;
  profilePurposeNarration?: string;
  pesantrenWelcomeNarration?: string;
  doaIntroductionNarration?: string;
  participantNoticeNarration?: string;
  beritaIntroNarration?: string;
  dokumentasiIntroNarration?: string;
  footerNarration?: string;

  // ========================================================
  // PENGATURAN TEMA & TATA LETAK ("SESUAIKAN" / THEME CUSTOMIZER)
  // SINKRONISASI REALTIME DI SELURUH PERANGKAT
  // ========================================================
  // 1. Tipografi & Font Tampilan
  themeFontBody?: 'jakarta' | 'inter' | 'roboto' | 'poppins';
  themeFontHeading?: 'cinzel' | 'amiri' | 'serif' | 'sans';
  themeFontSize?: 'standard' | 'medium' | 'large';

  // 2. Skema Warna & Nuansa Visual
  themeColorScheme?: 'emerald' | 'teal' | 'gold' | 'navy' | 'forest';
  themeAccentColor?: 'amber' | 'gold' | 'emerald' | 'rose' | 'bronze';
  themeBgTint?: 'stone' | 'ivory' | 'white' | 'slate';
  themeCardRadius?: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-lg';
  themeShowPattern?: boolean;

  // 3. Tata Letak & Posisi Urutan Bagian Beranda (Urutan Dinamis & Visibilitas)
  sectionOrderHome?: string[];
  sectionVisibilityHome?: Record<string, boolean>;

  // 4. Semua Tautan / Link Eksternal & Internal
  linkPesantrenWeb?: string;
  linkMapsLocation?: string;
  linkYoutube?: string;
  linkInstagram?: string;
  linkFacebook?: string;
  linkTikTok?: string;
  linkBukuSakuPdf?: string;
  linkEmergencyCall?: string;

  // 5. Kustomisasi Semua Kata-Kata & Judul Tampilan UI
  uiHeaderBadgeText?: string;
  uiBtnNavigasiText?: string;
  uiBtnBukuSakuText?: string;
  uiBtnJadwalText?: string;
  uiHomeCountdownTitle?: string;
  uiHomeCountdownSubtitle?: string;
  uiHomeLiveTrackerTitle?: string;
  uiHomeMakamTitle?: string;
  uiHomeMakamSubtitle?: string;
  uiHomeTokohTitle?: string;
  uiHomeTokohSubtitle?: string;
  uiHomeDoaTitle?: string;
  uiHomeDoaSubtitle?: string;
  uiHomeBeritaTitle?: string;
  uiHomeBeritaSubtitle?: string;
  uiHomeBukuSakuTitle?: string;
  uiHomeBukuSakuSubtitle?: string;
}

export type ZiarahMode = 'ngetan' | 'ngulon';

export interface DownloadableDoc {
  id: string;
  title: string;
  fileName: string;
  category: 'panduan' | 'denah' | 'surat' | 'sop' | 'jadwal';
  fileSize: string;
  description: string;
  uploadedAt: string;
  previewContent?: string;
  downloadUrl?: string;
}

export interface BukuSakuChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  content: string;
  arabicSnippet?: string;
  notes?: string;
}
