import { ArrowUpRight, CalendarDays, ClipboardCheck, Folder, RefreshCw, Sparkles, Users } from "lucide-react";
import { dashboardService } from "../api/services/dashboard.ts";
import "../components/dashboard/dashboard.css";
import StatCard from "../components/dashboard/StatCard.tsx";
import { useApi } from "../hooks/useApi.ts";
import { navigate } from "../utils/navigation.ts";

const quickActions = [
    {
        title: "Manage categories",
        description: "Create, edit and organise your event categories.",
        path: "/categories",
        icon: Folder,
    },
    {
        title: "Browse participants",
        description: "Search people and keep their details up to date.",
        path: "/participants",
        icon: Users,
    },
    {
        title: "Explore events",
        description: "See what is coming up and who has registered.",
        path: "/events",
        icon: CalendarDays,
    },
];

function formatCount(value: number, singular: string, plural: string) {
    return `${value.toLocaleString("en-US")} ${value === 1 ? singular : plural}`;
}

function DashboardSkeleton() {
    return (
        <div className="dash-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="dash-glass animate-pulse rounded-3xl p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-4">
                            <div className="h-3 w-28 rounded bg-white/20" />
                            <div className="h-10 w-20 rounded bg-white/20" />
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white/20" />
                    </div>
                    <div className="mt-6 h-3 w-40 rounded bg-white/10" />
                </div>
            ))}
        </div>
    );
}

function DashboardPage() {
    const { data, isLoading, error, reload } = useApi(dashboardService.getSummary);

    return (
        <div className="dash-canvas">
            <div className="dash-orb dash-orb--a" aria-hidden="true" />
            <div className="dash-orb dash-orb--b" aria-hidden="true" />
            <div className="dash-orb dash-orb--c" aria-hidden="true" />

            <div className="relative z-10 mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
                <section className="dash-glass dash-sheen rounded-3xl px-8 pb-24 pt-8">
                    <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-violet-100 ring-1 ring-white/20">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />
                                Live overview
                            </span>
                            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
                            <p className="mt-2 max-w-xl text-violet-100/80">
                                A calm, real-time look at your categories, participants, events and registrations.
                            </p>
                        </div>
                        <button
                            onClick={reload}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/25 transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden="true">
                        <svg className="dash-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path
                                d="M0 60 Q150 0 300 60 T600 60 T900 60 T1200 60 V120 H0 Z"
                                fill="rgba(167, 139, 250, 0.22)"
                            />
                        </svg>
                        <svg className="dash-wave dash-wave--front" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path
                                d="M0 60 Q150 0 300 60 T600 60 T900 60 T1200 60 V120 H0 Z"
                                fill="rgba(124, 58, 237, 0.35)"
                            />
                        </svg>
                    </div>
                </section>

                {isLoading && <DashboardSkeleton />}

                {!isLoading && error && (
                    <div className="dash-glass rounded-3xl border-red-300/30 p-8">
                        <p className="text-lg font-medium text-white">We could not load the dashboard.</p>
                        <p className="mt-1 text-sm text-red-200">{error}</p>
                        <button
                            onClick={reload}
                            className="mt-5 rounded-xl bg-[#6D28D9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C3AED]"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !error && data && (
                    <div className="dash-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Active categories"
                            value={data.totalActiveCategories}
                            hint="Categories that are currently active"
                            icon={Folder}
                            gradient="from-violet-500 to-purple-700"
                        />
                        <StatCard
                            label="Active participants"
                            value={data.totalActiveParticipants}
                            hint="Participants that are currently active"
                            icon={Users}
                            gradient="from-indigo-500 to-violet-700"
                        />
                        <StatCard
                            label="Upcoming events"
                            value={data.totalUpcomingActiveEvents}
                            hint="Active events that have not started yet"
                            icon={CalendarDays}
                            gradient="from-fuchsia-500 to-purple-700"
                        />
                        <StatCard
                            label="Active registrations"
                            value={data.totalActiveRegistrations}
                            hint="Cancelled registrations are not counted"
                            icon={ClipboardCheck}
                            gradient="from-purple-500 to-indigo-700"
                        />
                    </div>
                )}
                {!isLoading && !error && data && (
                    <div className="dash-glass rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-white">
                            Upcoming Events
                        </h2>

                        {data.upcomingEvents.length === 0 ? (
                            <p className="mt-4 text-sm text-violet-100/70">
                                No upcoming events found.
                            </p>
                        ) : (
                            <div className="mt-5 overflow-x-auto">
                                <div className="min-w-[900px]">
                                    <div className="grid grid-cols-7 gap-4 border-b border-white/20 p-3 text-sm font-semibold text-violet-200">
                                        <div>Event Name</div>
                                        <div>Category</div>
                                        <div>Start Date</div>
                                        <div>Location</div>
                                        <div>Capacity</div>
                                        <div>Registrations</div>
                                        <div>Available Seats</div>
                                    </div>

                                    {data.upcomingEvents.map((event) => (
                                        <div
                                            key={event.eventId}
                                            className="grid grid-cols-7 gap-4 border-b border-white/10 p-3 text-sm text-violet-50"
                                        >
                                            <div>{event.eventName}</div>
                                            <div>{event.categoryName}</div>
                                            <div>{new Date(event.startAt).toLocaleString()}</div>
                                            <div>{event.location}</div>
                                            <div>{event.capacity}</div>
                                            <div>{event.activeRegistrationCount}</div>
                                            <div>{event.availableSeats}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="grid gap-4 lg:grid-cols-3">
                    <section className="dash-glass rounded-3xl p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
                        <p className="mt-1 text-sm text-violet-100/70">Jump straight to the part of the system you need.</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {quickActions.map((action) => (
                                <button
                                    key={action.path}
                                    type="button"
                                    onClick={() => navigate(action.path)}
                                    className="dash-glass-hover group rounded-2xl bg-white/10 p-4 text-left ring-1 ring-white/15 hover:bg-white/15"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                                            <action.icon size={20} />
                                        </span>
                                        <ArrowUpRight
                                            size={18}
                                            className="text-violet-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </div>
                                    <p className="mt-4 font-medium text-white">{action.title}</p>
                                    <p className="mt-1 text-xs text-violet-100/70">{action.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="dash-glass rounded-3xl p-6">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-violet-200" />
                            <h2 className="text-lg font-semibold text-white">At a glance</h2>
                        </div>
                        {data ? (
                            <ul className="mt-5 space-y-4 text-sm text-violet-50">
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                                    {formatCount(data.totalActiveCategories, "category helps", "categories help")} organise your events.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                                    {formatCount(data.totalActiveParticipants, "participant is", "participants are")} ready to register.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                                    {formatCount(data.totalUpcomingActiveEvents, "event is", "events are")} still ahead.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                                    {formatCount(data.totalActiveRegistrations, "registration is", "registrations are")} currently active.
                                </li>
                            </ul>
                        ) : (
                            <div className="mt-5 animate-pulse space-y-4">
                                <div className="h-3 w-full rounded bg-white/15" />
                                <div className="h-3 w-5/6 rounded bg-white/15" />
                                <div className="h-3 w-4/6 rounded bg-white/15" />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;