import { useCallback } from "react";
import { categoriesService } from "../../api/services/categories.ts";
import { useApi } from "../../hooks/useApi.ts";
import Modal from "../ui/Modal.tsx";

interface CategoryDetailsProps {
    categoryId: number;
    onClose: () => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function CategoryDetails({ categoryId, onClose }: CategoryDetailsProps) {
    const fetchCategory = useCallback(
        () => categoriesService.getById(categoryId),
        [categoryId],
    );

    const { data: category, isLoading, error, reload } = useApi(fetchCategory);

    return (
        <Modal title="Category details">
            {isLoading && <p className="text-gray-600">Loading category...</p>}

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

            {!isLoading && !error && category && (
                <dl className="space-y-3 text-sm">
                    <div>
                        <dt className="font-medium text-gray-500">Name</dt>
                        <dd className="text-gray-900">{category.name}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Description</dt>
                        <dd className="text-gray-900">{category.description ?? "—"}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Status</dt>
                        <dd className="text-gray-900">{category.isActive ? "Active" : "Inactive"}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Created</dt>
                        <dd className="text-gray-900">{formatDate(category.createdAt)}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-gray-500">Last updated</dt>
                        <dd className="text-gray-900">
                            {category.updatedAt ? formatDate(category.updatedAt) : "—"}
                        </dd>
                    </div>
                </dl>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default CategoryDetails;