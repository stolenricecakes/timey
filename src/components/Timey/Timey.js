import React from "react";
import TimeLog from '../TimeLog/TimeLog.js';
import ToggleButton from '../Buttons/ToggleButton.js';
import ResetButton from '../Buttons/ResetButton.js';
import Octobutton from '../Buttons/Octobutton.js';
import TimeEntryField from "../TimeFields/TimeEntryField.js";
import TimeDisplayField from "../TimeFields/TimeDisplayField.js";
import Fireworks from "@fireworks-js/react";
import {Octomonk} from "../../functions/Octomonk.js";
import * as timeCalcs from '../../functions/timeCalcs.js';
import * as logic from './logic.js';
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
        offsetRefresher : 0,
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
                <TimeEntryField key={this.state.offsetRefresher} timeChanged={(newVal) => this.offsetChanged(newVal)}  defaultValue={this.state.offsetValue} label="Already Worked:"/>
                <TimeEntryField timeChanged={(newVal) => this.timeTargetChanged(newVal)}  defaultValue={this.state.timeTarget} label="Target Work Time:"/>

                {(this.state.times.length > 0) && (
                  <div className="remaining-times-container">
                    <TimeDisplayField label="Time Remaining" time={timeCalcs.formattedDiff(this.state.timeRemaining / 1000)} />

                    <TimeDisplayField label="Estimated Completion Time" time={this.state.estCompletionTime} />

                      {this.state.overage && (
                          <TimeDisplayField label="Overage" time={timeCalcs.formattedDiff(this.state.overage / -1000)} />
                      )}
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
           this.octomonk.destroy();
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
      const rightNow = new Date();
      if (this.state.working) {
        const stateUpdates = logic.workingTimeTick(rightNow, this.state.timeRemaining, this.state.estCompletionTime, this.state.times, this.state.offsetValue, this.state.timeTarget, this.state.kaboom);
        if (stateUpdates.kaboom && !this.state.kaboom) {
            this.octomonk.fireworks();
        }
        this.setState(stateUpdates);
      }
      else if (!this.state.kaboom) {
        this.setState({
          rightNow : rightNow,
          estCompletionTime: logic.estCompletionTime(rightNow, this.state.timeRemaining)
        });
      }
      else {
          this.setState({rightNow : rightNow});
      }
    }

    toggleTime() {
      const newState = logic.toggleWorkingState(this.state.times.slice(), this.state.working, this.state.offsetValue, this.state.timeTarget);
      newState.working
          ? (newState.startedContinuation
             ? this.octomonk.fireworks()
             : this.octomonk.gameOn())
          : this.octomonk.gameOff();

      this.setState(newState);
    }

    resetTime() {
        if (this.state.overage) {
            const hhmmssOverageAry = timeCalcs.formattedDiff(this.state.overage / -1000).split(":");
            this.offsetChanged(hhmmssOverageAry[0] + ":" + hhmmssOverageAry[1]);
            this.setState({offsetRefresher: this.state.offsetRefresher + 1});
        }
      this.setState({ times : [], working: false, kaboom : false, estCompletionTime: "", overage: undefined});
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
}
export default Timey;
