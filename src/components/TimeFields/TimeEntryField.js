import React, {useEffect, useState} from "react";

const TimeEntryField = (props) => {
    const defaultValue = props.defaultValue;
    const [hourValue, setHourValue] = useState(defaultValue ? defaultValue.split(":")[0] : "00")
    const [minuteValue, setMinuteValue] = useState(defaultValue ? defaultValue.split(":")[1] : "00")
    const timeChanged = props.timeChanged;

    const handleInputChange = (event) => {
        try {
            const max = parseInt(event.target.getAttribute("max"));
            const newValue = event.target.value;
            const intVal = parseInt(newValue);
            if (intVal >= 0 && intVal <= max) {
                if (/hour/.test(event.target.name)) {
                    setHourValue(newValue);
                } else {
                    setMinuteValue(newValue);
                }
            }
        }
        catch(e) {
            // who cares... you're typing weird stuff.
        }
    }

    useEffect(() => {
        if (timeChanged) {
            timeChanged(hourValue + ":" + minuteValue)
        }
    }, [hourValue, minuteValue, timeChanged]);

    const keyStroke = (event) => {
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

            if (/hour/.test(event.target.name)) {
               setHourValue(padDigits(currentValue));
            }
            else {
               setMinuteValue(padDigits(currentValue));
            }
        }
        else {
            // allow for tab, backspace, delete and numbers.  if its not, cancel the event. 
            if (event.keyCode !== 9 && event.keyCode !== 8 && event.keyCode !== 127 && event.keyCode !== 37 && event.keyCode !== 39 && (event.keyCode < 48 || event.keyCode > 57)) {
                event.preventDefault();
                return false;
            }
        }
    }

    const padDigits = (digit) => {
        const parsed = parseInt(digit);
        if (parsed < 10) {
            return "0" + parsed;
        }
        else {
            return "" + parsed;
        }
    }

    return (
        <div className="time-container">
            <label>{props.label}</label>
            <div className="time-box-container">
                <input type="text" maxLength={2} pattern="\d\d" onKeyDown={keyStroke} onChange={handleInputChange} value={hourValue} step="1" max="23" name="hour"/>
                <div className="colon">:</div>
                <input type="text" maxLength={2} pattern="\d\d" onKeyDown={keyStroke} onChange={handleInputChange} value={minuteValue} step="1" max="59" name="minute"/>
            </div>
        </div>
    );
}
export default TimeEntryField;