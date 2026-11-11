import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Calendar,
  User,
  Share2,
  Tag,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export const BeritaDetailView: React.FC = () => {
  const { postsList, selectedDetailSlug, navigateTo, openShareModal, openLightbox } = useApp();

  const post = postsList.find((p) => p.slug === selectedDetailSlug) || postsList[0];

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900">Berita Tidak Ditemukan</h2>
        <button
          onClick={() => navigateTo('berita')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg"
        >
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  // Related posts
  const relatedPosts = postsList
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Berita & Pengumuman', view: 'berita' },
          { label: post.title },
        ]}
      />

      {/* Main Article Container */}
      <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Featured Image */}
        {post.image && (
          <div
            onClick={() =>
              openLightbox({
                url: post.image,
                title: post.title,
                caption: post.summary,
              })
            }
            className="relative aspect-16/8 bg-stone-100 overflow-hidden cursor-zoom-in"
          >
            <img
              src={post.image}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          {/* Metadata & Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-md font-semibold text-white ${
                  post.type === 'pengumuman' ? 'bg-amber-600' : 'bg-emerald-800'
                }`}
              >
                {post.type === 'pengumuman' ? 'Pengumuman' : 'Berita'}
              </span>
              <span className="flex items-center gap-1 font-medium text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                {post.publishDate}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-700">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <Tag className="w-3.5 h-3.5" />
                {post.category}
              </span>
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: post.title,
                  summary: post.summary,
                  url: `${window.location.origin}/#/berita/${post.slug}`,
                  image: post.image,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bagikan</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-islamic font-bold text-stone-900 leading-tight">
            {post.title}
          </h1>

          {/* Lead Summary */}
          <div className="p-4 bg-emerald-50/70 border-l-4 border-emerald-700 rounded-r-xl text-xs sm:text-sm text-stone-700 font-serif italic leading-relaxed">
            {post.summary}
          </div>

          {/* Full Content */}
          <div className="text-sm sm:text-base text-stone-800 font-serif leading-relaxed space-y-4 whitespace-pre-line">
            {post.content}
          </div>

          {/* Priority Note if set */}
          {post.isPriority && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Ini adalah pengumuman prioritas resmi dari Panitia Ziarah An-Nawawi 2026. Harap diperhatikan oleh seluruh koordinator dan peserta.
              </span>
            </div>
          )}

          {/* Bottom Share Bar */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-medium text-stone-600">
              Sebarkan informasi ini kepada santri, alumni, dan rombongan ziarah:
            </span>
            <button
              onClick={() =>
                openShareModal({
                  title: post.title,
                  summary: post.summary,
                  url: `${window.location.origin}/#/berita/${post.slug}`,
                  image: post.image,
                })
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>Bagikan ke WhatsApp & Grup</span>
            </button>
          </div>
        </div>
      </article>

      {/* Related News Section */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-stone-900">
            Berita & Pengumuman Terkait
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rPost) => (
              <div
                key={rPost.id}
                onClick={() => navigateTo('berita-detail', rPost.slug)}
                className="bg-white p-4 rounded-xl border border-stone-200 hover:border-emerald-600/50 shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-xs text-stone-500 font-medium">
                    {rPost.publishDate}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 mt-1">
                    {rPost.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {rPost.summary}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
