

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