

const formatTime = (date) => {
    if (date) {
        return padNumber(date.getHours()) + ":" + padNumber(date.getMinutes());
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


const subtractTimeStringsToMs = (timeString1, timeString2) => {
    const split1 = timeString1.split(":");
    const split2 = timeString2.split(":");

    const ts1Ms = (parseInt(split1[0]) * 60 * 60 * 1000) + 
                  (parseInt(split1[1]) * 60 * 1000);

    const ts2Ms = (parseInt(split2[0]) * 60 * 60 * 1000) + 
                  (parseInt(split2[1]) * 60 * 1000);

    return ts1Ms - ts2Ms;
};

export { formatTime, padNumber, formattedDiff, calculateHours, calculateMinutes, calculateSeconds, subtractTimeStringsToMs };