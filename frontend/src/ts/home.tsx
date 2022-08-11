import React from "react";
import { Badge } from "./badge";
import { Bi } from "./bi";
import { DataStruct } from "./data";

function SourceStatistics() {
    return <Badge color="">sorry, no statistics yet :-(</Badge>
}

export function HomeView(props: {
    selectSource: (source: string) => void,
    data: DataStruct
}) {
    return <>
        {[...props.data].map(([id, cont]) => {
            return <div className="list-item" onClick={() => props.selectSource(id)}>
                <div className="list-item-title">
                    {id}
                </div>
                <div className="list-item-badges">
                    <SourceStatistics />
                </div>
                {/* <div className="list-item-badges"></div> */}
            </div>
        })}
    </>
}