import { useCallback, useState } from "react";
import { categoriesService } from "../api/services/categories.ts";
import { useApi } from "../hooks/useApi.ts";

function CategoriesPage() {
    const [includeInactive, setIncludeInactive] = useState(false);

    const fetchCategories = useCallback(
        () => categoriesService.getAll(includeInactive),
        [includeInactive],
    );

    const { data: categories, isLoading, error, reload } = useApi(fetchCategories);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

            <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <input
                    type="checkbox"
                    checked={includeInactive}
                    onChange={(e) => setIncludeInactive(e.target.checked)}
                />
                Include inactive
            </label>

            <div className="mt-4">
                {isLoading && <p className="text-gray-600">Loading categories...</p>}

                {!isLoading && error && (
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={reload}
                            className="mt-2 rounded-lg bg-[#6D28D9] px-4 py-2 text-white hover:bg-[#4C1D95]"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !error && categories && categories.length === 0 && (
                    <p className="text-gray-600">No categories found.</p>
                )}

                {!isLoading && !error && categories && categories.length > 0 && (
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">{category.name}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {category.description ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    category.isActive
                                                        ? "rounded-full bg-green-100 px-3 py-1 text-green-800"
                                                        : "rounded-full bg-gray-200 px-3 py-1 text-gray-700"
                                                }
                                            >
                                                {category.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoriesPage;