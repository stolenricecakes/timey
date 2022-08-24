import React from "react";

class EstimatedCompletion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="est-comp-time-container">
                <div className="est-comp-time-label">Estimated Completion time:</div>
                <div className="est-comp-time-val">{this.props.estTime}</div>
            </div>
        );
    }
}

export default EstimatedCompletion;