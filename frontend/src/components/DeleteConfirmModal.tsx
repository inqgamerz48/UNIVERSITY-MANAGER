"use client";

import { AlertTriangle, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    isDeleting?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting = false,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md p-6 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(15,23,42,0.95)] rounded-2xl border border-[var(--error)]/20 shadow-2xl transform transition-all scale-100"
                role="dialog"
                aria-modal="true"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 transition-colors"
                    disabled={isDeleting}
                >
                    <X size={20} className="text-[var(--text-muted)]" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--error)]/10 flex items-center justify-center mb-4">
                        <AlertTriangle size={24} className="text-[var(--error)]" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">Delete {itemName}?</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Are you sure you want to delete this {itemName.toLowerCase()}?
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="btn flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[var(--text-primary)] rounded-xl font-medium transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="btn flex-1 py-2.5 bg-[var(--error)] hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <LoadingSpinner size={18} className="text-white" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
