// GreetingSection.jsx
export default function GreetingSection({ greeting }) {
    return (
        <div className="mb-8 pt-4">
            {/* Main greeting - emotional anchor */}
            <h1 className="text-5xl capitalize md:text-6xl font-bold text-white mb-3 tracking-tight">
                {greeting.message}
            </h1>
            
            {/* Semester info - light context */}
            {greeting.semester && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#9CA3AF]">
                        Semester {greeting.semester}
                    </span>
                    <span className="text-[#4B5563]">•</span>
                    <span className="text-[#9CA3AF]">
                        {greeting.branch}
                    </span>
                </div>
            )}
        </div>
    );
}
