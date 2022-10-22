
function ToggleButton(props) {
    return (
        <button onClick={props.onClick}>
            {props.working ? "Take a break" : "kick some ass"}
        </button>
    )
}

export default ToggleButton;