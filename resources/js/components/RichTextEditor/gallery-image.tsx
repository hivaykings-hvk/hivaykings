interface GalleryImageProps {
    src: string;
    onSelectClicked?: () => void;
}

const GalleryImage = ({ src, onSelectClicked }: GalleryImageProps) => {
    return (
        <div
            className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-sm border-2 border-white transition-all hover:border-2 hover:border-primary"
            onClick={onSelectClicked}
        >
            <img src={src} alt="gallery" className="h-full w-full object-cover" />
        </div>
    );
};

export default GalleryImage;
