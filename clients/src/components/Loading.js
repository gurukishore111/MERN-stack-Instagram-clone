import React from 'react'
import loading from "./screens/loading.gif"

function Loading() {
    return (
        <div>
            <img src={loading} className="loadingLogo" />
        </div>
    )
}

export default Loading
