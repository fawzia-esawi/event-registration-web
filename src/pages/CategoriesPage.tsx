import { useCallback, useState } from "react";
import { ApiError } from "../api/client.ts";
import { categoriesService } from "../api/services/categories.ts";
import CategoryDetails from "../components/categories/CategoryDetails.tsx";
import CategoryForm from "../components/categories/CategoryForm.tsx";
import Modal from "../components/ui/Modal.tsx";
import { useApi } from "../hooks/useApi.ts";
import type { Category, CategoryFormValues } from "../types/category.ts";

function CategoriesPage() {
    const [includeInactive, setIncludeInactive] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [viewingId, setViewingId] = useState<number | null>(null);
    const [editing, setEditing] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchCategories = useCallback(
        () => categoriesService.getAll(includeInactive),
        [includeInactive],
    );

    const { data: categories, isLoading, error, reload } = useApi(fetchCategories);

    function openCreate() {
        setSuccessMessage(null);
        setIsCreateOpen(true);
    }

    function openEdit(category: Category) {
        setSuccessMessage(null);
        setEditing(category);
    }

    function openDelete(category: Category) {
        setSuccessMessage(null);
        setDeleteError(null);
        setDeleting(category);
    }

    async function handleCreate(values: CategoryFormValues) {
        const created = await categoriesService.create({
            name: values.name,
            description: values.description,
        });
        setIsCreateOpen(false);
        setSuccessMessage(`Category "${created.name}" was added.`);
        reload();
    }

    async function handleUpdate(values: CategoryFormValues) {
        if (editing === null) return;
        const updated = await categoriesService.update(editing.id, values);
        setEditing(null);
        setSuccessMessage(`Category "${updated.name}" was updated.`);
        reload();
    }

    async function handleDelete() {
        if (deleting === null || isDeleting) return;

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await categoriesService.remove(deleting.id);
            setSuccessMessage(`Category "${deleting.name}" was deleted.`);
            setDeleting(null);
            reload();
        } catch (err: unknown) {
            setDeleteError(err instanceof ApiError ? err.message : "Something went wrong.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <button
                    onClick={openCreate}
                    className="rounded-lg bg-[#6D28D9] px-4 py-2 text-white hover:bg-[#4C1D95]"
                >
                    Add category
                </button>
            </div>

            {successMessage && (
                <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    {successMessage}
                </div>
            )}

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
                                    <th className="px-4 py-3">Actions</th>
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
                                        <td className="px-4 py-3">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setViewingId(category.id)}
                                                    className="text-[#6D28D9] hover:underline"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => openEdit(category)}
                                                    className="text-[#6D28D9] hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDelete(category)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isCreateOpen && (
                <Modal title="Add category">
                    <CategoryForm
                        submitLabel="Add category"
                        onSubmit={handleCreate}
                        onCancel={() => setIsCreateOpen(false)}
                    />
                </Modal>
            )}

            {editing !== null && (
                <Modal title="Edit category">
                    <CategoryForm
                        initialName={editing.name}
                        initialDescription={editing.description ?? ""}
                        initialIsActive={editing.isActive}
                        showActiveToggle
                        submitLabel="Save changes"
                        onSubmit={handleUpdate}
                        onCancel={() => setEditing(null)}
                    />
                </Modal>
            )}

            {deleting !== null && (
                <Modal title="Delete category">
                    <p className="text-sm text-gray-700">
                        Are you sure you want to delete "{deleting.name}"? This action cannot be undone.
                    </p>

                    {deleteError && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {deleteError}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            onClick={() => setDeleting(null)}
                            disabled={isDeleting}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </Modal>
            )}

            {viewingId !== null && (
                <CategoryDetails
                    categoryId={viewingId}
                    onClose={() => setViewingId(null)}
                />
            )}
        </div>
    );
}

export default CategoriesPage;