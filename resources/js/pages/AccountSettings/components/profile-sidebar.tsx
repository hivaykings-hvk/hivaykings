import { useEffect, useState } from 'react';
import { FiLock, FiMapPin, FiMenu, FiSettings, FiUser, FiX } from 'react-icons/fi';
import { AddressForm } from './address-form';
import { PasswordChangeForm } from './password-change-form';
import { PersonalInfoForm } from './personal-info-form';
import { PreferencesForm } from './preferences-form';

interface ProfileSidebarProps {
    user: any;
}

type Section = 'personal' | 'address' | 'preferences' | 'security';

export function ProfileSidebar({ user }: ProfileSidebarProps) {
    const [activeSection, setActiveSection] = useState<Section>('personal');
    const [isMounted, setIsMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const menuItems = [
        {
            id: 'personal' as Section,
            label: 'Personal Information',
            icon: FiUser,
        },
        {
            id: 'address' as Section,
            label: 'Address',
            icon: FiMapPin,
        },
        {
            id: 'preferences' as Section,
            label: 'Preferences',
            icon: FiSettings,
        },
        {
            id: 'security' as Section,
            label: 'Security',
            icon: FiLock,
        },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return <PersonalInfoForm key={user.id} user={user} />;
            case 'address':
                return <AddressForm key={user.id} user={user} />;
            case 'preferences':
                return <PreferencesForm key={user.id} user={user} />;
            case 'security':
                return <PasswordChangeForm key={user.id} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account Settings</h2>
                </div>

                <nav className="flex-1 space-y-1 overflow-auto p-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                                activeSection === item.id
                                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Header + Content */}
            <div className="flex flex-1 flex-col">
                {/* Mobile Header */}
                <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileMenuOpen ? (
                            <FiX className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        ) : (
                            <FiMenu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        )}
                    </button>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account Settings</h2>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="border-b border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-900">
                        <div className="p-4">
                            <h3 className="mb-3 px-2 text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400">Account</h3>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                            activeSection === item.id
                                                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 sm:p-8">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
}
