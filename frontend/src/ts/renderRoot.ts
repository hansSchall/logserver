import { createRoot } from "react-dom/client";

export function renderRoot(loc: HTMLElement, root: React.ReactNode) {
    createRoot(loc).render(root)
}