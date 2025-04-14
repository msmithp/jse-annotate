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