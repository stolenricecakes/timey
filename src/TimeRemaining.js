import React from "react";

class TimeRemaining extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="time-remaining-container">
                <div className="time-remaining-label">Time Remaining:</div>
                <div className="time-remaining-value">{this.props.time}</div>
            </div>
        );
    }
}

export default TimeRemaining;