import React, {ReactNode} from "react";

export default function App({children}: {children: ReactNode[] | ReactNode}) {
    return (
        <div>
            {children}
        </div>
    )
}