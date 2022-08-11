import React, { ButtonHTMLAttributes, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { PropsWithChildren } from "react";

export function Modal(props: PropsWithChildren & {
    onEnter?: VoidFunction
}) {
    return <div className="modal" onKeyUp={ev => {
        if (ev.key == "Enter") {
            props.onEnter?.();
        }
    }}>
        {props.children}
    </div>
}
export function ModalTitle(props: PropsWithChildren) {
    return <div className="modal-title">
        {props.children}
    </div>
}
export function ModalContent(props: PropsWithChildren) {
    return <div className="modal-content">
        {props.children}
    </div>
}
export function ModalButtonrow(props: PropsWithChildren) {
    return <div className="modal-button-row">
        {props.children}
    </div>
}
export function ModalButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button className="modal-button" {...props}>
        {props.children}
    </button>
}
export function ModalInput(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return <input className="modal-input" {...props}>
        {props.children}
    </input>
}