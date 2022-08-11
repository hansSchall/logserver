import React from "react"

export function LoadBar(props: {
    label?: string
}) {
    return <div className="fs-loading active">
        <div></div>
        <div></div>
        <div></div>
        {props.label ? <div>
            {props.label}
        </div> : null}
    </div>
}