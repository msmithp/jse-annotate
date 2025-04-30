/** MessageBox.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The MessageBox component displays a simple text box (not modal). The color
 * of the text is decided by the `type`, which can be either:
 *      * "success" -> green text
 *      * otherwise -> red text
 */


interface MessageBoxProps {
    type: string,
    text: string
}

function MessageBox({ type, text }: MessageBoxProps) {
    let className;
    if (type === "success") {
        className="successMessage";
    } else {
        className = "errorMessage"
    }

    return (
        <p className={className}>{text}</p>
    )
}

export default MessageBox;