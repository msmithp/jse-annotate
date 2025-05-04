/** Warning.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The Warning component displays a warning message preceded by an
 * exclamation point icon.
 */


interface WarningProps {
    message: string
}

function Warning({ message }: WarningProps) {
    return (
        <div className="warning">
            <div className="warningExclamation">
                <p>!</p>
            </div>
            <p>{message}</p>
        </div>
    )
}

export default Warning;
