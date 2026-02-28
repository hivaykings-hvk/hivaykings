import { Button } from '@/components/ui/button';
import { CircleUserRound, X } from 'lucide-react';
import React from 'react';

interface ProfileImageUploadProps {
    initialImageUrl?: string | null;
    onImageChange: (file: File | null) => void;
}

interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    preview?: string;
    file?: File;
}

export default function ProfileImageUpload({ initialImageUrl, onImageChange }: ProfileImageUploadProps) {
    const [files, setFiles] = React.useState<FileData[]>(() => {
        if (initialImageUrl) {
            return [
                {
                    id: 'initial',
                    name: 'profile_image',
                    size: 0,
                    type: 'image/*',
                    url: initialImageUrl,
                    preview: initialImageUrl,
                },
            ];
        }
        return [];
    });

    const [isDragging, setIsDragging] = React.useState(false);

    const handleFileChange = (newFiles: FileData[]) => {
        setFiles(newFiles);
        if (newFiles.length > 0 && newFiles[0].file instanceof File) {
            onImageChange(newFiles[0].file);
        } else {
            onImageChange(null);
        }
    };

    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            const file = droppedFiles[0];
            if (file.type.startsWith('image/')) {
                processFile(file);
            }
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newFile: FileData = {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                type: file.type,
                preview: e.target?.result as string,
                file: file,
            };
            handleFileChange([newFile]);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            processFile(selectedFile);
        }
    };

    const removeFile = (fileId: string) => {
        handleFileChange([]);
    };

    const openFileDialog = () => {
        document.getElementById('file-input-profile')?.click();
    };

    const previewUrl = files[0]?.preview || null;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative inline-flex">
                <button
                    aria-label={previewUrl ? 'Change image' : 'Upload image'}
                    className="relative flex size-32 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
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
                            alt={files[0]?.name || 'Uploaded image'}
                            className="size-full object-cover"
                            height={128}
                            src={previewUrl}
                            style={{ objectFit: 'cover' }}
                            width={128}
                        />
                    ) : (
                        <div aria-hidden="true">
                            <CircleUserRound className="size-8 opacity-60" />
                        </div>
                    )}
                </button>
                {previewUrl && (
                    <Button
                        aria-label="Remove image"
                        className="absolute top-1 right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                        onClick={() => removeFile(files[0]?.id)}
                        size="icon"
                    >
                        <X className="size-3.5" />
                    </Button>
                )}
                <input
                    id="file-input-profile"
                    aria-label="Upload image file"
                    className="sr-only"
                    tabIndex={-1}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}
