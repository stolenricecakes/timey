import React from "react";

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

    componentDidMount() {
        this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        this.setState({
          rightNow: new Date()
        });
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
                            <td>{this.formatTime(row.startTime)}</td>
                            <td>{this.formatTime(row.endTime)}</td>
                            <td>{this.calculateDuration(row.startTime, row.endTime)}</td>
                            <td>{this.calculateCumulative(idx, this.props.times)}</td>
                            <td><button className="delete-entry" onClick={() => this.props.deleteRow(idx)}>X</button></td>
                        </tr>
                    )
                 }   
                </tbody>
            </table>
        )
    }

    formatTime(date) {
        if (date) {
            return this.padNumber(date.getHours()) + ":" + this.padNumber(date.getMinutes());
        }
        else {
            return "";
        }
    }

    calculateDuration(start, end) {
        if (start && end) {
            const startTime = start.getTime();
            let endTime = end.getTime();
            let diff = endTime - startTime;
            let diffSecs = diff / 1000;

            return this.formattedDiff(diffSecs);
        }
        else if (start) {
            const startTime = start.getTime();
            const endTime = new Date().getTime();
            const diff = (endTime - startTime) / 1000;

            return this.formattedDiff(diff);
        }
        else {
            return "";
        }
    }

    formattedDiff(diff) {
        const hours = this.padNumber(this.calculateHours(diff));
        const mins = this.padNumber(this.calculateMinutes(diff));
        const secs = this.padNumber(this.calculateSeconds(diff));

        return hours + ":" + mins + ":" + secs;
    }

    calculateCumulative(idx, times) {
        let time = 0;
        let startTime = null;
        for (let i = 0; i < times.length && i <= idx; i++) {
            const thisTime = times[i];
            if (startTime == null) {
               startTime = thisTime.startTime;
            }
            if ((!thisTime.continuation || i === idx) && thisTime.endTime) {
                time += (thisTime.endTime.getTime() - startTime.getTime());
                if (!thisTime.continuation) {
                   startTime = null;
                }
            }
            else if (this.state.rightNow && !thisTime.continuation) {
                time += (this.state.rightNow.getTime() - startTime.getTime()); 
            }
        }

        if (this.props.offsetValue) {
            const offsetSplit = this.props.offsetValue.split(":");
            time += parseInt(offsetSplit[0]) * 1000 * 60 * 60;
            time += parseInt(offsetSplit[1]) * 1000 * 60;
        }

        this.props.checkIfDone(time);

        return this.formattedDiff(time / 1000);
    }

    padNumber(num) {
        if (num < 10) {
            return "0" + num;
        }
        else {
            return num;
        }
    }

    calculateHours(diff) {
        return parseInt(diff / (60 * 60));
    }

    calculateMinutes(diff) {
        const hours = this.calculateHours(diff);
        return parseInt((diff - (hours * 60 * 60)) / 60); 
    }

    calculateSeconds(diff) {
        const hours = this.calculateHours(diff);
        const mins = this.calculateMinutes(diff);
        return parseInt(diff - ((hours * 60 * 60) + (mins * 60))); 

    }
}
export default TimeLog;