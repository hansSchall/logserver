import React, { DetailedHTMLProps, HTMLAttributes, HTMLProps, PropsWithChildren } from "react"

export function Badge(props:
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        color?: string,
    }) {
    return <div className={props.color ? "badge-" + props.color : "badge"} {...props}></div>
}