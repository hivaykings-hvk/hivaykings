import React, { createContext, useContext, useState } from 'react';

interface TravelogueCommentContextType {
    openCommentFormId: string | null;
    setOpenCommentFormId: (id: string | null) => void;
}

const TravelogueCommentContext = createContext<TravelogueCommentContextType | undefined>(undefined);

export const TravelogueCommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [openCommentFormId, setOpenCommentFormId] = useState<string | null>(null);

    return <TravelogueCommentContext.Provider value={{ openCommentFormId, setOpenCommentFormId }}>{children}</TravelogueCommentContext.Provider>;
};

export const useTravelogueCommentContext = () => {
    const context = useContext(TravelogueCommentContext);
    if (!context) {
        throw new Error('useTravelogueCommentContext must be used within TravelogueCommentProvider');
    }
    return context;
};
