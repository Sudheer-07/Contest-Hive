
import { useState, useEffect, useCallback } from 'react';

// LocalStorage key for bookmarks
const BOOKMARKS_KEY = 'contest-hive-bookmarks';

export const useBookmarks = () => {
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([]);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
    if (savedBookmarks) {
      try {
        setBookmarkedContests(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error parsing bookmarks:', error);
        // Reset bookmarks if there's an error
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedContests));
  }, [bookmarkedContests]);

  const toggleBookmark = useCallback((contestId: string) => {
    setBookmarkedContests(prev => {
      if (prev.includes(contestId)) {
        return prev.filter(id => id !== contestId);
      } else {
        return [...prev, contestId];
      }
    });
  }, []);

  const isBookmarked = useCallback((contestId: string) => {
    return bookmarkedContests.includes(contestId);
  }, [bookmarkedContests]);

  return { bookmarkedContests, toggleBookmark, isBookmarked };
};
