'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { HiPencilSquare } from 'react-icons/hi2';
import { MdOutlineBarChart } from 'react-icons/md';
import AskHvkForm from './ask-hvk-form';
import CreatePollForm from './create-poll-form';
import FilterComponent from './filter-component';
import PollsList from './polls-list';
import QuestionsList from './questions-list';
import { SortProvider } from './sort-context';
import LoadingSpinner from './spinner';

interface HvkChowkTabsProps {
    user: any;
}

interface TabsContentWrapperProps {
    activeTab: string;
    user: any;
}

const TabsContentWrapper: React.FC<TabsContentWrapperProps> = ({ activeTab, user }) => {
    return (
        <>
            <SortProvider>
                <FilterComponent />
                <Suspense fallback={<LoadingSpinner />}>
                    {activeTab === 'ask-hvk' && <QuestionsList />}
                    {activeTab === 'poll' && <PollsList user={user} />}
                </Suspense>
            </SortProvider>
        </>
    );
};

const HvkChowkTabs = ({ user }: HvkChowkTabsProps) => {
    const [activeTab, setActiveTab] = useState('ask-hvk');

    return (
        <div>
            <Tabs
                defaultValue="ask-hvk"
                value={activeTab}
                onValueChange={setActiveTab}
                className="m-4 mx-auto gap-0 rounded-lg border-2 border-white bg-white shadow-lg"
            >
                <div className="flex items-center gap-2 rounded-t-lg border-0 bg-bgNavBarBlack">
                    <HiPencilSquare className="ml-4 h-6 w-6 text-primary" />
                    <div className="p-2 text-lg font-medium text-gray-100">Start a Discussion</div>
                </div>
                <div className="m-0 border-b-2 border-b-gray-300 p-0">
                    <TabsList className="m-0 rounded-none p-0">
                        <TabsTrigger
                            value="ask-hvk"
                            className="group rounded-none border-0 bg-white py-2 data-[state=active]:rounded-none data-[state=active]:bg-yellow-50 data-[state=active]:text-primary data-[state=active]:shadow-none"
                        >
                            <div className="flex items-center gap-4 px-2">
                                <FaQuestionCircle className="h-5 w-5" />
                                <div className="text-md group-data-[state=inactive]:hidden md:group-data-[state=inactive]:inline">Ask HVK</div>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="poll"
                            className="group rounded-none border-0 bg-white py-2 data-[state=active]:rounded-none data-[state=active]:bg-yellow-50 data-[state=active]:text-primary data-[state=active]:shadow-none"
                        >
                            <div className="flex items-center gap-4 px-2">
                                <MdOutlineBarChart className="h-5 w-5" />
                                <div className="text-md group-data-[state=inactive]:hidden md:group-data-[state=inactive]:inline">Poll</div>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="ask-hvk" className="">
                    <AskHvkForm user={user} />
                </TabsContent>
                <TabsContent value="poll" className="">
                    <CreatePollForm user={user} />
                </TabsContent>
            </Tabs>

            <TabsContentWrapper activeTab={activeTab} user={user} />
        </div>
    );
};

export default HvkChowkTabs;
