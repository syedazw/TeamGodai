/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Central API Base configuration.
// If VITE_API_URL is specified in the environment, all frontend requests will route there.
// Otherwise, they fallback to relative paths which is perfect for unified server-client hosting.
// @ts-ignore
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (path: string): string => {
  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

export const getMediaUrl = (url: string | undefined): string => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('data:')) {
    return trimmedUrl;
  }
  return getApiUrl(trimmedUrl);
};
