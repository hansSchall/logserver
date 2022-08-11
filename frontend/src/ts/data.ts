import { cloneDeep } from "lodash-es";
import { useEffect, useState } from "react";

export type DataStruct = Map<string, string[][]>

export function useLogData() {
    const [data, setData] = useState<DataStruct>(new Map());
    const [wsConnId, setWsConnId] = useState(1);
    const [wsConnected, setWsConnected] = useState(false);
    console.log("WSconnected", wsConnected);
    useEffect(() => {
        const wsurl = new URL(location.href);
        wsurl.pathname = "/listener";
        wsurl.protocol = "ws://"
        console.log(wsurl.toString());
        const ws = new WebSocket(wsurl.href);
        function applyDataChanges() {
            setData(cloneDeep(data));

        }
        ws.addEventListener("message", (ev) => {
            const msgData: string = ev.data.toString();
            console.log(msgData);
            if (msgData.startsWith(">")) {
                const msg = splitcomma(msgData.substring(1));
                const target = msg.shift() as string;
                if (!data.has(target))
                    data.set(target, []);
                data.get(target)?.push(msg);
                applyDataChanges();
            }
        })
        ws.addEventListener("open", () => {
            console.log("%c WS connected", "color: green")
            setWsConnected(true);
            ws.send("#sendall");
            data.clear();
            applyDataChanges();
            console.log("clear data");
        })
        ws.addEventListener("close", () => {
            console.log("%c WS disconnected", "color: red")
            setWsConnected(false);
            setTimeout(setWsConnId, 200, wsConnId + 1)//re-execute useeffect hook
        })
    }, [wsConnId]);
    return {
        data,
        wsConnected
    };
}

export function splitcomma(joined: string, char: string = ",") {
    new RegExp(`(?<!\\\\)${char}`, "g");
    /(?<!\\),/g;
    return joined.split(new RegExp(`(?<!\\\\)${escapeRegExp(char)}`, "g")).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function joincomma(splitted: string[], char: string = ",") {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").split(char).join("\\" + char)).join(char);
}

//@ts-ignore
window.joincomma = joincomma;
//@ts-ignore
window.splitcomma = splitcomma;