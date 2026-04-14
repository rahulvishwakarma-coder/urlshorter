import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { UrlEntry, ApiErrorResponse, RedirectedResponse } from '../types';
import { API_BASE_URL } from '../constants';

export function useUrls() {
  const [userUrls, setUserUrls] = useState<UrlEntry[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [redirectingId, setRedirectingId] = useState<string | null>(null);

  const fetchUserUrls = async () => {
    setIsHistoryLoading(true);
    try {
      const response = await axios.post<{ urls: UrlEntry[] }>(
        `${API_BASE_URL}/api/url/getUrls`
      );
      setUserUrls(response.data.urls);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleRedirect = async (
    shortCode: string,
    urlId: string,
    fallbackUrl: string
  ) => {
    setRedirectingId(urlId);
    try {
      const response = await axios.get<RedirectedResponse>(
        `${API_BASE_URL}/api/url/redirected`,
        { data: { shortCode }, headers: { 'Content-Type': 'application/json' } }
      );
      const destination =
        response.data?.originalUrl ||
        response.data?.url ||
        response.data?.redirectUrl ||
        fallbackUrl;
      window.open(destination, '_blank', 'noopener,noreferrer');
      setUserUrls((prev) =>
        prev.map((u) => (u._id === urlId ? { ...u, clicks: u.clicks + 1 } : u))
      );
    } catch (err) {
      console.error('Redirect failed, falling back', err);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setRedirectingId(null);
    }
  };

  const handleDeleteUrl = async (shortCode: string, urlId: string) => {
    if (deleteConfirmId !== urlId) {
      setDeleteConfirmId(urlId);
      setTimeout(() => setDeleteConfirmId(null), 3000);
      return;
    }
    setDeletingId(urlId);
    setDeleteConfirmId(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/url/deleteUrl`, {
        data: { shortCode },
      });
      setUserUrls((prev) => prev.filter((u) => u._id !== urlId));
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      alert(
        axiosErr.response?.data?.message ||
          'Failed to delete the link. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return {
    userUrls,
    isHistoryLoading,
    deletingId,
    deleteConfirmId,
    redirectingId,
    fetchUserUrls,
    handleRedirect,
    handleDeleteUrl,
  };
}