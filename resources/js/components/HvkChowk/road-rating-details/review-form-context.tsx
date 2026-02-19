'use client';

import React, { createContext, useContext, useState } from 'react';

interface ReviewFormContextType {
    openReviewFormId: string | null;
    setOpenReviewFormId: (id: string | null) => void;
}

const ReviewFormContext = createContext<ReviewFormContextType | undefined>(undefined);

export function ReviewFormProvider({ children }: { children: React.ReactNode }) {
    const [openReviewFormId, setOpenReviewFormId] = useState<string | null>(null);

    return <ReviewFormContext.Provider value={{ openReviewFormId, setOpenReviewFormId }}>{children}</ReviewFormContext.Provider>;
}

export function useReviewFormContext() {
    const context = useContext(ReviewFormContext);
    if (!context) {
        throw new Error('useReviewFormContext must be used within ReviewFormProvider');
    }
    return context;
}
