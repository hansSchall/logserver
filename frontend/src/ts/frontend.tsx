import { LoadBar } from "./loadBar";
import { renderRoot } from "./renderRoot";
import { WindowTitle } from "./windowTitle";
import React, { StrictMode, useEffect, useState } from "react";
import { Modals, showExampleModal, ShowModal } from "./modal";
import { Bi } from "./bi";
import { Modal, ModalTitle, ModalContent, ModalInput, ModalButtonrow, ModalButton } from "./modalStyle";
import { Badge } from "./badge";
import { LogView } from "./logview";
import { HomeView } from "./home";
import { useLogData } from "./data";

require("./includeStyle");


export let windowButtonDOM: HTMLElement | undefined;

window.addEventListener("load", () => {
    windowButtonDOM = document.getElementById("window-buttons") ?? undefined;
    renderRoot(document.querySelector("#app") as HTMLElement, <App />)
})

function App() {
    const { data, wsConnected } = useLogData();
    const [logsource, setLogSource] = useState<string | null>(null);
    const [logsettings, setLogsettings] = useState<Map<string, string>>(new Map());
    function updateLogSettings() {
        setLogsettings(logsettings);
    }
    return <React.StrictMode>
        <WindowTitle title={wsConnected ? "logserver" : "verbinden..."} />
        <header className="win-header">
            {logsource ? <div className="win-menu" onClick={() => setLogSource(null)}>
                <Bi i="arrow-left"></Bi>
            </div> : <div className="win-menu" onClick={() => setLogSource(null)}>
                <Bi i="list-columns"></Bi>
            </div>}

            <div className="win-title">{wsConnected ? "logserver" : "verbinden..."}</div>
            <div className="win-menu">
                <Bi i="list"></Bi>
            </div>
        </header>
        <div className="main-content">
            {logsource ?
                <LogView source={logsource} updateLogsettings={updateLogSettings} logsettings={logsettings} logData={data} />
                :
                <HomeView selectSource={setLogSource} data={data} />
            }
        </div>
        {wsConnected ? null :
            <div className="connecting-overlay">
                <div className="-box">
                    <div className="-content">Verbinden ...</div>
                </div>
            </div>}
        <Modals />
    </React.StrictMode>
}