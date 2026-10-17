import type { LucideIcon } from "lucide-react";
import {navigate} from "../../utils/navigation.ts";

type NavItemProps = {
    icon: LucideIcon;
    label: string;
    path:string;
    currentPath:string
};

export default function NavItem(props: NavItemProps) {
    const Icon = props.icon;
    const isActive = props.path === props.currentPath;
    return (
        <button  onClick={()=>navigate(props.path)} className={`flex items-center gap-5 rounded-lg px-4 py-3 text-white hover:bg-[#4C1D95]  md:justify-center lg:justify-start ${isActive ? "bg-[#6D28D9]" : "hover:bg-[#4C1D95]"} `}>
            <Icon size={25} />
            <span className="hidden lg:block font-semibold">
                {props.label}
            </span>
        </button>
    );
}