import React from "react";
import TimeLog from '../TimeLog/TimeLog.js';
import ToggleButton from '../Buttons/ToggleButton.js';
import ResetButton from '../Buttons/ResetButton.js';
import Octobutton from '../Buttons/Octobutton.js';
import TimeEntryField from "../TimeFields/TimeEntryField.js";
import TimeDisplayField from "../TimeFields/TimeDisplayField.js";
import Fireworks from "@fireworks-js/react";
import {Octomonk} from "../../functions/Octomonk.js";
import timeCalcs from '../../functions/timeCalcs.js';
import logic from './logic.js';
import "../../Timey.scss";

class Timey extends React.Component {
    constructor(props) {
      super(props);
      document.title = "Time-o Record-o";
      this.octomonk = new Octomonk();
      this.state = {
        times: [],
        working: false,
        offsetValue : "00:00",
        timeTarget : "09:00",
        timeRemaining : 0,
        estCompletionTime : 0,
        octoOn : false
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
                  <Octobutton onClick={() => this.octoToggle()} currentState={this.state.octoOn ? "on" : "off"}/>
              </div>

              <div className="side-container">
                <TimeEntryField timeChanged={(newVal) => this.offsetChanged(newVal)}  defaultValue={this.state.offsetValue} label="Already Worked:"/>
                <TimeEntryField timeChanged={(newVal) => this.timeTargetChanged(newVal)}  defaultValue={this.state.timeTarget} label="Target Work Time:"/>

                {(this.state.times.length > 0) && (
                  <div className="remaining-times-container">
                    <TimeDisplayField label="Time Remaining" time={timeCalcs.formattedDiff(this.state.timeRemaining / 1000)} />

                    <TimeDisplayField label="Estimated Completion Time" time={this.state.estCompletionTime} />
                  </div>
                )}
              </div>
            </div>
            <div className="fireworks-container">
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
          </div>
        );
    }

    octoToggle() {
       let octomonkOn = this.state.octoOn
       if (!octomonkOn) {
           this.octomonk.init();
           this.setState({octoOn: true});
       }
       else {
           this.setState({octoOn: false});
       }
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
      // if you're not working, the tick doesn't really matter.
      if (this.state.kaboom) {
        return;
      }
      const rightNow = new Date();
      if (this.state.working) {
        let timeRemaining = this.state.timeRemaining;
        let estCompletionTime = this.state.estCompletionTime;
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

          if (currentTime.cumulativeRaw) {
            timeRemaining = timeCalcs.calculateRemainingTime(currentTime.cumulativeRaw, this.state.timeTarget);
            estCompletionTime = timeCalcs.estCompletionTime(rightNow, timeRemaining);
          }
        }

        this.setState({
          rightNow: rightNow,
          timeRemaining : timeRemaining,
          estCompletionTime : estCompletionTime,
          times : times
        });
      }
      else {
        this.setState({
          rightNow : rightNow,
          estCompletionTime: timeCalcs.estCompletionTime(rightNow, this.state.timeRemaining) 
        });
      }
    }

    toggleTime() {
      const newState =  {
        times : this.state.times.slice(),
        working : this.state.working
      }
      if (newState.times.length === 0) {
        newState.estCompletionTime = timeCalcs.initialEstCompletion(this.state.offsetValue, this.state.timeTarget);
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
      newState.working ? this.octomonk.gameOn() : this.octomonk.gameOff();
      this.setState(newState);
    }

    resetTime() {
      this.setState({ times : [], working: false, kaboom : false, estCompletionTime: ""});
    }

    deleteEntry(idx) {
      const newTimes = logic.deleteEntry(this.state.times.slice(), idx);
      this.setState ({times : newTimes });
    }

    offsetChanged(newOffset) {
      console.log("offset changed to: " + newOffset);
      if (this.legitTime(newOffset)) {
         this.setState({offsetValue : newOffset});
      }
      else {
        this.setState({offsetValue : ""})
      }
    }

    timeTargetChanged(newTime) {
      console.log("time target changed to: " + newTime);
      if (this.legitTime(newTime)) {
         this.setState({timeTarget : newTime});
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
          this.octomonk.fireworks();
        }
      }
    }
}
export default Timey;
