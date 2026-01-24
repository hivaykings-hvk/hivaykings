import { ScrollArea } from '@/Components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { FaHeart, FaRegComment } from 'react-icons/fa6';

const LeftSidebarMobile = () => {
    return (
        <Sheet>
            <SheetTrigger className="pt-6 lg:hidden">What's trending now? Click here to see</SheetTrigger>
            <SheetContent side="left" className="h-full !w-full w-full !max-w-full">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription asChild>
                        <div>
                            <ScrollArea className="h-dvh pt-6">
                                {/* Trending Discussions */}
                                <div className="pt-8">
                                    <h2 className="mb-4 text-xl font-bold">Trending Discussions</h2>
                                    <div className="space-y-4">
                                        <div className="rounded-md bg-gray-50 p-3">
                                            <p className="font-medium text-gray-800">Best route from Delhi to Spiti Valley?</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <FaRegComment className="mr-1 h-4 w-4" />
                                                <span>24 replies</span>
                                                <FaHeart className="mr-1 ml-4 h-4 w-4" />
                                                <span>156</span>
                                            </div>
                                        </div>
                                        <div className="rounded-md bg-gray-50 p-3">
                                            <p className="font-medium text-gray-800">Mumbai-Pune toll rate update</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <FaRegComment className="mr-1 h-4 w-4" />
                                                <span>18 replies</span>
                                                <FaHeart className="mr-1 ml-4 h-4 w-4" />
                                                <span>89</span>
                                            </div>
                                        </div>
                                        <div className="rounded-md bg-gray-50 p-3">
                                            <p className="font-medium text-gray-800">Best dhaba stops on NH44?</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <FaRegComment className="mr-1 h-4 w-4" />
                                                <span>31 replies</span>
                                                <FaHeart className="mr-1 ml-4 h-4 w-4" />
                                                <span>67</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Rated Roads */}
                                <div className="mt-6">
                                    <h2 className="mb-4 text-xl font-bold">Top Rated Roads</h2>
                                    <div className="space-y-4">
                                        <div className="rounded-md bg-gray-50 p-3">
                                            <p className="font-medium text-gray-800">Chennai → Pondicherry ECR</p>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Condition</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: '80%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Traffic</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Facilities</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: '90%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Scenic</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: '85%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-md bg-gray-50 p-3">
                                            <p className="font-medium text-gray-800">Mumbai → Pune Expressway</p>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Condition</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: '75%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Traffic</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-yellow-500" style={{ width: '50%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Facilities</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: '80%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Scenic Value</span>
                                                    <div className="h-2.5 w-2/3 rounded-full bg-gray-200">
                                                        <div className="h-2.5 rounded-full bg-yellow-500" style={{ width: '60%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Popular Tags */}
                                <div className="mt-6 mb-20">
                                    <h2 className="mb-4 text-xl font-bold">Popular Tags</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">#spiti</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#ladakh</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#goa</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#rajasthan</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#kerala</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#foodstops</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#nh48</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">#roadtrip</span>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default LeftSidebarMobile;
