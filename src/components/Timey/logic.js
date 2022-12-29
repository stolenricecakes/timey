import * as timeCalcs from "../../functions/timeCalcs";

const {subtractTimeStringsToMs} = require("../../functions/timeCalcs");
const deleteEntry = (times, idx) => {
    const newTimes = times.filter((val, i) => { return i !== idx; });
    if (idx > 0) {
      newTimes[idx - 1].continuation = false;
    }
    return newTimes;
};

const initialEstCompletion = (offsetValue, timeTarget)  => {
    const offsetStr = (offsetValue) ? offsetValue : "00:00";
    const msTimeLeft = subtractTimeStringsToMs(timeTarget, offsetStr);

    return new Date(new Date().getTime() + msTimeLeft).toLocaleTimeString();
};

const workingTimeTick = (rightNow, timeRemaining, estCompTime, times, offsetValue, timeTarget, kaboom) => {
    let doneState = {};
    let overage = {};
    if (times && times.length > 0) {
        const curIdx = times.length - 1;
        const currentTime = times[curIdx];
        if (!currentTime.endTime) {
            // have some updates to do.
            currentTime.duration = calculateDuration(currentTime.startTime, currentTime.endTime);
            currentTime.cumulativeRaw = calculateCumulative(curIdx, times, rightNow, offsetValue);
            currentTime.cumulativeFmt = timeCalcs.formattedDiff(currentTime.cumulativeRaw / 1000);
            doneState = checkIfDone(currentTime.cumulativeRaw, timeTarget, kaboom);
        }

        if (currentTime.cumulativeRaw) {
            const timeDifference = calculateRemainingTime(currentTime.cumulativeRaw, timeTarget);
            if (timeDifference >= 0) {
                timeRemaining = timeDifference;
                estCompTime = estCompletionTime(rightNow, timeRemaining);
            }
            else {
                timeRemaining = 0;
                overage = { overage : timeDifference };
            }
        }
    }

    return {
        ...doneState,
        ...overage,
        timeRemaining : timeRemaining,
        estCompletionTime : estCompTime,
        times : times
    };
};

const toggleWorkingState = (times, working, offsetValue, timeTarget ) => {
    const newState = {
        times : times,
        working : working,
        startedContinuation : false
    }
    if (newState.times.length === 0) {
        newState.estCompletionTime = initialEstCompletion(offsetValue, timeTarget);
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
                newState.startedContinuation = true;
            }
        }
    }
    newState.working = !newState.working;
    return newState;
};

const calculateDuration = (start, end) => {
    if (start && end) {
        const startTime = start.getTime();
        let endTime = end.getTime();
        let diff = endTime - startTime;
        let diffSecs = diff / 1000;

        return timeCalcs.formattedDiff(diffSecs);
    }
    else if (start) {
        const startTime = start.getTime();
        const endTime = new Date().getTime();
        const diff = (endTime - startTime) / 1000;

        return timeCalcs.formattedDiff(diff);
    }
    else {
        return "";
    }
};

const checkIfDone = (msElapsed, timeTarget, kaboom) => {
    if (timeTarget) {
        let times = timeTarget.split(":")
        let targetTime = (parseInt(times[0]) * 60 * 60 * 1000) +
            (parseInt(times[1]) * 60 * 1000);

        if (msElapsed > targetTime && !kaboom) {
            return { kaboom : true };
        }
    }
    return {};
};

const calculateCumulative = (idx, times, rightNow, offsetValue) => {
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
        else if (rightNow && !thisTime.continuation) {
            time += (rightNow.getTime() - startTime.getTime());
        }
    }

    if (offsetValue) {
        const offsetSplit = offsetValue.split(":");
        time += parseInt(offsetSplit[0]) * 1000 * 60 * 60;
        time += parseInt(offsetSplit[1]) * 1000 * 60;
    }

    return time;
};

const calculateRemainingTime = (timeWorkedMs, targetTime) => {
    const splitTime = targetTime.split(":");
    if (!splitTime || splitTime.length !== 2) {
        throw new Error("bogus input.  expecting hh:mm");
    }

    const hoursInMs = parseInt(splitTime[0]) * 60 * 60 * 1000;
    const minsInMs = parseInt(splitTime[1]) * 60 * 1000;
    const targetMs = hoursInMs + minsInMs;

    return targetMs - timeWorkedMs;
};

const estCompletionTime = (rightNow, timeRemainingMs) => {
    if (rightNow && /\d+/.test(timeRemainingMs) ) {
        return new Date(rightNow.getTime() + timeRemainingMs).toLocaleTimeString();
    }
    else {
        return "💩";
    }
};

// assumed this will only be called when not working.
const inDangerZone = (times, rightNow) => {
   if (times && times.length > 0) {
      const lastTime = times[times.length - 1];
      const fifteenMinutesMs = 15 * 60 * 1000;
      const fourteenMinutesMs = 14 * 60 * 1000;
      const diff = rightNow.getTime() - lastTime.endTime.getTime();
      return diff >= fourteenMinutesMs && diff < fifteenMinutesMs;
   }
   else {
       return false;
   }
};

export { initialEstCompletion, deleteEntry, workingTimeTick, toggleWorkingState,  calculateDuration, calculateCumulative, calculateRemainingTime, estCompletionTime, inDangerZone};