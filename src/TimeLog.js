import React from "react";
import timeCalcs from "./functions/timeCalcs.js";

class TimeLog extends React.Component {
/*    constructor(props) {
        super(props);
        this.state = {
            times : props.times
        }
    }*/
    render() {
        if (this.props && this.props.times && this.props.times.length > 0) {
            return this.renderTable();
        }
        else {
            return this.noTimesMessage();
        }
    }

    noTimesMessage() {
        return (
            <div className="no-times">I aint got no times, bro.  start working!</div>
        )
    }

    renderTable() {
        return (
            <table cellPadding="0" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>Stop Time</th>
                        <th>Duration</th>
                        <th>Cumulative</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                 {
                    this.props.times.map((row, idx) =>
                        <tr key={idx} className={row.continuation ? 'continuation' : ''}>
                            <td>{timeCalcs.formatTime(row.startTime)}</td>
                            <td>{timeCalcs.formatTime(row.endTime)}</td>
                            <td>{row.duration}</td>
                            <td>{row.cumulativeFmt}</td>
                            <td><button className="delete-entry" onClick={() => this.props.deleteRow(idx)}>X</button></td>
                        </tr>
                    )
                 }   
                </tbody>
            </table>
        )
    }
}
export default TimeLog;