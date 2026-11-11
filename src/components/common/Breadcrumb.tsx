import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  view?: string;
  slug?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { navigateTo } = useApp();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-stone-700 py-3 mb-4 overflow-x-auto whitespace-nowrap">
      <button
        onClick={() => navigateTo('beranda')}
        className="flex items-center gap-1 hover:text-emerald-800 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Beranda</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" />
            {isLast || !item.view ? (
              <span className="font-semibold text-stone-900 truncate max-w-xs sm:max-w-md">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigateTo(item.view!, item.slug)}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
