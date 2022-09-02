

exports.formatTime = (date) => {
    if (date) {
        return this.padNumber(date.getHours()) + ":" + this.padNumber(date.getMinutes());
    }
    else {
        return "";
    }
};

exports.calculateDuration = (start, end) => {
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
};


exports.formattedDiff = (diff) => {
    const hours = this.padNumber(this.calculateHours(diff));
    const mins = this.padNumber(this.calculateMinutes(diff));
    const secs = this.padNumber(this.calculateSeconds(diff));

    return hours + ":" + mins + ":" + secs;
};

exports.calculateCumulative = (idx, times, rightNow, offsetValue) => {
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


exports.padNumber = (num) => {
    if (num < 10) {
        return "0" + num;
    }
    else {
        return num;
    }
};

exports.calculateHours = (diff) => {
    return parseInt(diff / (60 * 60));
};

exports.calculateMinutes = (diff) => {
    const hours = this.calculateHours(diff);
    return parseInt((diff - (hours * 60 * 60)) / 60); 
};

exports.calculateSeconds = (diff) => {
    const hours = this.calculateHours(diff);
    const mins = this.calculateMinutes(diff);
    return parseInt(diff - ((hours * 60 * 60) + (mins * 60))); 
};

exports.calculateRemainingTime = (timeWorkedMs, targetTime) => {
    const splitTime = targetTime.split(":");
    if (!splitTime || splitTime.length !== 2) {
        throw new Error("bogus input.  expecting hh:mm");
    }

    const hoursInMs = parseInt(splitTime[0]) * 60 * 60 * 1000;
    const minsInMs = parseInt(splitTime[1]) * 60 * 1000;
    const targetMs = hoursInMs + minsInMs;

    return Math.max(targetMs - timeWorkedMs, 0);
};

exports.subtractTimeStringsToMs = (timeString1, timeString2) => {
    const split1 = timeString1.split(":");
    const split2 = timeString2.split(":");

    const ts1Ms = (parseInt(split1[0]) * 60 * 60 * 1000) + 
                  (parseInt(split1[1]) * 60 * 1000);

    const ts2Ms = (parseInt(split2[0]) * 60 * 60 * 1000) + 
                  (parseInt(split2[1]) * 60 * 1000);

    return ts1Ms - ts2Ms;
};

exports.initialEstCompletion = (offsetValue, timeTarget)  => {
   const offsetStr = (offsetValue) ? offsetValue : "00:00";
   const msTimeLeft = this.subtractTimeStringsToMs(timeTarget, offsetStr);
    
   return new Date(new Date().getTime() + msTimeLeft).toLocaleTimeString();
};

exports.estCompletionTime = (rightNow, timeRemainingMs) => {
    if (rightNow && /\d+/.test(timeRemainingMs) ) {
        return new Date(rightNow.getTime() + timeRemainingMs).toLocaleTimeString();
    }
    else {
        return "💩";
    }
};
