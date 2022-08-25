import React from "react";

class TimeEntryField extends React.Component {
    constructor(props) {
        super(props);
        const timeState = {
          hourValue : ((props.defaultValue) ? props.defaultValue.split(":")[0] : "00"),
          minuteValue : ((props.defaultValue) ? props.defaultValue.split(":")[1] : "00"),
        };
        timeState.timeValue = timeState.hourValue + ":" + timeState.minuteValue;
        this.state = timeState;

        // I don't understand why this is needed, but it sure seems to be.
        // without it, this.setState() isn't in scope, so it pukes.
        this.handleInputChange = this.handleInputChange.bind(this);
        this.keyStroke = this.keyStroke.bind(this);
    }

    handleInputChange(event) {
        const newValue = event.target.value;
        const newState = {};
        if (/hour/.test(event.target.name)) {
            newState.hourValue = newValue;
            newState.minuteValue = this.state.minuteValue;
        }
        else {
            newState.minuteValue = newValue;
            newState.hourValue = this.state.hourValue;
        }

        this.setState(newState);
        const max = parseInt(event.target.getAttribute("max"));
        try {
            const intVal = parseInt(newValue);
            if (intVal >= 0 && intVal <= max) {
                // they've typed something legit... add to the state and call callback. 
                newState.timeValue = this.padDigits(newState.hourValue) + ":" + this.padDigits(newState.minuteValue);
                this.setState(newState);
                if (this.props.timeChanged) {
                    this.props.timeChanged(newState.timeValue);
                }
            }
        }
        catch(e) {
            // who cares... you're typing weird stuff.
        }
    }

    keyStroke(event) {
        let currentValue = event.target.value;
        let arrowed = false;
        if (event.keyCode === 38)  {
            arrowed = true;
            currentValue++;
        }
        else if (event.keyCode === 40) {
            arrowed = true;
            currentValue--;
        }

        if (arrowed) {
            const max = parseInt(event.target.getAttribute("max"));
            if (currentValue < 0) {
                currentValue = 0;
            }
            else if (currentValue > max) {
                currentValue = max;
            }
            this.updateState(event.target.name, this.padDigits(currentValue));
        }
        else {
            // allow for tab, backspace, delete and numbers.  if its not, cancel the event. 
            if (event.keyCode !== 9 && event.keyCode !== 8 && event.keyCode !== 127 && (event.keyCode < 48 || event.keyCode > 57)) {
                event.preventDefault();
                return false;
            }
        }
    }

    updateState(fieldName, value) {
        const oldState = this.state;
        let newState = {};
        if (/hour/.test(fieldName)) {
            newState = {
                hourValue: value,
                timeValue : value + ":" + oldState.minuteValue
            };
        }
        else {
            newState = {
                minuteValue: value,
                timeValue : oldState.hourValue + ":" + value
            };
        }
        this.setState(newState);
        if (this.props.timeChanged) {
           this.props.timeChanged(newState.timeValue);
        }
    }

    padDigits(digit) {
        if (digit < 10) {
            return "0" + digit;
        }
        else {
            return "" + digit;
        }
    }


    render() {
        return (
            <div className="time-container">
                <label>{this.props.label}</label>
                <div className="time-box-container">
                    <input type="text" maxLength={2} pattern="\d\d" onKeyDown={this.keyStroke} onChange={this.handleInputChange} value={this.state.hourValue} step="1" max="23" name="hour"/>
                    <div className="colon">:</div>
                    <input type="text" maxLength={2} pattern="\d\d" onKeyDown={this.keyStroke} onChange={this.handleInputChange} value={this.state.minuteValue} step="1" max="59" name="minute"/>
                </div>
            </div>
        );
    }
}
export default TimeEntryField;