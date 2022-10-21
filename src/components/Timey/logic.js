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

export { initialEstCompletion, deleteEntry}