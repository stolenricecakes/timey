const logic = require('./logic.js');
const tc = require("../../functions/timeCalcs");

test('deleteEntry only one entry, no probs.', () => {
    const times = logic.deleteEntry([{startTime: new Date()}], 0);
    expect(times.length).toEqual(0);
});

test('deleteEntry multiple entries, delete last, no probs.', () => {
    const beforeTimes = [
        {startTime: new Date(), endTime: new Date(), continuation: true},
        {startTime: new Date(), endTime: new Date(), continuation: true},
        {startTime: new Date(), endTime: new Date(), continuation: true}
    ];
    const times = logic.deleteEntry(beforeTimes, 2);
    expect(times.length).toEqual(2);
    expect(times[0].continuation).toEqual(true);
    expect(times[1].continuation).toEqual(false);
});


test('initialEstCompletion empty offset default time target', () => {
    const str = logic.initialEstCompletion(null, "08:00");
    const nowish = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));

    expect(str).toEqual(nowish.toLocaleTimeString());
});

test('initialEstCompletion zero offset default time target', () => {
    const str = logic.initialEstCompletion("00:00", "08:00");
    const nowish = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));

    expect(str).toEqual(nowish.toLocaleTimeString());
});

test('initialEstCompletion 2 hour offset default time target', () => {
    const str = logic.initialEstCompletion("02:00", "08:00");
    const nowish = new Date(new Date().getTime() + (6 * 60 * 60 * 1000));

    expect(str).toEqual(nowish.toLocaleTimeString());
});


