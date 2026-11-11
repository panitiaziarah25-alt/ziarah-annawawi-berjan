import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Newspaper,
  Image,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Download,
  BookOpen,
  Navigation,
  Radio,
  CheckCircle2,
  Cloud,
  Compass,
  FileEdit,
  Paintbrush,
} from 'lucide-react';
import { generateWordPressPluginZip } from '../../utils/wordpressZip';

interface AdminOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ setActiveTab }) => {
  const {
    agendaList,
    rundownList,
    makamList,
    tokohList,
    postsList,
    documentationList,
    panitiaList,
    doaList,
    downloadableDocs,
    bukuSakuChapters,
    siteSettings,
    navigateTo,
    showToast,
    ziarahMode,
    switchZiarahMode,
    isCloudConnected,
    syncAllToCloud,
  } = useApp();

  const activeRundown = rundownList.find(
    (r) => r.id === siteSettings.activeRundownId || r.status === 'berlangsung'
  );

  const newsCount = postsList.filter((p) => p.type === 'berita').length;
  const announcementCount = postsList.filter((p) => p.type === 'pengumuman').length;

  const handleDownloadPlugin = async () => {
    try {
      showToast('Menyiapkan file ZIP plugin WordPress...', 'info');
      const blob = await generateWordPressPluginZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ziarah-an-nawawi-2026.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('File ziarah-an-nawawi-2026.zip berhasil diunduh!', 'success');
    } catch {
      showToast('Gagal menghasilkan file ZIP plugin', 'error');
    }
  };

  const statCards = [
    {
      title: 'Agenda Perjalanan',
      count: agendaList.length,
      tab: 'agenda',
      icon: Calendar,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Jadwal Rundown',
      count: rundownList.length,
      tab: 'rundown',
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Lokasi Makam',
      count: makamList.length,
      tab: 'lokasi',
      icon: MapPin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Profil Tokoh',
      count: tokohList.length,
      tab: 'tokoh',
      icon: Users,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Bab Doa & Yasin',
      count: doaList.length,
      tab: 'doa',
      icon: BookOpen,
      color: 'text-emerald-800',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Bab Buku Saku',
      count: bukuSakuChapters.length,
      tab: 'bukusaku',
      icon: BookOpen,
      color: 'text-amber-800',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Berkas Unduhan',
      count: downloadableDocs.length,
      tab: 'berkas',
      icon: Newspaper,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
    },
    {
      title: 'Panitia Terdaftar',
      count: panitiaList.length,
      tab: 'panitia',
      icon: Users,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-emerald-900">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Pusat Kendali Administrator Ziarah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-islamic">
            Dashboard Sistem Informasi Ziarah An-Nawawi 2026
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Kelola data agenda safar, jadwal rundown terperinci, profil maqbarah & auliya', informasi logistik armada bus, serta publikasi berita resmi tanpa menyentuh kode.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigateTo('beranda')}
            className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website Frontend</span>
          </button>
          <button
            onClick={handleDownloadPlugin}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Unduh Plugin WP (.zip)</span>
          </button>
        </div>
      </div>

      {/* CLOUD DATABASE STATUS (FIREBASE FIRESTORE) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
            <Cloud className="w-6 h-6 text-emerald-700" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-900">Database Cloud: Google Firebase Firestore</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isCloudConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                <span>{isCloudConnected ? 'Aktif & Terhubung Online' : 'Menghubungkan ke Cloud...'}</span>
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Project ID: <strong className="font-mono text-stone-700">possible-sphere-t6tvw</strong> · Cloud Realtime Sync Aktif
            </p>
            <p className="text-[11px] text-stone-600">
              Setiap kali Anda menambah, mengedit, atau mengubah rundown, tokoh, dan posisi agenda, data otomatis tersinkronisasi langsung ke Firebase Firestore sehingga seluruh panitia dan jamaah melihat data yang sama secara langsung di perangkat masing-masing.
            </p>
          </div>
        </div>

        <button
          onClick={syncAllToCloud}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Cloud className="w-4 h-4 text-amber-300" />
          <span>Upload & Sinkronkan Semua ke Cloud</span>
        </button>
      </div>

      {/* BANNER STATUS AGENDA BERJALAN SAAT INI (LIVE TRACKER ADMIN) */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-amber-400 rounded-2xl p-5 sm:p-6 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              AGENDA BERJALAN (POSISI REALTIME SAAT INI)
            </span>
          </div>
          {activeRundown ? (
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-islamic text-white">
                {activeRundown.location}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                {activeRundown.dayName} · Masuk: <strong>{activeRundown.timeIn || activeRundown.time}</strong> · Durasi: {activeRundown.durationAtLocation || activeRundown.duration} · Kegiatan: {activeRundown.activity}
              </p>
            </div>
          ) : (
            <p className="text-xs text-emerald-200">
              Belum ada titik yang disetel sebagai posisi berlangsung. Seluruh status rundown saat ini dalam antrian menunggu.
            </p>
          )}
        </div>

        <button
          onClick={() => setActiveTab('agenda-berjalan')}
          className="px-4 py-2 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>Pengaturan Agenda Berjalan →</span>
        </button>
      </div>

      {/* SAKELAR MODE RUTE ZIARAH TAHUNAN (NGETAN VS NGULON) */}
      <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300">
              Mode Rute Bergilir Tahunan
            </span>
            <span className="text-xs font-bold text-stone-800">
              Status Aktif: <strong className="text-emerald-800">{ziarahMode === 'ngetan' ? 'Ziarah Ngetan (Jawa Timur & Madura)' : 'Ziarah Ngulon (Jawa Barat & Banten)'}</strong>
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Pesantren bergantian rute setiap tahunnya. Anda dapat beralih antara <strong>Ziarah Ngetan</strong> dan <strong>Ziarah Ngulon</strong> dengan satu klik. Seluruh data agenda, rundown, makam, dan tokoh masing-masing rute tersimpan aman dan tidak akan hilang!
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => switchZiarahMode('ngetan')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center ${
              ziarahMode === 'ngetan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            Mode Ziarah Ngetan (Jatim)
          </button>
          <button
            onClick={() => switchZiarahMode('ngulon')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center ${
              ziarahMode === 'ngulon'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            Mode Ziarah Ngulon (Jabar/Banten)
          </button>
        </div>
      </div>

      {/* Grid of Statistical Counters */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
          Ringkasan Database Konten
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(stat.tab)}
                className={`bg-white rounded-xl p-4 border ${stat.borderColor} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                    {stat.count}
                  </div>
                  <span className="text-xs text-emerald-800 font-medium group-hover:underline mt-1 inline-block">
                    Kelola data →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Pintasan Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('agenda')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Tambah Agenda Baru</div>
              <div className="text-[11px] text-stone-500">Jadwal safar dan kegiatan</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('rundown')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <PlusCircle className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Perbarui Rundown</div>
              <div className="text-[11px] text-stone-500">Urutan waktu & status</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('lokasi')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <PlusCircle className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Tambah Makam Lokasi</div>
              <div className="text-[11px] text-stone-500">Relasi makam dan tokoh</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('berita')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <PlusCircle className="w-5 h-5 text-rose-700 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Buat Berita / Warta</div>
              <div className="text-[11px] text-stone-500">Rilis instruksi ke santri</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('infokilat')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <Compass className="w-5 h-5 text-emerald-800 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Kelola Info Kilat & Pop-up</div>
              <div className="text-[11px] text-stone-500">Ganti teks, narasi & sembunyikan</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('narasi')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <FileEdit className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Kelola Seluruh Narasi</div>
              <div className="text-[11px] text-stone-500">Latar belakang, doa & maklumat</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('tema')}
            className="p-3 bg-stone-50 hover:bg-emerald-50/60 rounded-lg border border-stone-200 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <Paintbrush className="w-5 h-5 text-emerald-800 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-stone-900">Pengaturan Tema (Sesuaikan)</div>
              <div className="text-[11px] text-stone-500">Edit kata-kata, posisi, gambar, link & font</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
