import EventList from "../components/layout/EventList.tsx";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";
import {useState} from "react";
import CreateEvent from "../components/layout/CreateEvent";

function Events() {
    const [filters, setFilters] = useState({
        search: "",
        categoryId: "",
        isActive: "",
        fromDate: "",
        toDate: "",
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    function updateFilter(
        name: keyof typeof filters,
        value: string
    ) {
        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    }
    function clearFilters() {
        setFilters({
            search: "",
            categoryId: "",
            isActive: "",
            fromDate: "",
            toDate: "",
        });
    }

    return (
        <div className="mr-3 ml-3 flex flex-col h-screen  ">
            <div className="h-[8%]  mt-1.5  flex justify-between items-center ">
                <h1 className="text-2xl font-medium text-black"> Events </h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#4C1D95] w-35 text-white text-sm p-2 rounded-2xl">
                    +  Create Event
                </button>
                {isCreateModalOpen && (
                    <CreateEvent
                        onClose={() => setIsCreateModalOpen(false)}
                        onEventCreated={() => setRefreshKey((prev) => prev + 1)}

                    />
                )}
            </div>

            <div className="my-2 shrink-0 rounded-lg border border-[#D8D8D8] bg-[#F0F0F0] p-4 shadow-sm">
                <div className="flex flex-wrap items-end gap-3">

                    {/* Search */}
                    <InputField
                        label="Search"
                        id="eventSearch"
                        value={filters.search}
                        type="text"
                        placeholder="Search by event name or location..."
                        className="min-w-[220px] flex-[2]"
                        onChange={(e) =>
                            updateFilter("search", e.target.value)
                        }
                    />

                    {/* Category Filter */}
                    <SelectField
                        label="Category"
                        id="categoryFilter"
                        value={filters.categoryId}
                        className="min-w-[140px] flex-1"
                        onChange={(e) =>
                            updateFilter("categoryId", e.target.value)}                    >
                        <option value="" >All Categories</option>
                    </SelectField>

                    {/* Active Filter */}
                    <SelectField
                        label="Status"
                        id="activeFilter"
                        value={filters.isActive}
                        className="min-w-[140px] flex-1 "
                        onChange={(e) =>
                            updateFilter("isActive", e.target.value)}
                    >
                        <option value="" >All Statuses</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </SelectField>


                    {/* From Date */}
                    <InputField
                        label="From Date"
                        id="fromDateFilter"
                        value={filters.fromDate}
                        type="date"
                        className="min-w-[140px] flex-1" onChange={(e) =>
                        updateFilter("fromDate", e.target.value)}

                    />
                    {/* To Date */}
                    <InputField
                        label="To Date"
                        id="toDateFilter"
                        value={filters.toDate}
                        type="date"
                        className="min-w-[140px] flex-1"
                        onChange={(e) =>
                            updateFilter("toDate", e.target.value)
                        }
                    />
                    {/* Clear Filters */}
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-lg border border-[#D8D8D8] bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="h-[75%] mt-1 mb-1 bg-[#FAFAFA] border border-[#D8D8D8] rounded-lg p-4 shadow-sm">
            <EventList key={JSON.stringify(filters)} filters={filters} refreshKey={refreshKey}    onEventUpdated={() => setRefreshKey((previous) => previous + 1)}
            />
            </div>
        </div>
    )
}
export default Events