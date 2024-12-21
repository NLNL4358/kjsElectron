import React from 'react'

function PipModeButton() {

    /*** Function */
    const pipModeButtonHandler = () => {
        window.electronAPI.changePipMode()
    }

    /*** Return */
    return (
        <button className="pipModeButton" id="pipModeButton" onClick={() => { pipModeButtonHandler() }}>
            PIP
        </button>
    )
}

export default PipModeButton