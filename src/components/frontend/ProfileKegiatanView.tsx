import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { Compass, BookOpen, Target, Calendar, CheckCircle, MapPin, Building, ShieldCheck } from 'lucide-react';

export const ProfileKegiatanView: React.FC = () => {
  const { siteSettings, navigateTo } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Breadcrumb items={[{ label: 'Profil Kegiatan' }]} />

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-emerald-950 text-white p-8 sm:p-12 border border-emerald-900 shadow-md">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 border border-emerald-700 rounded-full text-xs text-amber-300 font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Pondok Pesantren An-Nawawi Berjan Purworejo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-islamic font-bold leading-tight">
            Profil & Latar Belakang Ziarah 2026
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Menelusuri jejak spiritual, sanad keilmuan, dan perjuangan dakwah para kekasih Allah (Auliya'), Ulama' pendahulu, serta Pahlawan Pejuang Nusantara.
          </p>
        </div>
      </div>

      {/* Section 1: Latar Belakang (Dapat diubah via Admin) */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 border-b border-stone-100 pb-3">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-stone-900">Latar Belakang Kegiatan</h2>
        </div>
        <div className="text-sm text-stone-700 leading-relaxed space-y-3 font-serif sm:text-base">
          {(siteSettings.profileBackgroundNarration ||
            "Tradisi ziarah kubur ke makam para auliya' dan shalihin merupakan salah satu pilar pendidikan ruhani di lingkungan Pondok Pesantren An-Nawawi Berjan Purworejo. Kegiatan ini bukan sekadar perjalanan fisik (rihlah), melainkan sarana tarbiyah ruhiyyah untuk mentadabburi nilai-nilai keikhlasan, perjuangan, kezuhudan, serta keteguhan para wali Allah dalam menyebarkan syiar Islam di bumi nusantara.\n\nDi tengah perkembangan zaman yang semakin pesat, generasi muda santri dan masyarakat memerlukan keteladanan nyata dari para pendahulu yang telah mewakafkan seluruh usianya untuk agama, bangsa, dan negara. Melalui safar ziarah ini, para santri diajak untuk menyambung sanad batin dan doa kepada para muassis dakwah Islam di tanah Jawa, sekaligus memupuk rasa cinta tanah air (hubbul wathan minal iman)."
          )
            .split('\n\n')
            .map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>
      </section>

      {/* Sambutan / Kalimah Thoyyibah Masyayikh (Jika diisi Admin) */}
      {siteSettings.pesantrenWelcomeNarration && (
        <section className="bg-gradient-to-r from-emerald-950 to-teal-950 text-white rounded-xl p-6 sm:p-8 space-y-3 border border-emerald-800 shadow-sm">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Pesan & Sambutan Pengasuh Pondok Pesantren</span>
          </div>
          <p className="text-sm sm:text-base text-emerald-100 italic leading-relaxed font-serif">
            "{siteSettings.pesantrenWelcomeNarration}"
          </p>
        </section>
      )}

      {/* Section 2: Maksud dan Tujuan */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 border-b border-stone-100 pb-3">
          <Target className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-stone-900">Maksud dan Tujuan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">Tadzkiratul Maut & Muhasabah</strong>
              <span>Mengingatkan jamaah akan kehidupan akhirat serta melatih kerendahan hati di hadapan Allah SWT.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">Meneladani Perjuangan Auliya'</strong>
              <span>Mempelajari strategi dakwah kultural, toleransi, dan keteguhan iman para Wali Songo serta Masyayikh.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">Menyambung Sanad Keberkahan (Tabarruk)</strong>
              <span>Memohon ridha Allah SWT melalui wasilah doa di tempat-tempat mustajab para shalihin.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">Mempererat Ukhuwah Pesantren</strong>
              <span>Menumbuhkan kebersamaan, kedisiplinan, dan kekeluargaan antara santri, asatidz, alumni, dan wali santri.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Informasi Penyelenggaraan & Jadwal */}
      <section className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 border-b border-stone-100 pb-3">
          <Building className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-stone-900">Informasi Penyelenggaraan & Pelaksanaan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
            <span className="text-xs text-stone-500 font-medium">Lembaga Penyelenggara</span>
            <div className="font-bold text-emerald-950 text-sm">{siteSettings.organizer}</div>
            <div className="text-stone-600 text-xs">Purworejo, Jawa Tengah</div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
            <span className="text-xs text-stone-500 font-medium">Waktu Pelaksanaan</span>
            <div className="font-bold text-emerald-950 text-sm">{siteSettings.eventDates}</div>
            <div className="text-stone-600 text-xs">Durasi 4 Hari 3 Malam Penuh</div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
            <span className="text-xs text-stone-500 font-medium">Titik Kumpul & Pelepasan</span>
            <div className="font-bold text-emerald-950 text-sm">Maqbarah Masyayikh Berjan</div>
            <div className="text-stone-600 text-xs">Gebang, Kabupaten Purworejo</div>
          </div>
        </div>

        {/* Jalur Rute Perjalanan */}
        <div className="space-y-3 pt-2">
          <h3 className="font-semibold text-sm text-stone-900">Gambaran Koridor Rute Perjalanan</h3>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-700">
            <div className="text-center sm:text-left">
              <span className="font-bold text-emerald-900 block">Jalur Jawa Tengah</span>
              <span>Berjan Purworejo → Kadilangu Demak → Menara Kudus → Gunung Muria</span>
            </div>
            <div className="text-amber-600 font-bold hidden sm:block">➔</div>
            <div className="text-center sm:text-left">
              <span className="font-bold text-emerald-900 block">Jalur Jawa Timur</span>
              <span>Tuban Pantura → Maqbarah Tebuireng Jombang → Sunan Ampel Surabaya</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('agenda')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
          >
            Buka Detail Agenda Perjalanan
          </button>
          <button
            onClick={() => navigateTo('informasi-peserta')}
            className="px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Ketentuan & Tata Tertib Peserta
          </button>
        </div>
      </section>
    </div>
  );
};
