import React, {useState, useEffect, useCallback, useContext} from "react";
import {DarkModeContext} from "../DarkModeContext";
import TimeLog from '../TimeLog/TimeLog.js';
import ToggleButton from '../Buttons/ToggleButton.js';
import ResetButton from '../Buttons/ResetButton.js';
import Octobutton from '../Buttons/Octobutton.js';
import Lightswitch from '../Buttons/Lightswitch.js';
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
    const [dangerZone, setDangerZone] = useState(false);
    const [exceededDanger, setExceededDanger] = useState(false);
    const { darkMode } = useContext(DarkModeContext);

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
        setDangerZone(false);
        setExceededDanger(false);
      }
      else if (!kaboom) {
        setEstCompletionTime(logic.estCompletionTime(rightNow, timeRemaining));
        const dangerRightNow = logic.inDangerZone(times, rightNow);
        if (dangerRightNow && !dangerZone) {
            setDangerZone(true);
        }
        else if (!dangerRightNow) {
            setDangerZone(false);
        }
        if (logic.exceededDangerZone(times, rightNow)) {
            setExceededDanger(true);
        }
      }
    },[working, rightNow, timeRemaining, estCompletionTime, times, offsetValue, timeTarget, kaboom, dangerZone]);

    useEffect(() => {
       document.title = "Time-o Record-o";
       const interval = setInterval(() => {
           setRightNow(new Date())
       }, 1000);
       return () => clearInterval(interval);
    }, []);

    const dateTimeinator = (key, value) => {
       const datey =  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
       if (typeof value === 'string' && datey.test(value)) {
          return new Date(value);
       }
       else {
        return value;
       }
    }

    useEffect(() => {
       const lsTimes = localStorage.getItem("times");
       if (lsTimes) {
        setTimes(JSON.parse(lsTimes, dateTimeinator));
       }
       const lsWorking = localStorage.getItem("working");
       if (lsWorking) {
        setWorking(JSON.parse(lsWorking));
       }
       const lsOffset = localStorage.getItem("offset");
       if (lsOffset) {
         setOffsetValue(JSON.parse(lsOffset));
         setOffsetRefresher(of => of + 1);
       }
    }, []);

    useEffect(() => {
       timeTickin();
    }, [rightNow, timeTickin])

    useEffect(() => {
        if (dangerZone) {
            octomonk.danger();
        }
        else {
            octomonk.noDanger();
        }
    }, [dangerZone]);

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
      saveLs("working", newState.working)
      saveLs("times", newState.times)
      if (newState.estCompletionTime) {
          setEstCompletionTime(newState.estCompletionTime);
      }
    }

    const saveLs = (key, val) => {
        localStorage.setItem(key, JSON.stringify(val));
    }

    const resetTime = () => {

      const hhmmssOverageAry = overage ? timeCalcs.formattedDiff(overage / -1).split(":") : ["00", "00"];
      const offsetStr = `${hhmmssOverageAry[0]}:${hhmmssOverageAry[1]}`;
      offsetChanged(offsetStr);
      setOffsetRefresher(offsetRefresher + 1);
      saveLs("offset", offsetStr);

      setTimes([]);
      saveLs("times", []);
      saveLs("working", false);
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
      if (legitTime(newOffset)) {
         setOffsetValue(newOffset);
      }
      else {
         setOffsetValue("");
      }
    }

    const timeTargetChanged = (newTime) => {
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

    const testOcto = () => {
       octomonk.micCheck();
    }

    const getClassName = () => {
        let className = 'main-container';
        if (dangerZone) {
            className += " alert";
        }
        if (exceededDanger) {
            className +=  " danger-ignored";
        }
        if (darkMode) {
            className += " dark-mode";
        }
        return className;
    }

    return (
        <div className={getClassName()}>
            <div className="top-container">
                <div className="banner">Howdy!  record your time here and stuff:</div>
                <div className="time">{rightNow.toLocaleString()}</div>
            </div>
            <div className="app-container">

                <div className="time-log-container">
                    <TimeLog times={times} offsetValue={offsetValue} deleteRow={(idx) => deleteEntry(idx)} />

                    <div className="button-container">
                        <ToggleButton working={working} onClick={() => toggleTime()} messageIdx={messageIdx}/>
                        <ResetButton onClick={() => resetTime()}/>
                    </div>
                    <Octobutton onClick={() => octoToggle()} currentState={octoOn ? "on" : "off"}/>
                    <button className="check-check" onClick={testOcto}>check check</button>
                    <Lightswitch/>
                </div>

                <div className="side-container">
                    <TimeEntryField key={offsetRefresher} timeChanged={(newVal) => offsetChanged(newVal)}  defaultValue={offsetValue} label="Already Worked:"/>
                    <TimeEntryField timeChanged={(newVal) => timeTargetChanged(newVal)}  defaultValue={timeTarget} label="Target Work Time:"/>

                    {(times.length > 0) && (
                        <div className="remaining-times-container">
                            <TimeDisplayField label="Time Remaining" time={timeCalcs.formattedDiff(timeRemaining)} />

                            <TimeDisplayField label="Estimated Completion Time" time={estCompletionTime} />

                            {overage && (
                                <TimeDisplayField label="Overage" time={timeCalcs.formattedDiff(overage / -1)} />
                            )}
                        </div>
                    )}
                    {exceededDanger && (
                        <div className="danger-exceeded">FARTS! you took too long.</div>
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
