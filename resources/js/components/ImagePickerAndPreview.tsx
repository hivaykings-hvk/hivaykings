'use client';

import { Button } from '@/Components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';
import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';

interface ImagePickerProps {
    value?: File;
    onChange: (file: File | undefined) => void;
}

export default function ImagePickerAndPreview({ value, onChange }: ImagePickerProps) {
    const [{ files, isDragging }, { removeFile, openFileDialog, getInputProps, handleDragEnter, handleDragLeave, handleDragOver, handleDrop }] =
        useFileUpload({
            accept: 'image/*',
        });

    const previewUrl = files[0]?.preview || null;

    // Use effect to update parent when files change
    useEffect(() => {
        const file = files[0]?.file;
        if (file instanceof File) {
            onChange(file);
        }
    }, [files, onChange]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative inline-flex">
                {/* Drop area */}
                <button
                    aria-label={previewUrl ? 'Change image' : 'Upload image'}
                    className="relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
                    data-dragging={isDragging || undefined}
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    type="button"
                >
                    {previewUrl ? (
                        <img
                            alt={files[0]?.file?.name || 'Uploaded image'}
                            className="size-full object-cover"
                            height={64}
                            src={previewUrl}
                            style={{ objectFit: 'cover' }}
                            width={64}
                        />
                    ) : (
                        <div aria-hidden="true">
                            <CircleUserRoundIcon className="size-4 opacity-60" />
                        </div>
                    )}
                </button>
                {previewUrl && (
                    <Button
                        aria-label="Remove image"
                        className="absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                        onClick={() => {
                            removeFile(files[0]?.id);
                            onChange(undefined);
                        }}
                        size="icon"
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                )}
                <input {...getInputProps()} aria-label="Upload image file" className="sr-only" tabIndex={-1} />
            </div>
        </div>
    );
}
