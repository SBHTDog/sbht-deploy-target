'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import UploadsList from '@/components/UploadsList';

export default function Home() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        // Trigger a refresh of the uploads list by changing the key
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col items-center space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Upload Manager
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Upload your text content and images. Text is stored in PostgreSQL (AWS RDS), 
                            and images are uploaded to AWS S3.
                        </p>
                    </div>

                    {/* Upload Form */}
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            Create New Upload
                        </h2>
                        <UploadForm onSuccess={handleUploadSuccess} />
                    </div>

                    {/* Uploads List */}
                    <div className="w-full max-w-2xl">
                        <UploadsList key={refreshKey} />
                    </div>
                </div>
            </main>
        </div>
    );
}
