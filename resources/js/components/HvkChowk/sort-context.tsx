'use client';

import React, { createContext, useContext, useState } from 'react';

type SortType = 'trending' | 'latest';

interface SortContextType {
    sort: SortType;
    setSort: (sort: SortType) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export const SortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sort, setSort] = useState<SortType>('trending');

    return <SortContext.Provider value={{ sort, setSort }}>{children}</SortContext.Provider>;
};

export const useSort = (): SortContextType => {
    const context = useContext(SortContext);
    if (!context) {
        throw new Error('useSort must be used within a SortProvider');
    }
    return context;
};
