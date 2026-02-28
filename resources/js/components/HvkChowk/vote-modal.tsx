'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'sonner';

interface PollOption {
    id: string;
    optionText: string;
    votes: number;
}

interface VoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    pollId: string;
    pollQuestion: string;
    options: PollOption[];
    onVoteSuccess: () => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, pollId, pollQuestion, options, onVoteSuccess }) => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitVote = async () => {
        if (!selectedOption) {
            toast.error('Please select an option');
            return;
        }

        setIsSubmitting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch(`/api/poll-options/${selectedOption}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(result.message || 'Vote submitted successfully!');
                setSelectedOption('');
                onVoteSuccess();
                onClose();
            } else {
                const result = await response.json();
                console.error('Vote validation errors:', result);
                toast.error(result.error || result.message || 'Failed to submit vote');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error('Vote submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedOption('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Your Vote</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* Poll Question */}
                    <h3 className="mb-6 text-base font-medium text-gray-900">{pollQuestion}</h3>

                    {/* Options with Radio Buttons */}
                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                        <div className="space-y-3">
                            {options.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.id} id={option.id} />
                                    <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal text-gray-700">
                                        {option.optionText}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitVote}
                        disabled={isSubmitting || !selectedOption}
                        className="bg-primary text-gray-800 hover:cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Vote'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VoteModal;
