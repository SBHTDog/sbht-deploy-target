'use client';

import { useState, useEffect } from 'react';

interface Upload {
  id: number;
  text_content: string;
  image_url: string | null;
  created_at: string;
}

export default function UploadsList() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/uploads');
      if (!response.ok) {
        throw new Error('Failed to fetch uploads');
      }
      const data = await response.json();
      setUploads(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No uploads yet. Create your first upload above!
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Uploads
        </h2>
        <button
          onClick={fetchUploads}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      {uploads.map((upload) => (
        <div
          key={upload.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-3">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {upload.text_content}
            </p>
            
            {upload.image_url && (
              <div className="mt-3">
                <img
                  src={upload.image_url}
                  alt="Uploaded content"
                  className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              {new Date(upload.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
