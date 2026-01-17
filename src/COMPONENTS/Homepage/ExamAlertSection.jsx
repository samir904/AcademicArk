export default function ExamAlertSection({ examAlert }) {
    if (!examAlert.hasExamSoon) {
        return null;
    }

    return (
        <div className="mb-12 border border-[#FF5454] border-opacity-30 rounded-lg bg-[#FF5454] bg-opacity-10 p-6">
            <div className="flex gap-4">
                <div className="text-2xl">
                    ⚠️
                </div>
                <div>
                    <h3 className="font-semibold text-[#FF5454] mb-2">
                        Exam Alert
                    </h3>
                    <p className="text-[#B3B3B3] text-sm">
                        {examAlert.message || `Your exam is in ${examAlert.daysUntilExam} days`}
                    </p>
                    <button className="mt-3 text-[#FF5454] text-sm font-medium hover:underline">
                        View exam schedule →
                    </button>
                </div>
            </div>
        </div>
    );
}
