import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileCode, CheckCircle2, Terminal, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { generateWordPressPluginZip } from '../../utils/wordpressZip';

export const AdminPluginGuide: React.FC = () => {
  const { showToast } = useApp();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      showToast('Menghasilkan arsip ZIP plugin WordPress...', 'info');
      const blob = await generateWordPressPluginZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ziarah-an-nawawi-2026.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('File ziarah-an-nawawi-2026.zip berhasil diunduh! Siap dipasang di WordPress.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat file ZIP plugin', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-xl font-bold text-stone-900">
          Paket Plugin WordPress & Panduan Lengkap
        </h2>
        <p className="text-xs text-stone-500">
          Unduh file ZIP plugin WordPress siap pakai dan pelajari panduan instalasi, konfigurasi, serta operasional admin.
        </p>
      </div>

      {/* Main Download Callout Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-emerald-900">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 text-xs font-semibold">
            <FileCode className="w-3.5 h-3.5" />
            <span>Plugin WordPress Resmi v1.0.0</span>
          </div>
          <h3 className="text-xl font-bold font-serif-islamic">
            ziarah-an-nawawi-2026.zip
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Berisi seluruh modul PHP WordPress: Custom Post Types (Lokasi, Tokoh, Agenda, Rundown), Meta Boxes, Custom Roles & Capabilities, Bi-directional Relationships, WhatsApp & Social Sharing, dan OpenGraph SEO.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="shrink-0 px-6 py-3.5 text-xs sm:text-sm font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Memproses ZIP...' : 'Unduh File ZIP Plugin (.zip)'}</span>
        </button>
      </div>

      {/* 1. Panduan Instalasi */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 border-b border-stone-100 pb-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-stone-900">
            1. Panduan Instalasi Plugin di WordPress
          </h3>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-stone-700 list-decimal list-inside leading-relaxed">
          <li className="pl-1">
            <strong>Unduh Plugin:</strong> Klik tombol kuning di atas untuk mengunduh berkas <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-emerald-900">ziarah-an-nawawi-2026.zip</code>.
          </li>
          <li className="pl-1">
            <strong>Buka Dashboard WordPress:</strong> Masuk ke panel admin website WordPress Anda (misalnya: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">website.com/wp-admin/</code>).
          </li>
          <li className="pl-1">
            <strong>Unggah Plugin:</strong> Arahkan ke menu <strong>Plugins (Plugin)</strong> → <strong>Add New Plugin (Tambah Plugin Baru)</strong> → Klik tombol <strong>Upload Plugin (Unggah Plugin)</strong> di bagian atas.
          </li>
          <li className="pl-1">
            <strong>Pilih Berkas ZIP:</strong> Klik <em>Choose File</em>, pilih <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">ziarah-an-nawawi-2026.zip</code>, kemudian klik <strong>Install Now (Pasang Sekarang)</strong>.
          </li>
          <li className="pl-1">
            <strong>Aktivasi Plugin:</strong> Setelah proses instalasi selesai, klik tombol <strong>Activate Plugin (Aktifkan Plugin)</strong>.
          </li>
          <li className="pl-1">
            <strong>Selesai:</strong> Menu baru berlabel <strong>"Ziarah 2026"</strong> akan otomatis muncul di bilah navigasi admin WordPress Anda.
          </li>
        </ol>
      </section>

      {/* 2. Panduan Konfigurasi */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 border-b border-stone-100 pb-2">
          <Layers className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-stone-900">
            2. Panduan Konfigurasi & Pengaturan Tampilan
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            Plugin Ziarah An-Nawawi menggunakan sistem arsitektur modular yang kompatibel dengan tema WordPress apapun. Data tetap aman tersimpan di database meskipun Anda mengganti tema.
          </p>

          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
              Menampilkan Portal di Halaman Frontend:
            </h4>
            <p className="text-xs text-stone-600">
              Buat halaman baru di menu <strong>Pages (Halaman)</strong> → <strong>Add New</strong>, beri judul "Ziarah An-Nawawi 2026", lalu masukkan shortcode berikut pada blok konten:
            </p>
            <div className="bg-emerald-950 text-amber-300 font-mono text-xs px-3 py-2 rounded-md">
              [ziarah_portal]
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Shortcode ini akan merender portal ziarah interaktif lengkap dengan navigasi tab, pencarian, dan share WhatsApp.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
              Pengaturan Struktur Tautan Permanen (Permalinks):
            </h4>
            <p className="text-xs text-stone-600">
              Pastikan pengaturan permalink WordPress diatur ke <strong>Post name (%postname%)</strong> di menu <em>Settings → Permalinks</em> agar URL rapi seperti:
            </p>
            <ul className="list-disc list-inside text-xs font-mono text-emerald-800 space-y-1">
              <li>website.com/lokasi/sunan-kudus/</li>
              <li>website.com/tokoh/sunan-muria/</li>
              <li>website.com/agenda/apel-doa-maqbarah-berjan/</li>
              <li>website.com/rundown/</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Panduan Penggunaan Admin */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 border-b border-stone-100 pb-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-stone-900">
            3. Panduan Operasional Dashboard Admin
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <strong className="text-stone-900 block font-semibold">Mengaitkan Tokoh ke Makam</strong>
            <p>
              Saat menambahkan profil tokoh di menu <em>Kelola Tokoh</em>, pilih lokasi pusara pemakaman pada dropdown. Sistem akan otomatis menampilkan tokoh tersebut di profil detail makam yang bersangkutan.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <strong className="text-stone-900 block font-semibold">Mengurutkan Rundown</strong>
            <p>
              Gunakan tombol panah naik/turun di menu <em>Kelola Rundown</em> untuk menyesuaikan urutan agenda per jam, dan pilih status (Selesai, Sedang Berlangsung, Berikutnya).
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <strong className="text-stone-900 block font-semibold">Menetapkan Pengumuman Prioritas</strong>
            <p>
              Centang opsi <em>"Sematkan sebagai Pengumuman Prioritas"</em> pada form berita/pengumuman agar otomatis tampil mencolok di halaman beranda depan.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
            <strong className="text-stone-900 block font-semibold">Membagikan Tautan ke Peserta</strong>
            <p>
              Setiap tombol <em>"Bagikan"</em> di frontend otomatis menyertakan ucapan salam islami dan tautan langsung ke halaman konten yang sedang dibuka.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Struktur File Plugin */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
          Struktur Berkas Kode Sumber Plugin
        </h3>
        <pre className="p-4 bg-stone-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
{`ziarah-an-nawawi/
├── ziarah-an-nawawi.php       # Berkas utama plugin & inisialisasi hook
├── includes/
│   ├── security.php           # Nonce verification, sanitasi input & escaping
│   ├── permissions.php        # Custom Roles (Super Admin, Admin, Editor)
│   ├── post-types.php         # Custom Post Types (Makam, Tokoh, Agenda, Rundown, Dok)
│   ├── custom-fields.php      # Meta Boxes untuk form editor WordPress
│   ├── relationships.php      # Sistem relasi dua arah (Lokasi <-> Tokoh)
│   ├── admin-dashboard.php    # Halaman admin khusus & widget statistik ringkasan
│   ├── sharing.php            # Format template pesan WhatsApp islami & medsos
│   └── seo.php                # Meta OpenGraph & Twitter Card per halaman
├── public/
│   ├── frontend.php           # Shortcode [ziarah_portal] & template loader
│   └── templates/             # Tampilan tema responsif
├── readme.txt                 # Dokumentasi standar plugin WordPress
└── uninstall.php              # Pembersihan data opsi saat plugin dihapus`}
        </pre>
      </section>
    </div>
  );
};
