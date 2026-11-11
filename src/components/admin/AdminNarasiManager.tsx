import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Save,
  RotateCcw,
  BookOpen,
  Users,
  Compass,
  MessageSquare,
  Sparkles,
  Info,
  CheckCircle2,
  Newspaper,
  Image,
} from 'lucide-react';

export const AdminNarasiManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast } = useApp();

  // Local state for all global narrations
  const [heroHeadline, setHeroHeadline] = useState(siteSettings.heroHeadline || '');
  const [heroSubheadline, setHeroSubheadline] = useState(siteSettings.heroSubheadline || '');

  const [profileBackground, setProfileBackground] = useState(
    siteSettings.profileBackgroundNarration ||
      "Tradisi ziarah kubur ke makam para auliya' dan shalihin merupakan salah satu pilar pendidikan ruhani di lingkungan Pondok Pesantren An-Nawawi Berjan Purworejo. Kegiatan ini bukan sekadar perjalanan fisik (rihlah), melainkan sarana tarbiyah ruhiyyah untuk mentadabburi nilai-nilai keikhlasan, perjuangan, kezuhudan, serta keteguhan para wali Allah dalam menyebarkan syiar Islam di bumi nusantara.\n\nDi tengah perkembangan zaman yang semakin pesat, generasi muda santri dan masyarakat memerlukan keteladanan nyata dari para pendahulu yang telah mewakafkan seluruh usianya untuk agama, bangsa, dan negara. Melalui safar ziarah ini, para santri diajak untuk menyambung sanad batin dan doa kepada para muassis dakwah Islam di tanah Jawa, sekaligus memupuk rasa cinta tanah air (hubbul wathan minal iman)."
  );

  const [profilePurpose, setProfilePurpose] = useState(
    siteSettings.profilePurposeNarration ||
      "Membangun kesadaran spiritual, mempererat jalinan sanad keilmuan dengan para kekasih Allah SWT, mendoakan para muassis dan masyayikh, serta meneladani akhlak mulia dan keteladanan perjuangan dakwah Islam rahmatan lil 'alamin."
  );

  const [pesantrenWelcome, setPesantrenWelcome] = useState(
    siteSettings.pesantrenWelcomeNarration ||
      "Alhamdulillahirabbil 'alamin, dengan memohon ridho dan pertolongan Allah SWT, safar ziarah akbar Pondok Pesantren An-Nawawi Berjan Purworejo kembali diselenggarakan dengan penuh khidmah dan ketertiban. Semoga segenap jamaah dikaruniai kelancaran, keselamatan, serta qobulnya segala hajat duniawi dan ukhrawi."
  );

  const [doaIntro, setDoaIntro] = useState(
    siteSettings.doaIntroductionNarration ||
      "Berikut adalah susunan adab, amaliah aurad, tawassul, surat Yasin, tahlil lengkap, dan doa ziarah makam auliya' shalihin yang mu'tabaroh sesuai tuntunan Masyayikh Pondok Pesantren An-Nawawi Berjan Purworejo."
  );

  const [participantNotice, setParticipantNotice] = useState(
    siteSettings.participantNoticeNarration ||
      "Seluruh jamaah ziarah dimohon mematuhi arahan panitia, memperhatikan tata tertib armada bus, menjaga adab ziarah di maqbarah shalihin, serta senantiasa menjaga kebersihan dan ketertiban umum."
  );

  const [beritaIntro, setBeritaIntro] = useState(
    siteSettings.beritaIntroNarration ||
      "Warta resmi, pengumuman teknis, dan informasi terkini seputar persiapan dan pelaksanaan safar ziarah."
  );

  const [dokumentasiIntro, setDokumentasiIntro] = useState(
    siteSettings.dokumentasiIntroNarration ||
      "Dokumentasi arsip visual, galeri foto, dan rekaman momentum safar ziarah Pondok Pesantren An-Nawawi Berjan Purworejo."
  );

  const [footerNarration, setFooterNarration] = useState(
    siteSettings.footerNarration ||
      "Sistem Informasi & Panduan Digital Resmi Ziarah Makam Auliya', Ulama', dan Pejuang. Dikelola oleh Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo."
  );

  const [waGreeting, setWaGreeting] = useState(
    siteSettings.waGreeting || "Assalamu'alaikum Warahmatullahi Wabarakatuh\n*INFORMASI RESMI SAFAR ZIARAH AN-NAWAWI 2026*"
  );

  const [waClosing, setWaClosing] = useState(
    siteSettings.waClosing || "Wassalamu'alaikum Warahmatullahi Wabarakatuh\n_Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo_"
  );

  const [activeCategory, setActiveCategory] = useState<'beranda' | 'profil' | 'doa' | 'peserta' | 'publikasi' | 'wa'>('beranda');

  const handleSave = () => {
    updateSiteSettings({
      heroHeadline,
      heroSubheadline,
      profileBackgroundNarration: profileBackground,
      profilePurposeNarration: profilePurpose,
      pesantrenWelcomeNarration: pesantrenWelcome,
      doaIntroductionNarration: doaIntro,
      participantNoticeNarration: participantNotice,
      beritaIntroNarration: beritaIntro,
      dokumentasiIntroNarration: dokumentasiIntro,
      footerNarration,
      waGreeting,
      waClosing,
    });
    showToast('Seluruh narasi situs berhasil diperbarui dan tersinkronisasi ke seluruh perangkat secara realtime!', 'success');
  };

  const handleResetDefaults = () => {
    setHeroHeadline("Meneladani Jejak Perjuangan Para Kekasih Allah");
    setHeroSubheadline("Sistem Informasi & Panduan Perjalanan Ziarah Makam Auliya', Ulama', dan Pejuang Pondok Pesantren An-Nawawi Berjan Purworejo Tahun 2026 M. / 1448 H.");
    setProfileBackground("Tradisi ziarah kubur ke makam para auliya' dan shalihin merupakan salah satu pilar pendidikan ruhani di lingkungan Pondok Pesantren An-Nawawi Berjan Purworejo. Kegiatan ini bukan sekadar perjalanan fisik (rihlah), melainkan sarana tarbiyah ruhiyyah untuk mentadabburi nilai-nilai keikhlasan, perjuangan, kezuhudan, serta keteguhan para wali Allah dalam menyebarkan syiar Islam di bumi nusantara.\n\nDi tengah perkembangan zaman yang semakin pesat, generasi muda santri dan masyarakat memerlukan keteladanan nyata dari para pendahulu yang telah mewakafkan seluruh usianya untuk agama, bangsa, dan negara. Melalui safar ziarah ini, para santri diajak untuk menyambung sanad batin dan doa kepada para muassis dakwah Islam di tanah Jawa, sekaligus memupuk rasa cinta tanah air (hubbul wathan minal iman).");
    setProfilePurpose("Membangun kesadaran spiritual, mempererat jalinan sanad keilmuan dengan para kekasih Allah SWT, mendoakan para muassis dan masyayikh, serta meneladani akhlak mulia dan keteladanan perjuangan dakwah Islam rahmatan lil 'alamin.");
    setPesantrenWelcome("Alhamdulillahirabbil 'alamin, dengan memohon ridho dan pertolongan Allah SWT, safar ziarah akbar Pondok Pesantren An-Nawawi Berjan Purworejo kembali diselenggarakan dengan penuh khidmah dan ketertiban. Semoga segenap jamaah dikaruniai kelancaran, keselamatan, serta qobulnya segala hajat duniawi dan ukhrawi.");
    setDoaIntro("Berikut adalah susunan adab, amaliah aurad, tawassul, surat Yasin, tahlil lengkap, dan doa ziarah makam auliya' shalihin yang mu'tabaroh sesuai tuntunan Masyayikh Pondok Pesantren An-Nawawi Berjan Purworejo.");
    setParticipantNotice("Seluruh jamaah ziarah dimohon mematuhi arahan panitia, memperhatikan tata tertib armada bus, menjaga adab ziarah di maqbarah shalihin, serta senantiasa menjaga kebersihan dan ketertiban umum.");
    setBeritaIntro("Warta resmi, pengumuman teknis, dan informasi terkini seputar persiapan dan pelaksanaan safar ziarah.");
    setDokumentasiIntro("Dokumentasi arsip visual, galeri foto, dan rekaman momentum safar ziarah Pondok Pesantren An-Nawawi Berjan Purworejo.");
    setFooterNarration("Sistem Informasi & Panduan Digital Resmi Ziarah Makam Auliya', Ulama', dan Pejuang. Dikelola oleh Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo.");
    setWaGreeting("Assalamu'alaikum Warahmatullahi Wabarakatuh\n*INFORMASI RESMI SAFAR ZIARAH AN-NAWAWI 2026*");
    setWaClosing("Wassalamu'alaikum Warahmatullahi Wabarakatuh\n_Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo_");
    showToast('Seluruh teks narasi dikembalikan ke draf naskah resmi.', 'info');
  };

  const navCategories = [
    { id: 'beranda', label: 'Beranda & Hero', icon: Sparkles },
    { id: 'profil', label: 'Profil & Latar Belakang', icon: BookOpen },
    { id: 'doa', label: 'Amaliah & Doa Ziarah', icon: Compass },
    { id: 'peserta', label: 'Panduan Peserta', icon: Users },
    { id: 'publikasi', label: 'Berita, Galeri & Footer', icon: Newspaper },
    { id: 'wa', label: 'Pesan Siaran WhatsApp', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                Kelola Seluruh Narasi & Teks Situs
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Edit seluruh naskah, latar belakang ziarah, sambutan, doa, himbauan peserta, dan teks WhatsApp secara terpusat.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Simpan Seluruh Narasi</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {navCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Konten Kategori Narasi */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
        {/* KATEGORI 1: BERANDA & HERO */}
        {activeCategory === 'beranda' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Narasi Hero & Beranda Utama</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Teks utama yang pertama kali dilihat oleh jamaah saat mengunjungi website.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Headline Utama Beranda (Hero Headline)
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                  placeholder="Misal: Meneladani Jejak Perjuangan Para Kekasih Allah"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Subheadline / Deskripsi Utama Beranda (Hero Subheadline)
                </label>
                <textarea
                  rows={3}
                  value={heroSubheadline}
                  onChange={(e) => setHeroSubheadline(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  placeholder="Deskripsi ringkas maksud ziarah..."
                />
              </div>
            </div>
          </div>
        )}

        {/* KATEGORI 2: PROFIL KEGIATAN & LATAR BELAKANG */}
        {activeCategory === 'profil' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Narasi Profil Kegiatan & Latar Belakang Ziarah</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Naskah resmi penjelasan maksud, landasan tarbiyah ruhiyyah, dan sambutan Masyayikh.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Latar Belakang Ziarah (Tampil di Halaman Profil Kegiatan)
                </label>
                <textarea
                  rows={6}
                  value={profileBackground}
                  onChange={(e) => setProfileBackground(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed font-serif"
                  placeholder="Ketik latar belakang pelaksanaan ziarah..."
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Gunakan enter dua kali untuk memisahkan antar paragraf.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Maksud, Tujuan & Faedah Amaliah
                </label>
                <textarea
                  rows={3}
                  value={profilePurpose}
                  onChange={(e) => setProfilePurpose(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  placeholder="Ringkasan maksud dan tujuan ziarah..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Kalimah Thoyyibah / Sambutan Masyayikh / Pengasuh
                </label>
                <textarea
                  rows={4}
                  value={pesantrenWelcome}
                  onChange={(e) => setPesantrenWelcome(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  placeholder="Pesan berkah dari Masyayikh..."
                />
              </div>
            </div>
          </div>
        )}

        {/* KATEGORI 3: AMALIAH & DOA ZIARAH */}
        {activeCategory === 'doa' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Narasi Pengantar Amaliah & Doa Ziarah</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Teks pengantar panduan adab, tawassul, Yasin, dan tahlil di halaman Doa.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Pengantar Amaliah & Adab Ziarah
                </label>
                <textarea
                  rows={4}
                  value={doaIntro}
                  onChange={(e) => setDoaIntro(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  placeholder="Pengantar bacaan amaliah doa..."
                />
              </div>
            </div>
          </div>
        )}

        {/* KATEGORI 4: PANDUAN PESERTA & TATA TERTIB */}
        {activeCategory === 'peserta' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Narasi Panduan & Maklumat Peserta</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Pengumuman resmi dan himbauan ketertiban bagi seluruh jamaah safar.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Maklumat & Himbauan Keberangkatan Peserta
                </label>
                <textarea
                  rows={4}
                  value={participantNotice}
                  onChange={(e) => setParticipantNotice(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  placeholder="Ketik himbauan resmi panitia untuk peserta..."
                />
              </div>
            </div>
          </div>
        )}

        {/* KATEGORI 5: BERITA, DOKUMENTASI & FOOTER */}
        {activeCategory === 'publikasi' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Narasi Pengantar Publikasi & Footer</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Pengantar halaman warta berita, galeri dokumentasi, serta keterangan footer situs.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Pengantar Halaman Warta & Berita
                </label>
                <input
                  type="text"
                  value={beritaIntro}
                  onChange={(e) => setBeritaIntro(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  placeholder="Pengantar berita..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Pengantar Halaman Dokumentasi Visual
                </label>
                <input
                  type="text"
                  value={dokumentasiIntro}
                  onChange={(e) => setDokumentasiIntro(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  placeholder="Pengantar dokumentasi..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Keterangan & Hak Cipta Footer Situs
                </label>
                <textarea
                  rows={3}
                  value={footerNarration}
                  onChange={(e) => setFooterNarration(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                  placeholder="Keterangan footer website..."
                />
              </div>
            </div>
          </div>
        )}

        {/* KATEGORI 6: PESAN SIARAN WHATSAPP */}
        {activeCategory === 'wa' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Template Pesan Siaran WhatsApp</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Teks pembuka dan penutup otomatis saat panitia membagikan jadwal atau warta ke grup WhatsApp jamaah.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Salam Pembuka WhatsApp (Header)
                </label>
                <textarea
                  rows={3}
                  value={waGreeting}
                  onChange={(e) => setWaGreeting(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono leading-relaxed"
                  placeholder="Salam pembuka..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Salam Penutup WhatsApp (Footer)
                </label>
                <textarea
                  rows={3}
                  value={waClosing}
                  onChange={(e) => setWaClosing(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono leading-relaxed"
                  placeholder="Salam penutup..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Perubahan otomatis tersinkron ke Firebase Firestore & terupdate di seluruh perangkat pengunjung.</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Simpan Narasi Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
