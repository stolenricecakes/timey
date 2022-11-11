import React, {useState, useEffect, useCallback} from "react";
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

const octomonk = new Octomonk();

const Timey = (props) => {
    const [times, setTimes] = useState([]);
    const [working, setWorking] = useState(false);
    const [offsetValue, setOffsetValue] = useState("00:00");
    const [timeTarget, setTimeTarget] = useState("09:00");
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [estCompletionTime, setEstCompletionTime] = useState(0);
    const [offsetRefresher, setOffsetRefresher] = useState(0);
    const [messageIdx, setMessageIdx] = useState(Math.floor(Math.random() * 5.0));
    const [kaboom, setKaboom] = useState(false);
    const [rightNow, setRightNow] = useState(new Date());
    const [overage, setOverage] = useState();
    const [octoOn, setOctoOn] = useState(false);

    const octoToggle = () => {
       if (!octoOn) {
           octomonk.init();
           setOctoOn(true);
       }
       else {
           octomonk.destroy();
           setOctoOn(false);
       }
    }

    const timeTickin = useCallback(() => {
      if (working) {
        const stateUpdates = logic.workingTimeTick(rightNow, timeRemaining, estCompletionTime, times, offsetValue, timeTarget, kaboom);
        if (stateUpdates.kaboom && !kaboom) {
            octomonk.fireworks();
            setKaboom(true);
        }
        setTimeRemaining(stateUpdates.timeRemaining);
        setEstCompletionTime(stateUpdates.estCompletionTime);
        setTimes(stateUpdates.times);
        setOverage(stateUpdates.overage);
      }
      else if (!kaboom) {
        setEstCompletionTime(logic.estCompletionTime(rightNow, timeRemaining));
      }
    },[working, rightNow, timeRemaining, estCompletionTime, times, offsetValue, timeTarget, kaboom]);

    useEffect(() => {
       document.title = "Time-o Record-o";
       const interval = setInterval(() => {
           setRightNow(new Date())
       }, 1000);
       return () => clearInterval(interval);
    }, []);

    useEffect(() => {
       timeTickin();
    }, [rightNow, timeTickin])

   const toggleTime = () => {
      const newState = logic.toggleWorkingState(times.slice(), working, offsetValue, timeTarget);
      setMessageIdx(Math.floor(Math.random() * 5.0));
      newState.working
          ? (newState.startedContinuation
             ? octomonk.fireworks()
             : octomonk.gameOn())
          : octomonk.gameOff();

      setWorking(newState.working);
      setTimes(newState.times);
      if (newState.estCompletionTime) {
          setEstCompletionTime(newState.estCompletionTime);
      }
    }

    const resetTime = () => {
      if (overage) {
         const hhmmssOverageAry = timeCalcs.formattedDiff(overage / -1000).split(":");
         offsetChanged(hhmmssOverageAry[0] + ":" + hhmmssOverageAry[1]);
         setOffsetRefresher(offsetRefresher + 1);
      }
      setTimes([]);
      setWorking(false);
      setKaboom(false);
      setEstCompletionTime("");
      setOverage(undefined);
    }

    const deleteEntry = (idx) => {
      const newTimes = logic.deleteEntry(times.slice(), idx);
      setTimes(newTimes);
    }

    const offsetChanged = (newOffset) => {
      console.log("offset changed to: " + newOffset);
      if (legitTime(newOffset)) {
         setOffsetValue(newOffset);
      }
      else {
         setOffsetValue("");
      }
    }

    const timeTargetChanged = (newTime) => {
      console.log("time target changed to: " + newTime);
      if (legitTime(newTime)) {
         setTimeTarget(newTime);
      }
      else {
         setTimeTarget("");
      }
    }

    const legitTime = (str) => {
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
    }

    return (
        <div className="main-container">
            <div className="banner">Howdy!  record your time here and stuff</div>
            <div className="app-container">

                <div className="time-log-container">
                    <TimeLog times={times} offsetValue={offsetValue} deleteRow={(idx) => deleteEntry(idx)} />

                    <div className="button-container">
                        <ToggleButton working={working} onClick={() => toggleTime()} messageIdx={messageIdx}/>
                        <ResetButton onClick={() => resetTime()}/>
                    </div>
                    <Octobutton onClick={() => octoToggle()} currentState={octoOn ? "on" : "off"}/>
                </div>

                <div className="side-container">
                    <TimeEntryField key={offsetRefresher} timeChanged={(newVal) => offsetChanged(newVal)}  defaultValue={offsetValue} label="Already Worked:"/>
                    <TimeEntryField timeChanged={(newVal) => timeTargetChanged(newVal)}  defaultValue={timeTarget} label="Target Work Time:"/>

                    {(times.length > 0) && (
                        <div className="remaining-times-container">
                            <TimeDisplayField label="Time Remaining" time={timeCalcs.formattedDiff(timeRemaining / 1000)} />

                            <TimeDisplayField label="Estimated Completion Time" time={estCompletionTime} />

                            {overage && (
                                <TimeDisplayField label="Overage" time={timeCalcs.formattedDiff(overage / -1000)} />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="fireworks-container">
                {kaboom && (
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
export default Timey;
