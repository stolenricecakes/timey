const logic = require('./logic.js');

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


