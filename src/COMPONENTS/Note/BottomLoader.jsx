import React from 'react';

export const BottomLoader = ({ isLoading, hasMore }) => {
    if (!hasMore && !isLoading) {
        return (
            <div className="flex justify-center py-12 mb-16">
                <div className="text-[#9CA3AF] text-sm font-medium">
                    ✓ You've reached the end
                </div>
            </div>
        );
    }

    if (!hasMore || !isLoading) {
        return null;
    }

    return (
        <div className="flex justify-center py-8 mb-16">
            <div className="flex items-center gap-3">
                {/* Animated dots */}
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div 
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                        style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div 
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                </div>
                <span className="text-[#9CA3AF] text-sm ml-2">Loading more notes...</span>
            </div>
        </div>
    );
};

export default BottomLoader;
