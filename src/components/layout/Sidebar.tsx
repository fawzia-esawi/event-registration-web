import {
    LayoutDashboard,
    Folder,
    CalendarDays,
    House,
    Users,
} from "lucide-react";
import NavItem from "../ui/NavItem.tsx";
function Sidebar(props: {currentPath:string}) {

    return (
        <div>
            <div className="flex items-center gap-3 px-6 py-6">
                <LayoutDashboard size={35} className="shrink-0 text-[#7C3AED]" />
                <span className="hidden lg:block font-semibold text-white">
                   Event Registration System
                </span>
            </div>

            <div className="flex flex-col  px-3 py-2">
                <NavItem icon={House} label="Dashboard" path="/" currentPath={props.currentPath} />

                <NavItem icon={Folder} label="Categories"   path="/categories" currentPath={props.currentPath} />

                <NavItem icon={CalendarDays} label="Events"   path="/events" currentPath={props.currentPath} />

                <NavItem icon={Users} label="Participants"  path="/participants" currentPath={props.currentPath} />
            </div>

        </div>
    )
}
export default Sidebar;