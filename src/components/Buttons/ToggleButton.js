
function ToggleButton(props) {
    const starts = ["kick some ass", "strike some anus", "bust out the biscuits", "engage in profitable endeavors", "spew out codez"];
    const stops = ["halt activity", "take a break", "take 'er easy", "chillax, bro", "🛑"];
    return (
        <button onClick={props.onClick}>
            {props.working ? stops[props.messageIdx] : starts[props.messageIdx]}
        </button>
    )
}

export default ToggleButton;