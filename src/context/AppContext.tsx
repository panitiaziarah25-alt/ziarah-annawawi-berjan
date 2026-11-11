import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, getDocFromServer, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  MakamLokasi,
  Tokoh,
  AgendaItem,
  RundownItem,
  PostItem,
  ParticipantInfo,
  DocumentationItem,
  SiteSettings,
  User,
  PanitiaMember,
  DoaCategory,
  ZiarahMode,
  DownloadableDoc,
  BukuSakuChapter,
} from '../types';
import {
  initialSiteSettings,
  initialUsers,
  initialTokoh,
  initialMakamLokasi,
  initialAgenda,
  initialRundown,
  initialPosts,
  initialParticipantInfo,
  initialDocumentation,
  initialPanitia,
  initialDoaList,
} from '../data/initialData';
import {
  initialMakamLokasiNgulon,
  initialTokohNgulon,
  initialAgendaNgulon,
  initialRundownNgulon,
} from '../data/routeDataNgulon';
import {
  initialDownloadableDocs,
  initialBukuSakuChapters,
} from '../data/extraData';
import { ShareData } from '../utils/shareUtils';

interface AppContextType {
  // Cloud Database (Firebase Firestore)
  isCloudConnected: boolean;
  syncAllToCloud: () => Promise<void>;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  users: User[];
  currentUser: User | null;
  loginUser: (username: string, role?: string) => boolean;
  logoutUser: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUserRole: (id: string, role: User['role']) => void;
  deleteUser: (id: string) => void;

  // Route Mode: Ziarah Ngetan vs Ziarah Ngulon
  ziarahMode: ZiarahMode;
  switchZiarahMode: (mode: ZiarahMode) => void;

  tokohList: Tokoh[];
  addTokoh: (tokoh: Omit<Tokoh, 'id'>) => void;
  updateTokoh: (id: string, updates: Partial<Tokoh>) => void;
  deleteTokoh: (id: string) => void;

  makamList: MakamLokasi[];
  addMakam: (makam: Omit<MakamLokasi, 'id'>) => void;
  updateMakam: (id: string, updates: Partial<MakamLokasi>) => void;
  deleteMakam: (id: string) => void;

  agendaList: AgendaItem[];
  addAgenda: (agenda: Omit<AgendaItem, 'id'>) => void;
  updateAgenda: (id: string, updates: Partial<AgendaItem>) => void;
  deleteAgenda: (id: string) => void;

  rundownList: RundownItem[];
  addRundown: (item: Omit<RundownItem, 'id' | 'order'>) => void;
  updateRundown: (id: string, updates: Partial<RundownItem>) => void;
  deleteRundown: (id: string) => void;
  reorderRundown: (startIndex: number, endIndex: number) => void;
  setActiveRundownProgress: (activeId: string, customNote?: string) => void;
  advanceRundownProgress: (direction: 'next' | 'prev') => void;
  resetAllRundownStatus: (status: 'berikutnya' | 'selesai') => void;
  setLiveBroadcastNote: (note: string) => void;

  postsList: PostItem[];
  addPost: (post: Omit<PostItem, 'id'>) => void;
  updatePost: (id: string, updates: Partial<PostItem>) => void;
  deletePost: (id: string) => void;

  participantInfo: ParticipantInfo;
  updateParticipantInfo: (info: Partial<ParticipantInfo>) => void;

  documentationList: DocumentationItem[];
  addDocumentation: (doc: Omit<DocumentationItem, 'id'>) => void;
  deleteDocumentation: (id: string) => void;

  panitiaList: PanitiaMember[];
  addPanitia: (item: Omit<PanitiaMember, 'id'>) => void;
  updatePanitia: (id: string, updates: Partial<PanitiaMember>) => void;
  deletePanitia: (id: string) => void;

  doaList: DoaCategory[];
  addDoaCategory: (cat: Omit<DoaCategory, 'id'>) => void;
  updateDoaCategory: (id: string, updates: Partial<DoaCategory>) => void;
  deleteDoaCategory: (id: string) => void;

  // Downloadable Docs for Participants
  downloadableDocs: DownloadableDoc[];
  addDocument: (doc: Omit<DownloadableDoc, 'id' | 'uploadedAt'>) => void;
  updateDocument: (id: string, updates: Partial<DownloadableDoc>) => void;
  deleteDocument: (id: string) => void;
  previewDoc: DownloadableDoc | null;
  openPreviewDoc: (doc: DownloadableDoc) => void;
  closePreviewDoc: () => void;

  // Buku Saku Chapters
  bukuSakuChapters: BukuSakuChapter[];
  addBukuSakuChapter: (chap: Omit<BukuSakuChapter, 'id'>) => void;
  updateBukuSakuChapter: (id: string, updates: Partial<BukuSakuChapter>) => void;
  deleteBukuSakuChapter: (id: string) => void;

  // Navigation & Routing State
  currentView: string;
  selectedDetailSlug: string | null;
  navigateTo: (view: string, slug?: string) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;

  // Modals & Search
  isNavModalOpen: boolean;
  setIsNavModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isBukuSakuOpen: boolean;
  setIsBukuSakuOpen: (open: boolean) => void;
  shareModalData: ShareData | null;
  openShareModal: (data: ShareData) => void;
  closeShareModal: () => void;
  lightboxMedia: { url: string; title: string; caption?: string } | null;
  openLightbox: (media: { url: string; title: string; caption?: string }) => void;
  closeLightbox: () => void;

  // Toast
  toast: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;

  // Reset to default data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage Helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`zan_2026_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [ziarahMode, setZiarahMode] = useState<ZiarahMode>(() =>
    loadStored<ZiarahMode>('mode', 'ngetan')
  );

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadStored('settings', initialSiteSettings)
  );
  const [users, setUsers] = useState<User[]>(() => loadStored('users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadStored('current_user', null)
  );

  // Tokoh, Makam, Agenda, Rundown depend on current route mode
  const [tokohList, setTokohList] = useState<Tokoh[]>(() => {
    const curMode = loadStored<ZiarahMode>('mode', 'ngetan');
    const defaultTokoh = curMode === 'ngulon' ? initialTokohNgulon : initialTokoh;
    const stored = loadStored<Tokoh[]>(`tokoh_${curMode}`, defaultTokoh);
    if (!stored || stored.length < defaultTokoh.length) {
      return defaultTokoh;
    }
    return stored;
  });

  const [makamList, setMakamList] = useState<MakamLokasi[]>(() => {
    const curMode = loadStored<ZiarahMode>('mode', 'ngetan');
    const defaultMakam = curMode === 'ngulon' ? initialMakamLokasiNgulon : initialMakamLokasi;
    const stored = loadStored<MakamLokasi[]>(`makam_${curMode}`, defaultMakam);
    if (!stored || stored.length < defaultMakam.length) {
      return defaultMakam;
    }
    return stored;
  });

  const [agendaList, setAgendaList] = useState<AgendaItem[]>(() => {
    const curMode = loadStored<ZiarahMode>('mode', 'ngetan');
    return loadStored(`agenda_${curMode}`, curMode === 'ngulon' ? initialAgendaNgulon : initialAgenda);
  });

  const [rundownList, setRundownList] = useState<RundownItem[]>(() => {
    const curMode = loadStored<ZiarahMode>('mode', 'ngetan');
    const defaultData = curMode === 'ngulon' ? initialRundownNgulon : initialRundown;
    const stored = loadStored<RundownItem[]>(`rundown_${curMode}`, defaultData);
    if (!stored || stored.length === 0 || !stored[1]?.figureIds) {
      return defaultData;
    }
    return stored;
  });

  const [postsList, setPostsList] = useState<PostItem[]>(() =>
    loadStored('posts', initialPosts)
  );
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>(() =>
    loadStored('participant', initialParticipantInfo)
  );
  const [documentationList, setDocumentationList] = useState<DocumentationItem[]>(() =>
    loadStored('documentation', initialDocumentation)
  );
  const [panitiaList, setPanitiaList] = useState<PanitiaMember[]>(() => {
    const stored = loadStored<PanitiaMember[]>('panitia', initialPanitia);
    if (stored && stored.length > 0 && (stored[0].division === 'pengarah' || stored[0].division === 'inti')) {
      return initialPanitia;
    }
    return stored;
  });
  const [doaList, setDoaList] = useState<DoaCategory[]>(() =>
    loadStored('doa', initialDoaList)
  );

  const [downloadableDocs, setDownloadableDocs] = useState<DownloadableDoc[]>(() =>
    loadStored('docs', initialDownloadableDocs)
  );
  const [bukuSakuChapters, setBukuSakuChapters] = useState<BukuSakuChapter[]>(() =>
    loadStored('buku_saku_chaps', initialBukuSakuChapters)
  );

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('beranda');
  const [selectedDetailSlug, setSelectedDetailSlug] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');

  // Modals
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBukuSakuOpen, setIsBukuSakuOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DownloadableDoc | null>(null);
  const [shareModalData, setShareModalData] = useState<ShareData | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<{
    url: string;
    title: string;
    caption?: string;
  } | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Cloud Database (Firebase Firestore) connection state
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const isRemoteUpdateRef = useRef(false);
  const ziarahModeRef = useRef<ZiarahMode>(ziarahMode);

  useEffect(() => {
    ziarahModeRef.current = ziarahMode;
  }, [ziarahMode]);

  // Route mode application helper (loads target data for ngetan/ngulon)
  const applyRouteMode = (newMode: ZiarahMode) => {
    const nextTokoh = loadStored(
      `tokoh_${newMode}`,
      newMode === 'ngulon' ? initialTokohNgulon : initialTokoh
    );
    const nextMakam = loadStored(
      `makam_${newMode}`,
      newMode === 'ngulon' ? initialMakamLokasiNgulon : initialMakamLokasi
    );
    const nextAgenda = loadStored(
      `agenda_${newMode}`,
      newMode === 'ngulon' ? initialAgendaNgulon : initialAgenda
    );
    const defaultRundown = newMode === 'ngulon' ? initialRundownNgulon : initialRundown;
    let nextRundown = loadStored(`rundown_${newMode}`, defaultRundown);
    if (!nextRundown || nextRundown.length === 0 || (!nextRundown[0].travelDuration && !nextRundown[0].timeIn)) {
      nextRundown = defaultRundown;
    }

    setZiarahMode(newMode);
    setTokohList(nextTokoh);
    setMakamList(nextMakam);
    setAgendaList(nextAgenda);
    setRundownList(nextRundown);
    localStorage.setItem('zan_2026_mode', JSON.stringify(newMode));
  };

  // Firestore Sync Helper
  const syncToFirestore = async (collectionName: string, docId: string, data: any) => {
    try {
      await setDoc(doc(db, collectionName, docId), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    }
  };

  // Test connection & Subscribe to real-time changes
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setIsCloudConnected(true);
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error('Please check your Firebase configuration.');
          setIsCloudConnected(false);
        } else {
          // Connected even if test doc does not exist
          setIsCloudConnected(true);
        }
      }
    }
    testConnection();

    // 1. Subscribe to Global Documents from Firestore (Settings, Posts, Documentation, Panitia)
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'global'),
      (snap) => {
        if (snap.exists()) {
          const remoteSettings = snap.data() as Partial<SiteSettings>;
          isRemoteUpdateRef.current = true;
          setSiteSettings((prev) => ({ ...prev, ...remoteSettings }));

          // Realtime authoritative sync: if remote settings specifies activeRouteMode and differs from local ziarahMode, auto-sync!
          if (
            remoteSettings.activeRouteMode &&
            (remoteSettings.activeRouteMode === 'ngetan' || remoteSettings.activeRouteMode === 'ngulon') &&
            remoteSettings.activeRouteMode !== ziarahModeRef.current
          ) {
            applyRouteMode(remoteSettings.activeRouteMode);
          }

          setTimeout(() => {
            isRemoteUpdateRef.current = false;
          }, 100);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/global');
      }
    );

    const unsubPosts = onSnapshot(
      doc(db, 'posts', 'all'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setPostsList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'posts/all');
      }
    );

    const unsubDocs = onSnapshot(
      doc(db, 'documentation', 'all'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setDocumentationList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'documentation/all');
      }
    );

    const unsubPanitia = onSnapshot(
      doc(db, 'panitia', 'all'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setPanitiaList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'panitia/all');
      }
    );

    return () => {
      unsubSettings();
      unsubPosts();
      unsubDocs();
      unsubPanitia();
    };
  }, []);

  // 2. Real-time sync for Rundown, Tokoh, Makam, Agenda per current route mode
  useEffect(() => {
    const unsubRundown = onSnapshot(
      doc(db, 'rundown', ziarahMode),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setRundownList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `rundown/${ziarahMode}`);
      }
    );

    const unsubTokoh = onSnapshot(
      doc(db, 'tokoh', ziarahMode),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setTokohList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `tokoh/${ziarahMode}`);
      }
    );

    const unsubMakam = onSnapshot(
      doc(db, 'makam', ziarahMode),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setMakamList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `makam/${ziarahMode}`);
      }
    );

    const unsubAgenda = onSnapshot(
      doc(db, 'agenda', ziarahMode),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            isRemoteUpdateRef.current = true;
            setAgendaList(data.items);
            setTimeout(() => {
              isRemoteUpdateRef.current = false;
            }, 100);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `agenda/${ziarahMode}`);
      }
    );

    return () => {
      unsubRundown();
      unsubTokoh();
      unsubMakam();
      unsubAgenda();
    };
  }, [ziarahMode]);

  // Sync to localStorage and Firestore
  useEffect(() => {
    localStorage.setItem('zan_2026_settings', JSON.stringify(siteSettings));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('settings', 'global', siteSettings);
    }
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('zan_2026_mode', JSON.stringify(ziarahMode));
  }, [ziarahMode]);

  useEffect(() => {
    localStorage.setItem('zan_2026_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('zan_2026_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`zan_2026_tokoh_${ziarahMode}`, JSON.stringify(tokohList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('tokoh', ziarahMode, { items: tokohList, updatedAt: new Date().toISOString() });
    }
  }, [tokohList, ziarahMode]);

  useEffect(() => {
    localStorage.setItem(`zan_2026_makam_${ziarahMode}`, JSON.stringify(makamList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('makam', ziarahMode, { items: makamList, updatedAt: new Date().toISOString() });
    }
  }, [makamList, ziarahMode]);

  useEffect(() => {
    localStorage.setItem(`zan_2026_agenda_${ziarahMode}`, JSON.stringify(agendaList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('agenda', ziarahMode, { items: agendaList, updatedAt: new Date().toISOString() });
    }
  }, [agendaList, ziarahMode]);

  useEffect(() => {
    localStorage.setItem(`zan_2026_rundown_${ziarahMode}`, JSON.stringify(rundownList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('rundown', ziarahMode, { items: rundownList, updatedAt: new Date().toISOString() });
    }
  }, [rundownList, ziarahMode]);

  useEffect(() => {
    localStorage.setItem('zan_2026_posts', JSON.stringify(postsList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('posts', 'all', { items: postsList, updatedAt: new Date().toISOString() });
    }
  }, [postsList]);

  useEffect(() => {
    localStorage.setItem('zan_2026_participant', JSON.stringify(participantInfo));
  }, [participantInfo]);

  useEffect(() => {
    localStorage.setItem('zan_2026_documentation', JSON.stringify(documentationList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('documentation', 'all', { items: documentationList, updatedAt: new Date().toISOString() });
    }
  }, [documentationList]);

  useEffect(() => {
    localStorage.setItem('zan_2026_panitia', JSON.stringify(panitiaList));
    if (!isRemoteUpdateRef.current) {
      syncToFirestore('panitia', 'all', { items: panitiaList, updatedAt: new Date().toISOString() });
    }
  }, [panitiaList]);

  useEffect(() => {
    localStorage.setItem('zan_2026_doa', JSON.stringify(doaList));
  }, [doaList]);

  useEffect(() => {
    localStorage.setItem('zan_2026_docs', JSON.stringify(downloadableDocs));
  }, [downloadableDocs]);

  useEffect(() => {
    localStorage.setItem('zan_2026_buku_saku_chaps', JSON.stringify(bukuSakuChapters));
  }, [bukuSakuChapters]);

  const syncAllToCloud = async () => {
    try {
      showToast('Menyinkronkan seluruh database ke Cloud Firestore...', 'info');
      await Promise.all([
        syncToFirestore('settings', 'global', siteSettings),
        syncToFirestore('rundown', 'ngetan', { items: loadStored('rundown_ngetan', initialRundown), updatedAt: new Date().toISOString() }),
        syncToFirestore('rundown', 'ngulon', { items: loadStored('rundown_ngulon', initialRundownNgulon), updatedAt: new Date().toISOString() }),
        syncToFirestore('tokoh', 'ngetan', { items: loadStored('tokoh_ngetan', initialTokoh), updatedAt: new Date().toISOString() }),
        syncToFirestore('tokoh', 'ngulon', { items: loadStored('tokoh_ngulon', initialTokohNgulon), updatedAt: new Date().toISOString() }),
        syncToFirestore('makam', 'ngetan', { items: loadStored('makam_ngetan', initialMakamLokasi), updatedAt: new Date().toISOString() }),
        syncToFirestore('makam', 'ngulon', { items: loadStored('makam_ngulon', initialMakamLokasiNgulon), updatedAt: new Date().toISOString() }),
        syncToFirestore('posts', 'all', { items: postsList, updatedAt: new Date().toISOString() }),
        syncToFirestore('documentation', 'all', { items: documentationList, updatedAt: new Date().toISOString() }),
        syncToFirestore('panitia', 'all', { items: panitiaList, updatedAt: new Date().toISOString() }),
      ]);
      showToast('Berhasil! Seluruh data dan aset tersinkronisasi ke Firebase Cloud Database.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyinkronkan data ke cloud.', 'error');
    }
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Switch between Ziarah Ngetan and Ziarah Ngulon (Authoritative sync from Admin)
  const switchZiarahMode = (newMode: ZiarahMode) => {
    if (newMode === ziarahMode) return;

    // 1. Save current state to current mode slot
    localStorage.setItem(`zan_2026_tokoh_${ziarahMode}`, JSON.stringify(tokohList));
    localStorage.setItem(`zan_2026_makam_${ziarahMode}`, JSON.stringify(makamList));
    localStorage.setItem(`zan_2026_agenda_${ziarahMode}`, JSON.stringify(agendaList));
    localStorage.setItem(`zan_2026_rundown_${ziarahMode}`, JSON.stringify(rundownList));

    // 2. Apply target mode state
    applyRouteMode(newMode);

    // 3. Sync authoritative route mode to Firestore settings so all devices update in realtime
    setSiteSettings((prev) => {
      const updated = { ...prev, activeRouteMode: newMode };
      syncToFirestore('settings', 'global', updated);
      return updated;
    });

    showToast(
      newMode === 'ngetan'
        ? 'Mode rute berganti ke: Ziarah Ngetan (Jawa Timur) dan tersinkronkan ke seluruh perangkat!'
        : 'Mode rute berganti ke: Ziarah Ngulon (Jawa Barat) dan tersinkronkan ke seluruh perangkat!',
      'info'
    );
  };

  const navigateTo = (view: string, slug?: string) => {
    setCurrentView(view);
    setSelectedDetailSlug(slug || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const loginUser = (username: string, role?: string): boolean => {
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase()
    );

    if (user) {
      if (role && user.role !== role) {
        showToast('Peran pengguna tidak sesuai dengan hak akses yang dipilih.', 'error');
        return false;
      }
      setCurrentUser(user);
      showToast(`Selamat datang, ${user.name}!`);
      return true;
    } else {
      showToast('Kredensial login tidak ditemukan dalam sistem.', 'error');
      return false;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari panel administrator.', 'info');
    navigateTo('beranda');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = `user-${Date.now()}`;
    setUsers((prev) => [...prev, { ...newUser, id }]);
    showToast(`Pengguna "${newUser.name}" berhasil didaftarkan.`);
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    showToast('Hak akses pengguna berhasil diperbarui.');
  };

  const deleteUser = (id: string) => {
    if (currentUser?.id === id) {
      showToast('Tidak dapat menghapus akun Anda sendiri yang sedang aktif.', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Pengguna telah dihapus dari sistem.');
  };

  // Tokoh CRUD
  const addTokoh = (newTokoh: Omit<Tokoh, 'id'>) => {
    const id = `tokoh-${Date.now()}`;
    setTokohList((prev) => [
      { ...newTokoh, id, slug: newTokoh.slug || newTokoh.name.toLowerCase().replace(/\s+/g, '-') },
      ...prev,
    ]);
    showToast(`Profil "${newTokoh.name}" berhasil ditambahkan.`);
  };

  const updateTokoh = (id: string, updates: Partial<Tokoh>) => {
    setTokohList((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Profil tokoh berhasil diperbarui.');
  };

  const deleteTokoh = (id: string) => {
    setTokohList((prev) => prev.filter((t) => t.id !== id));
    showToast('Profil tokoh telah dihapus.');
  };

  // Makam CRUD
  const addMakam = (newMakam: Omit<MakamLokasi, 'id'>) => {
    const id = `makam-${Date.now()}`;
    setMakamList((prev) => [
      { ...newMakam, id, slug: newMakam.slug || newMakam.name.toLowerCase().replace(/\s+/g, '-') },
      ...prev,
    ]);
    showToast(`Lokasi "${newMakam.name}" berhasil ditambahkan.`);
  };

  const updateMakam = (id: string, updates: Partial<MakamLokasi>) => {
    setMakamList((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Data lokasi makam berhasil diperbarui.');
  };

  const deleteMakam = (id: string) => {
    setMakamList((prev) => prev.filter((m) => m.id !== id));
    showToast('Lokasi makam telah dihapus.');
  };

  // Agenda CRUD
  const addAgenda = (newAgenda: Omit<AgendaItem, 'id'>) => {
    const id = `agenda-${Date.now()}`;
    setAgendaList((prev) => [
      { ...newAgenda, id, slug: newAgenda.slug || newAgenda.title.toLowerCase().replace(/\s+/g, '-') },
      ...prev,
    ]);
    showToast(`Agenda "${newAgenda.title}" berhasil dijadwalkan.`);
  };

  const updateAgenda = (id: string, updates: Partial<AgendaItem>) => {
    setAgendaList((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Jadwal agenda berhasil diperbarui.');
  };

  const deleteAgenda = (id: string) => {
    setAgendaList((prev) => prev.filter((a) => a.id !== id));
    showToast('Agenda telah dihapus.');
  };

  // Rundown CRUD
  const addRundown = (newItem: Omit<RundownItem, 'id' | 'order'>) => {
    const id = `rundown-${Date.now()}`;
    const nextOrder = rundownList.length + 1;
    setRundownList((prev) => [...prev, { ...newItem, id, order: nextOrder }]);
    showToast('Item rundown berhasil ditambahkan.');
  };

  const updateRundown = (id: string, updates: Partial<RundownItem>) => {
    setRundownList((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Rundown waktu berhasil diperbarui.');
  };

  const deleteRundown = (id: string) => {
    setRundownList((prev) => prev.filter((r) => r.id !== id));
    showToast('Item rundown telah dihapus.');
  };

  const reorderRundown = (startIndex: number, endIndex: number) => {
    const result = Array.from(rundownList);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const reordered = result.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    setRundownList(reordered);
    showToast('Urutan waktu rundown berhasil disesuaikan.');
  };

  const setActiveRundownProgress = (activeId: string, customNote?: string) => {
    const targetIndex = rundownList.findIndex((r) => r.id === activeId);
    if (targetIndex === -1) return;

    const targetItem = rundownList[targetIndex];
    const updatedRundown = rundownList.map((item, idx) => {
      let status: 'selesai' | 'berlangsung' | 'berikutnya' = 'berikutnya';
      if (idx < targetIndex) {
        status = 'selesai';
      } else if (idx === targetIndex) {
        status = 'berlangsung';
      } else {
        status = 'berikutnya';
      }
      return { ...item, status };
    });

    setRundownList(updatedRundown);
    setSiteSettings((prev) => ({
      ...prev,
      activeRundownId: activeId,
      manualActiveAgendaId: activeId,
      activeAgendaMode: 'manual',
      showActiveAgendaBanner: true,
      liveBroadcastNote: customNote !== undefined ? customNote : prev.liveBroadcastNote,
    }));

    showToast(`Posisi saat ini disetel: "${targetItem.location}". Status rundown disinkronkan!`, 'success');
  };

  const advanceRundownProgress = (direction: 'next' | 'prev') => {
    let curIndex = rundownList.findIndex(
      (r) => r.id === siteSettings.activeRundownId || r.status === 'berlangsung'
    );
    if (curIndex === -1) curIndex = 0;

    let targetIndex = curIndex;
    if (direction === 'next') {
      targetIndex = Math.min(curIndex + 1, rundownList.length - 1);
    } else {
      targetIndex = Math.max(curIndex - 1, 0);
    }

    const targetItem = rundownList[targetIndex];
    if (targetItem) {
      setActiveRundownProgress(targetItem.id);
    }
  };

  const resetAllRundownStatus = (status: 'berikutnya' | 'selesai') => {
    const updated = rundownList.map((item) => ({ ...item, status }));
    setRundownList(updated);
    if (status === 'berikutnya') {
      setSiteSettings((prev) => ({ ...prev, activeRundownId: '' }));
      showToast('Seluruh status rundown direset ke antrian menunggu (belum dimulai).', 'info');
    } else {
      setSiteSettings((prev) => ({ ...prev, activeRundownId: '' }));
      showToast('Seluruh rangkaian agenda rundown ditandai selesai.', 'success');
    }
  };

  const setLiveBroadcastNote = (note: string) => {
    updateSiteSettings({ liveBroadcastNote: note });
    showToast('Pengumuman langsung ke jamaah berhasil diperbarui.');
  };

  // Posts CRUD
  const addPost = (newPost: Omit<PostItem, 'id'>) => {
    const id = `post-${Date.now()}`;
    setPostsList((prev) => [
      { ...newPost, id, slug: newPost.slug || newPost.title.toLowerCase().replace(/\s+/g, '-') },
      ...prev,
    ]);
    showToast(`Artikel "${newPost.title}" berhasil diterbitkan.`);
  };

  const updatePost = (id: string, updates: Partial<PostItem>) => {
    setPostsList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Konten warta berhasil diperbarui.');
  };

  const deletePost = (id: string) => {
    setPostsList((prev) => prev.filter((p) => p.id !== id));
    showToast('Artikel berita telah dihapus.');
  };

  // Participant Info
  const updateParticipantInfo = (info: Partial<ParticipantInfo>) => {
    setParticipantInfo((prev) => ({ ...prev, ...info }));
    showToast('Informasi panduan peserta berhasil diperbarui.');
  };

  // Documentation CRUD
  const addDocumentation = (newDoc: Omit<DocumentationItem, 'id'>) => {
    const id = `doc-${Date.now()}`;
    setDocumentationList((prev) => [{ ...newDoc, id }, ...prev]);
    showToast('Foto/video dokumentasi berhasil diarsipkan.');
  };

  const deleteDocumentation = (id: string) => {
    setDocumentationList((prev) => prev.filter((d) => d.id !== id));
    showToast('Dokumentasi telah dihapus.');
  };

  // Panitia CRUD
  const addPanitia = (item: Omit<PanitiaMember, 'id'>) => {
    const id = `panitia-${Date.now()}`;
    setPanitiaList((prev) => [...prev, { ...item, id }]);
    showToast(`Panitia "${item.name}" berhasil ditambahkan.`);
  };

  const updatePanitia = (id: string, updates: Partial<PanitiaMember>) => {
    setPanitiaList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Data kepanitiaan berhasil diperbarui.');
  };

  const deletePanitia = (id: string) => {
    setPanitiaList((prev) => prev.filter((p) => p.id !== id));
    showToast('Anggota panitia telah dihapus.');
  };

  // Doa CRUD
  const addDoaCategory = (cat: Omit<DoaCategory, 'id'>) => {
    const id = `doa-${Date.now()}`;
    setDoaList((prev) => [...prev, { ...cat, id }]);
    showToast(`Bab bacaan doa "${cat.title}" berhasil ditambahkan.`);
  };

  const updateDoaCategory = (id: string, updates: Partial<DoaCategory>) => {
    setDoaList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('Bacaan doa berhasil diperbarui.');
  };

  const deleteDoaCategory = (id: string) => {
    setDoaList((prev) => prev.filter((d) => d.id !== id));
    showToast('Bab doa telah dihapus.');
  };

  // Downloadable Documents CRUD
  const addDocument = (doc: Omit<DownloadableDoc, 'id' | 'uploadedAt'>) => {
    const id = `doc-file-${Date.now()}`;
    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    setDownloadableDocs((prev) => [{ ...doc, id, uploadedAt: today }, ...prev]);
    showToast(`Berkas "${doc.title}" berhasil diunggah.`);
  };

  const updateDocument = (id: string, updates: Partial<DownloadableDoc>) => {
    setDownloadableDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('Data berkas dokumen berhasil diperbarui.');
  };

  const deleteDocument = (id: string) => {
    setDownloadableDocs((prev) => prev.filter((d) => d.id !== id));
    showToast('Berkas dokumen telah dihapus.');
  };

  const openPreviewDoc = (doc: DownloadableDoc) => {
    setPreviewDoc(doc);
  };

  const closePreviewDoc = () => {
    setPreviewDoc(null);
  };

  // Buku Saku Chapters CRUD
  const addBukuSakuChapter = (chap: Omit<BukuSakuChapter, 'id'>) => {
    const id = `chap-${Date.now()}`;
    setBukuSakuChapters((prev) => [...prev, { ...chap, id }]);
    showToast(`Bab buku saku "${chap.title}" berhasil ditambahkan.`);
  };

  const updateBukuSakuChapter = (id: string, updates: Partial<BukuSakuChapter>) => {
    setBukuSakuChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Isi bab buku saku berhasil diperbarui.');
  };

  const deleteBukuSakuChapter = (id: string) => {
    setBukuSakuChapters((prev) => prev.filter((c) => c.id !== id));
    showToast('Bab buku saku telah dihapus.');
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
    showToast('Pengaturan website dan jadwal berhasil disimpan.');
  };

  const openShareModal = (data: ShareData) => setShareModalData(data);
  const closeShareModal = () => setShareModalData(null);
  const openLightbox = (media: { url: string; title: string; caption?: string }) => setLightboxMedia(media);
  const closeLightbox = () => setLightboxMedia(null);

  const resetAllData = () => {
    setZiarahMode('ngetan');
    setSiteSettings(initialSiteSettings);
    setUsers(initialUsers);
    setCurrentUser(null);
    setTokohList(initialTokoh);
    setMakamList(initialMakamLokasi);
    setAgendaList(initialAgenda);
    setRundownList(initialRundown);
    setPostsList(initialPosts);
    setParticipantInfo(initialParticipantInfo);
    setDocumentationList(initialDocumentation);
    setPanitiaList(initialPanitia);
    setDoaList(initialDoaList);
    setDownloadableDocs(initialDownloadableDocs);
    setBukuSakuChapters(initialBukuSakuChapters);
    localStorage.clear();
    showToast('Data sistem telah direset ke demonstrasi awal.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isCloudConnected,
        syncAllToCloud,
        siteSettings,
        updateSiteSettings,
        users,
        currentUser,
        loginUser,
        logoutUser,
        addUser,
        updateUserRole,
        deleteUser,
        ziarahMode,
        switchZiarahMode,
        tokohList,
        addTokoh,
        updateTokoh,
        deleteTokoh,
        makamList,
        addMakam,
        updateMakam,
        deleteMakam,
        agendaList,
        addAgenda,
        updateAgenda,
        deleteAgenda,
        rundownList,
        addRundown,
        updateRundown,
        deleteRundown,
        reorderRundown,
        setActiveRundownProgress,
        advanceRundownProgress,
        resetAllRundownStatus,
        setLiveBroadcastNote,
        postsList,
        addPost,
        updatePost,
        deletePost,
        participantInfo,
        updateParticipantInfo,
        documentationList,
        addDocumentation,
        deleteDocumentation,
        panitiaList,
        addPanitia,
        updatePanitia,
        deletePanitia,
        doaList,
        addDoaCategory,
        updateDoaCategory,
        deleteDoaCategory,
        downloadableDocs,
        addDocument,
        updateDocument,
        deleteDocument,
        previewDoc,
        openPreviewDoc,
        closePreviewDoc,
        bukuSakuChapters,
        addBukuSakuChapter,
        updateBukuSakuChapter,
        deleteBukuSakuChapter,
        currentView,
        selectedDetailSlug,
        navigateTo,
        adminActiveTab,
        setAdminActiveTab,
        isNavModalOpen,
        setIsNavModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        isBukuSakuOpen,
        setIsBukuSakuOpen,
        shareModalData,
        openShareModal,
        closeShareModal,
        lightboxMedia,
        openLightbox,
        closeLightbox,
        toast,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
