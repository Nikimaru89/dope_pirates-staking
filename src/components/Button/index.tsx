import React from "react";

import './index.css'

const states:any = {
    0 : 'stake',
    1 : 'unstake',
    2 : 'claim'
}

const Button = (props: any) => {
    const { enableState, status, value, className } = props;
    let cName = '';
    if (className) {
        cName = className;
        if (enableState > 0) {
            if (status === 1) {
                cName += ' danger';
            }
            else {
                cName += ' success';
            }
        }
        else {
            cName += ' disabled';
        }
    }
    else {

        if (status === 1 || status === 2) {
            cName = 'fontsize_25 rectangle';
            if (enableState > 0) {
                if (status === 1) {
                    cName += ' danger';
                }
                else {
                    cName += ' success';
                }
            }
            else {
                cName += ' disabled';
            }
        }
        else {
            cName = 'fontsize_30';
            if (enableState > 0) {
                cName += ' success';
            }
            else {
                cName += ' disabled';
            }
        }
    }
    return (
        <div className="action_button">
            <button 
                className={cName}
                disabled={enableState < 0}
                onClick={props.onClick}>
                {value ? value : states[status]}
            </button>
        </div>
    )
}

export default Button