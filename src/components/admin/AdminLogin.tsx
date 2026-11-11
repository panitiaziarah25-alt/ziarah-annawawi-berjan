import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginUser, navigateTo, siteSettings } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Mohon masukkan nama pengguna / email dan kata sandi.');
      return;
    }

    const success = loginUser(username);
    if (success) {
      navigateTo('admin-dashboard');
    } else {
      setError('Nama pengguna atau kata sandi tidak valid. Silakan periksa kembali akun Anda.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Back to Home Link */}
        <button
          onClick={() => navigateTo('beranda')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Pengunjung</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-950 text-white p-6 text-center space-y-2 border-b border-emerald-900">
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt="Logo An-Nawawi"
                className="w-14 h-14 object-contain rounded-xl border border-emerald-700 bg-white p-1 mx-auto shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-serif-islamic font-bold text-xl mx-auto border border-emerald-700 shadow-sm">
                AN
              </div>
            )}
            <h1 className="text-xl font-bold font-serif-islamic tracking-tight text-white">
              Login Administrator WordPress
            </h1>
            <p className="text-xs text-emerald-200">
              {siteSettings.siteTitle} · PP. An-Nawawi Berjan Purworejo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800">
                {error}
              </div>
            )}

            {/* Username field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Username atau Alamat Email WordPress
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin atau email@..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                  aria-label="Tampilkan/Sembunyikan Sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-700"
                />
                <span>Ingat Saya</span>
              </label>
              <span className="text-stone-400">Hak Akses Terenkripsi</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Masuk ke Dashboard Admin</span>
            </button>
          </form>

          {/* Secure Admin Note */}
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
            <span>Sistem Informasi Ziarah An-Nawawi Berjan · Akses terbatas hanya untuk Pengurus & Panitia Resmi.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
