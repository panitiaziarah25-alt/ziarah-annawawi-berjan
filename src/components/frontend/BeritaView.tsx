import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Newspaper,
  Calendar,
  User,
  Search,
  ArrowRight,
  Share2,
  AlertCircle,
} from 'lucide-react';

export const BeritaView: React.FC = () => {
  const { postsList, navigateTo, openShareModal, siteSettings } = useApp();
  const [selectedType, setSelectedType] = useState<'all' | 'berita' | 'pengumuman'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return postsList
      .filter((p) => p.status === 'published')
      .filter((p) => (selectedType === 'all' ? true : p.type === selectedType))
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  }, [postsList, selectedType, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Berita & Pengumuman' }]} />

      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          Pusat Warta & Instruksi
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Berita & Pengumuman Ziarah An-Nawawi 2026
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          {siteSettings.beritaIntroNarration ||
            "Kumpulan rilis resmi panitia, petunjuk teknis keberangkatan, tausiyah masyayikh, serta perkembangan terkini kegiatan ziarah."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'all'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Semua ({postsList.filter((p) => p.status === 'published').length})
          </button>
          <button
            onClick={() => setSelectedType('pengumuman')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'pengumuman'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Pengumuman
          </button>
          <button
            onClick={() => setSelectedType('berita')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === 'berita'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Berita
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita atau pengumuman..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-xs text-stone-500">
          Tidak ada berita atau pengumuman yang sesuai kriteria pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigateTo('berita-detail', post.slug)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-semibold text-white ${
                      post.type === 'pengumuman' ? 'bg-amber-600' : 'bg-emerald-800'
                    }`}
                  >
                    {post.type === 'pengumuman' ? 'Pengumuman' : 'Berita'}
                  </span>
                  {post.isPriority && (
                    <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-md font-bold">
                      Prioritas
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">Oleh {post.author}</span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-serif line-clamp-3 mt-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <span>Baca Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openShareModal({
                        title: post.title,
                        summary: post.summary,
                        url: `${window.location.origin}/#/berita/${post.slug}`,
                        image: post.image,
                      });
                    }}
                    className="p-1.5 text-stone-400 hover:text-emerald-800 rounded-md transition-colors"
                    title="Bagikan"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
