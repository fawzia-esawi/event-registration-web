function NotFoundPage() {

    return (
        <div className="flex min-h-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#6D28D9]">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                    Page Not Found
                </h2>

                <p className="mt-2 text-gray-500">
                    The page you are looking for does not exist.
                </p>
            </div>
        </div>
    );
}
export default NotFoundPage