import type { ReactNode } from "react";

interface ModalProps {
    title: string;
    children: ReactNode;
}

function Modal({ title, children }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                <h2 id="modal-title" className="mb-4 text-xl font-semibold text-gray-900">
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );
}

export default Modal;