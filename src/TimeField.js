import React from "react";

class TimeField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          timeValue : ((props.defaultValue) ? props.defaultValue : "00:00:00")
        };

        // I don't understand why this is needed, but it sure seems to be.
        // without it, this.setState() isn't in scope, so it pukes.
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const newValue = event.target.value;
        this.setState({timeValue : newValue});
        if (this.props.timeChanged) {
           this.props.timeChanged(newValue);
        }
    }

    render() {
        return (
            <div className="time-container">
                <label>{this.props.label}</label>
                <input type="time" min="00:00:00" max="11:59:59" onChange={this.handleInputChange} value={this.state.timeValue}/>
            </div>
        );
    }
}
export default TimeField;