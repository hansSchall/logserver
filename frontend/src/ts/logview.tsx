import React, { useState } from "react";
import { Badge } from "./badge";
import { DataStruct, joincomma, splitcomma } from "./data";

export function LogView(props: {
    source: string,
    logsettings: Map<string, string>,
    updateLogsettings: VoidFunction,
    logData: DataStruct
}) {
    const [selectLogLevelTarget, openModalSelectLogLevel] = useState<string[] | null>(null);
    function onclickSelectLogLevel(level: LogLevel | "clear") {
        return function () {
            const propname = joincomma([
                joincomma([
                    props.source,
                    ...(selectLogLevelTarget || [])
                ], "/"),
                "loglevel"
            ], ".");
            if (level === "clear") {
                props.logsettings.delete(propname);
            } else {
                props.logsettings.set(propname, level.toString());
            }
            props.updateLogsettings();
            openModalSelectLogLevel(null);
        }
    }
    const data = props.logData.get(props.source);

    if (!data)
        return <div className="log-view">
            sorry, no data :-(
        </div>


    return <div className="log-view">
        <div className="-nav-bar">
            {
                [...props.logsettings].map(([key, val]) => {
                    const [cont, setting] = splitcomma(key, ".");
                    if (setting == "loglevel") {
                        const [target, ...stack] = splitcomma(cont, "/");
                        if (target !== props.source)
                            return null;
                        return <Badge color={typeToColor(parseInt(val))} onClick={() => {
                            openModalSelectLogLevel(stack);
                        }} key={key}>{stack.join("/")}</Badge>
                    } else {
                        return null
                    }
                })
            }
        </div>
        <div className="-main">
            <table className="log-view-main">
                <tbody>
                    {
                        data.map((msg, id) => {
                            const [absTime, relTime, typ, ...badges] = msg;
                            const msgcontent = badges.pop();
                            const level = logLevelStrings.get(typ.toLowerCase()) || 0;
                            const loglevelForStack = parseInt(badges.map((badge, ind, arr) => {
                                return arr.slice(0, ind + 1)
                            }).reverse().map((stack) => {
                                return props.logsettings.get(joincomma([
                                    joincomma([
                                        props.source,
                                        ...stack
                                    ], "/")
                                    , "loglevel"], "."))
                            }).reduce((prev, curr) => {
                                if (prev) return prev;
                                return curr;
                            }, undefined) || "0");

                            if (level < loglevelForStack) return null;

                            badges

                            return <tr key={id} className={"loglevel-" + typ.toLowerCase()}>
                                <td key="abstime">{absTime}</td>
                                <td key="reltime">{relTime}</td>
                                <td key="typ">
                                    <Badge color={typeToColor(typ.toLowerCase())}>
                                        {typ}
                                    </Badge>
                                </td>
                                <td key="msg">
                                    {badges.map((badge, ind, arr) => {
                                        return <Badge key={ind} onClick={() => {
                                            openModalSelectLogLevel(arr.slice(0, ind + 1))
                                        }}>{badge}</Badge>
                                    })}
                                    <span key={"msg"}>{msgcontent}</span>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className="pinned-displays"></div>
        {selectLogLevelTarget ?
            <div className="select-log-level">
                <div>{selectLogLevelTarget.join("/")}</div>
                <div className="-log-level -error" onClick={onclickSelectLogLevel(LogLevel.ERROR)}>Error</div>
                <div className="-log-level -warn" onClick={onclickSelectLogLevel(LogLevel.WARN)}>Warn</div>
                <div className="-log-level -log" onClick={onclickSelectLogLevel(LogLevel.LOG)}>Log</div>
                <div className="-log-level -info" onClick={onclickSelectLogLevel(LogLevel.INFO)}>Info</div>
                <div className="-space" />
                <div className="-log-level -clear" onClick={onclickSelectLogLevel("clear")}>Clear</div>
                <div className="-log-level -cancel" onClick={() => openModalSelectLogLevel(null)}>Cancel</div>
            </div>
            : null}
    </div>
}

enum LogLevel {
    INFO,
    LOG,
    WARN,
    ERROR
}

const logLevelStrings = new Map([
    ["error", 3],
    ["warn", 2],
    ["log", 1],
    ["info", 0]
])

function typeToColor(typ: string | number) {
    if (typ === "error" || typ === 3)
        return "red";
    if (typ === "warn" || typ === 2)
        return "orange";
    if (typ === "info" || typ === 0)
        return "grey";
    return "";
}