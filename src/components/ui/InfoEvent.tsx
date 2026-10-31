type InfoItemProps = {
    label: string;
    value: string;
};

function InfoEvent({ label, value }: InfoItemProps) {
    return (
        <div>
            <div className="text-xs text-[#6B7280] mb-1">{label}</div>
            <div className="font-semibold text-[#1F2937]">{value}</div>
        </div>
    );
}

export default InfoEvent;