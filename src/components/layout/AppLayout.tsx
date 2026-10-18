import Sidebar from "./Sidebar.tsx";
import Participants from "../../pages/ParticipantsPage.tsx";
import NotFoundPage from "../../pages/NotFoundPage.tsx";
import Events from "../../pages/EventsPage.tsx";
import Categories from "../../pages/CategoriesPage.tsx";
import Dashboard from "../../pages/DashboardPage.tsx";
import {useState,useEffect} from "react";

function AppLayout() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setPath(window.location.pathname);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const renderPage = () => {
        if (path === "/") {
            return <Dashboard/>;
        }

        if (path === "/categories") {
            return <Categories />;
        }

        if (path === "/events") {
            return <Events />;
        }

        if (path === "/participants") {
            return <Participants />;
        }

        return <NotFoundPage/>;
    };
    return (
        <div className="flex min-h-screen bg-[#F5F3F7]">
            <div className="hidden md:flex
            w-20 lg:w-64
            min-h-screen
            flex-col
            bg-gradient-to-b from-[#0B0614] to-[#1A0F2E]
            text-white ">
                <Sidebar currentPath={path}></Sidebar>
            </div>
            <main className="flex-1 bg-[#F5F3F7]">
                {renderPage()}
            </main>
        </div>
    )
            }
export default AppLayout