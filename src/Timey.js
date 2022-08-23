import React from "react";
import TimeLog from './TimeLog.js';
import ToggleButton from './ToggleButton.js';
import ResetButton from './ResetButton.js';
import TimeField from "./TimeField.js";
import Fireworks from "@fireworks-js/react";
import timeCalcs from './functions/timeCalcs.js';
import "./Timey.scss";

class Timey extends React.Component {
    constructor(props) {
      super(props);
      document.title = "Time-o Record-o";
      this.state = {
        times: [],
        working: false,
        timeTarget : "08:00"
      }
    }
    render() {
        return (
          <div className="main-container">
            <div className="banner">Howdy!  record your time here and stuff</div>
            <div className="app-container">

              <div className="time-log-container">
                  <TimeLog times={this.state.times} offsetValue={this.state.offsetValue} deleteRow={(idx) => this.deleteEntry(idx)} />

                  <div className="button-container">
                    <ToggleButton working={this.state.working} onClick={() => this.toggleTime()}/>
                    <ResetButton onClick={() => this.resetTime()}/>
                  </div>
              </div>

              <div className="side-container">
                <TimeField timeChanged={(newVal) => this.offsetChanged(newVal)}  defaultValue={this.state.offsetValue} label="Already Worked:"/>
                <TimeField timeChanged={(newVal) => this.timeTargetChanged(newVal)}  defaultValue={this.state.timeTarget} label="Target Work Time:"/>
              </div>
            </div>
            {this.state.kaboom && (
              <Fireworks
                 options={{ opacity: 0.5}}
                 style={{
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  position: 'fixed',
                  background: 'rgba(255, 255, 255, 0)'
                 }}
               />
            )}
          </div>
        );
    }

    componentDidMount() {
      this.intervalID = setInterval(
        () => this.timeTickin(), 1000
      );
    }

    componentWillUnmount() {
      clearInterval(this.intervalID);
    }

    timeTickin() {
      const rightNow = new Date();
      const times = this.state.times.slice();
      if (times && times.length > 0) {
        const curIdx = times.length - 1;
        const currentTime = times[curIdx];
        if (!currentTime.endTime) {
          // have some updates to do.
          currentTime.duration = timeCalcs.calculateDuration(currentTime.startTime, currentTime.endTime);
          currentTime.cumulativeRaw = timeCalcs.calculateCumulative(curIdx, times, rightNow, this.state.offsetValue);
          currentTime.cumulativeFmt = timeCalcs.formattedDiff(currentTime.cumulativeRaw / 1000);
          this.checkIfDone(currentTime.cumulativeRaw);
        } 
      }

      this.setState({
        rightNow: rightNow,
        times : times
      });
    }

    toggleTime() {
      const newState =  {
        times : this.state.times.slice(),
        working : this.state.working
      }
      if (newState.working) {
        newState.times[newState.times.length - 1].endTime = new Date();
      }
      else {
        newState.times.push({startTime: new Date(), continuation : false});
        if (newState.times.length > 1) {
          const thisTime = newState.times[newState.times.length - 1];
          const lastTime = newState.times[newState.times.length - 2];

          if (thisTime.startTime.getTime() - lastTime.endTime.getTime() < (15 * 60 * 1000)) {
            lastTime.continuation = true;
          }
        }
      }
      newState.working = !newState.working;
      this.setState(newState);
    }

    resetTime() {
      this.setState({ times : [], working: false, kaboom : false});
    }

    deleteEntry(idx) {
      const newTimes = this.state.times.filter((val, i) => { return i !== idx; });
      this.setState ({times : newTimes });
    }

    offsetChanged(newOffset) {
      if (this.legitTime(newOffset)) {
         this.setState({offsetValue : newOffset})
      }
      else {
        this.setState({offsetValue : ""})
      }
    }

    timeTargetChanged(newTime) {
      if (this.legitTime(newTime)) {
         this.setState({timeTarget : newTime})
      }
      else {
        this.setState({timeTarget : ""})
      }
    }

    legitTime(str) {
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
    }

    checkIfDone(msElapsed) {
      if (this.state.timeTarget) {
        let times = this.state.timeTarget.split(":")
        let targetTime = (parseInt(times[0]) * 60 * 60 * 1000) + 
                         (parseInt(times[1]) * 60 * 1000);

        if (msElapsed > targetTime && !this.state.kaboom) {
          this.setState({kaboom : true});
        }
      }
    }
}
export default Timey;