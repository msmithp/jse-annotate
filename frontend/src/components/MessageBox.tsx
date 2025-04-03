interface MessageBoxProps {
    type: string,
    text: string
}

function MessageBox({ type, text }: MessageBoxProps) {
    let color;
    if (type === "success") {
        color = "#16913d";
    } else {
        color = "#91161e";
    }

    return (
        <p style={{color: color}}>{text}</p>
    )
}

export default MessageBox;