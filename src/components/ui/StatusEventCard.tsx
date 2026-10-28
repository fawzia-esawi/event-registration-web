type StatCardProps = {
    label: string;
    value: number;
    valueClassName?: string;
    progress?: number;
};

function StatusEventCard({label, value, valueClassName = "text-[#4C1D95]", progress
                  }: StatCardProps) {
    return (
        <div className="bg-[#FAFAFA] border border-[#D8D8D8] rounded-lg shadow-sm p-5">
            <div className="text-[13px] text-[#6B7280]">{label}</div>
            <div className={`text-[32px] font-bold ${valueClassName}`}>{value}</div>
            {progress !== undefined && (
                <div className="h-1.5 bg-[#E5E7EB] rounded-full mt-2">
                    <div
                        className="h-1.5 bg-[#4C1D95] rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}

export default StatusEventCard;