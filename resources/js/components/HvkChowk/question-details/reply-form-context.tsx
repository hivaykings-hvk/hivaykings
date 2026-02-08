'use client';

import React, { createContext, useContext, useState } from 'react';

interface ReplyFormContextType {
    openReplyFormId: string | null;
    setOpenReplyFormId: (id: string | null) => void;
}

const ReplyFormContext = createContext<ReplyFormContextType | undefined>(undefined);

export function ReplyFormProvider({ children }: { children: React.ReactNode }) {
    const [openReplyFormId, setOpenReplyFormId] = useState<string | null>(null);

    return <ReplyFormContext.Provider value={{ openReplyFormId, setOpenReplyFormId }}>{children}</ReplyFormContext.Provider>;
}

export function useReplyFormContext() {
    const context = useContext(ReplyFormContext);
    if (!context) {
        throw new Error('useReplyFormContext must be used within ReplyFormProvider');
    }
    return context;
}
