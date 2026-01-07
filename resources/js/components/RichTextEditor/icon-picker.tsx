import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import { FaCalendarDay, FaIcons, FaImages, FaLocationDot, FaRoute, FaVideo } from 'react-icons/fa6';

interface IconPickerProps {
    editor: Editor | null;
    onIconSelect: (iconName: string) => void;
}

const icons = [
    { name: 'FaCalendarDay', component: FaCalendarDay },
    { name: 'FaImages', component: FaImages },
    { name: 'FaVideo', component: FaVideo },
    { name: 'FaLocationDot', component: FaLocationDot },
    { name: 'FaRoute', component: FaRoute },
];

const IconPicker = ({ editor, onIconSelect }: IconPickerProps) => {
    if (!editor) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div aria-label="Add Icon" className={editor.isActive('icon') ? 'is-active' : ''}>
                    <FaIcons className="h-4 w-4 cursor-pointer" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0">
                <div className="grid grid-cols-4 gap-2 p-2">
                    {icons.map((icon) => (
                        <div
                            key={icon.name}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-md border p-1 hover:bg-gray-100"
                            onClick={() => {
                                onIconSelect(icon.name);
                            }}
                        >
                            <icon.component className="h-3 w-3 text-gray-600" />
                        </div>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default IconPicker;
