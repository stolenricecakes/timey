exports.deleteEntry = (times, idx) => {
    const newTimes = times.filter((val, i) => { return i !== idx; });
    if (idx > 0) {
      newTimes[idx - 1].continuation = false;
    }
    return newTimes;
};