'use client';

import { useRef, useState } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';

interface ImagePickerWithPreviewProps {
    onImageSelected: (base64: string) => void;
    onValueChange?: (base64: string) => void;
    value?: string;
    previewText?: string;
    buttonText?: string;
    width?: number;
    height?: number;
}

export default function ImagePickerWithPreview({
    onImageSelected,
    onValueChange,
    value,
    previewText = 'Preview',
    buttonText = 'Choose Image',
}: ImagePickerWithPreviewProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                onImageSelected(base64String);
                onValueChange?.(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageSelected('');
        onValueChange?.('');
    };

    return (
        <div>
            {preview ? (
                <div className="relative">
                    <img src={preview} alt={previewText} className="h-64 w-full rounded-lg object-cover" />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                        <FaTimes />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400"
                >
                    <FaCamera className="mx-auto mb-2 text-4xl text-gray-400" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
    );
}
