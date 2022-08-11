import React from "react";
import { useEffect } from "react";
import lock from "../utils/lock";

let currentWindowTitle: string;
let lastSetWindowTitle: string;

export function WindowTitle({ title: newTitle }: { title: string }) {
    lastSetWindowTitle = newTitle;
    useEffect(() => {
        if (lastSetWindowTitle !== currentWindowTitle) {
            document.title = lastSetWindowTitle;
            currentWindowTitle = lastSetWindowTitle;
        }
    })
    return <></>
}