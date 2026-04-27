/**
 * XPLORE — Unified History & Bookmark Utility
 * Include this file in all player pages BEFORE agegate.js
 *
 * localStorage keys:
 *   xplore_history   → array of watch entries
 *   xplore_bookmarks → array of bookmark entries
 *
 * Entry shape:
 * {
 *   type: 'jav' | 'hentai' | 'live',
 *   id: string,          // code for JAV, slug for hentai/live
 *   title: string,
 *   thumb: string,
 *   actors: string,      // optional
 *   watchedAt: number,   // timestamp ms
 *   savedAt: number,     // timestamp ms (bookmarks only)
 * }
 */

(function (w) {
  const LS_HISTORY  = 'xplore_history';
  const LS_BOOKMARK = 'xplore_bookmarks';
  const MAX_HISTORY = 100;

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  /** Save a watch entry. Deduplicates by type+id. */
  function saveHistory(entry) {
    // entry: { type, id, title, thumb, actors? }
    let hist = lsGet(LS_HISTORY);
    hist = hist.filter(h => !(h.type === entry.type && h.id === entry.id));
    hist.unshift({ ...entry, watchedAt: Date.now() });
    if (hist.length > MAX_HISTORY) hist = hist.slice(0, MAX_HISTORY);
    lsSet(LS_HISTORY, hist);
  }

  function getHistory(typeFilter) {
    const hist = lsGet(LS_HISTORY);
    return typeFilter ? hist.filter(h => h.type === typeFilter) : hist;
  }

  function removeHistory(type, id) {
    lsSet(LS_HISTORY, lsGet(LS_HISTORY).filter(h => !(h.type === type && h.id === id)));
  }

  function clearHistory(typeFilter) {
    if (!typeFilter) { lsSet(LS_HISTORY, []); return; }
    lsSet(LS_HISTORY, lsGet(LS_HISTORY).filter(h => h.type !== typeFilter));
  }

  function isBookmarked(type, id) {
    return lsGet(LS_BOOKMARK).some(b => b.type === type && b.id === id);
  }

  function toggleBookmark(entry) {
    // entry: { type, id, title, thumb, actors? }
    let bm = lsGet(LS_BOOKMARK);
    if (bm.some(b => b.type === entry.type && b.id === entry.id)) {
      bm = bm.filter(b => !(b.type === entry.type && b.id === entry.id));
    } else {
      bm.unshift({ ...entry, savedAt: Date.now() });
    }
    lsSet(LS_BOOKMARK, bm);
    return isBookmarked(entry.type, entry.id);
  }

  function getBookmarks(typeFilter) {
    const bm = lsGet(LS_BOOKMARK);
    return typeFilter ? bm.filter(b => b.type === typeFilter) : bm;
  }

  function removeBookmark(type, id) {
    lsSet(LS_BOOKMARK, lsGet(LS_BOOKMARK).filter(b => !(b.type === type && b.id === id)));
  }

  function clearBookmarks(typeFilter) {
    if (!typeFilter) { lsSet(LS_BOOKMARK, []); return; }
    lsSet(LS_BOOKMARK, lsGet(LS_BOOKMARK).filter(b => b.type !== typeFilter));
  }

  // Expose globally
  w.XploreHistory = {
    save: saveHistory,
    get: getHistory,
    remove: removeHistory,
    clear: clearHistory,
    isBookmarked,
    toggleBookmark,
    getBookmarks,
    removeBookmark,
    clearBookmarks,
  };
})(window);