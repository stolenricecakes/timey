function Octobutton(props) {
    return (
        <button id="octobutton" onClick={props.onClick} className={props.currentState}></button>
    )
}

export default Octobutton;