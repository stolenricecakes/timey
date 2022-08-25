import React from "react";

class TimeDisplayField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="time-display-container">
                <div className="label">{this.props.label}:</div>
                <div className="value">{this.props.time}</div>
            </div>
        );
    }
}

export default TimeDisplayField;