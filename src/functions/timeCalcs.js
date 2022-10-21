

const formatTime = (date) => {
    if (date) {
        return padNumber(date.getHours()) + ":" + padNumber(date.getMinutes());
    }
    else {
        return "";
    }
};

const calculateDuration = (start, end) => {
    if (start && end) {
        const startTime = start.getTime();
        let endTime = end.getTime();
        let diff = endTime - startTime;
        let diffSecs = diff / 1000;

        return formattedDiff(diffSecs);
    }
    else if (start) {
        const startTime = start.getTime();
        const endTime = new Date().getTime();
        const diff = (endTime - startTime) / 1000;

        return formattedDiff(diff);
    }
    else {
        return "";
    }
};


const formattedDiff = (diff) => {
    const hours = padNumber(calculateHours(diff));
    const mins = padNumber(calculateMinutes(diff));
    const secs = padNumber(calculateSeconds(diff));

    return hours + ":" + mins + ":" + secs;
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


const padNumber = (num) => {
    if (num < 10) {
        return "0" + num;
    }
    else {
        return num;
    }
};

const calculateHours = (diff) => {
    return parseInt(diff / (60 * 60));
};

const calculateMinutes = (diff) => {
    const hours = calculateHours(diff);
    return parseInt((diff - (hours * 60 * 60)) / 60); 
};

const calculateSeconds = (diff) => {
    const hours = calculateHours(diff);
    const mins = calculateMinutes(diff);
    return parseInt(diff - ((hours * 60 * 60) + (mins * 60))); 
};

const calculateRemainingTime = (timeWorkedMs, targetTime) => {
    const splitTime = targetTime.split(":");
    if (!splitTime || splitTime.length !== 2) {
        throw new Error("bogus input.  expecting hh:mm");
    }

    const hoursInMs = parseInt(splitTime[0]) * 60 * 60 * 1000;
    const minsInMs = parseInt(splitTime[1]) * 60 * 1000;
    const targetMs = hoursInMs + minsInMs;

    return Math.max(targetMs - timeWorkedMs, 0);
};

const subtractTimeStringsToMs = (timeString1, timeString2) => {
    const split1 = timeString1.split(":");
    const split2 = timeString2.split(":");

    const ts1Ms = (parseInt(split1[0]) * 60 * 60 * 1000) + 
                  (parseInt(split1[1]) * 60 * 1000);

    const ts2Ms = (parseInt(split2[0]) * 60 * 60 * 1000) + 
                  (parseInt(split2[1]) * 60 * 1000);

    return ts1Ms - ts2Ms;
};

const estCompletionTime = (rightNow, timeRemainingMs) => {
    if (rightNow && /\d+/.test(timeRemainingMs) ) {
        return new Date(rightNow.getTime() + timeRemainingMs).toLocaleTimeString();
    }
    else {
        return "💩";
    }
};

export { formatTime, calculateDuration, padNumber, formattedDiff, calculateCumulative, calculateHours, calculateMinutes, calculateSeconds, calculateRemainingTime, subtractTimeStringsToMs, estCompletionTime };