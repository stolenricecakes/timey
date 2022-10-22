const tc = require('./timeCalcs.js');

test('formatTime no args, empty string returned', () => {
    const str = tc.formatTime();
    expect(str).toEqual("");
});

test('formatTime formats hours and minutes', () => {
    const someDate = new Date(1661433525655);
    const dateStr = tc.formatTime(someDate);
    expect(dateStr).toEqual("08:18");
});

test('hours calculated correctly', () => {

    expect(tc.calculateHours(10)).toEqual(0);
    expect(tc.calculateHours(100)).toEqual(0);
    expect(tc.calculateHours(1000)).toEqual(0);
    expect(tc.calculateHours(10000)).toEqual(2);
});

test('10 seconds minutes calculated correctly', () => {
    expect(tc.calculateHours(10)).toEqual(0);
    expect(tc.calculateMinutes(10)).toEqual(0);
    expect(tc.calculateSeconds(10)).toEqual(10);
});

test('60 seconds is one minute', () => {
    expect(tc.calculateHours(60)).toEqual(0);
    expect(tc.calculateMinutes(60)).toEqual(1);
    expect(tc.calculateSeconds(60)).toEqual(0);
});


test('3660 seconds is one hour, one minute', () => {
    expect(tc.calculateHours(3660)).toEqual(1);
    expect(tc.calculateMinutes(3660)).toEqual(1);
    expect(tc.calculateSeconds(3660)).toEqual(0);
});

test('40 seconds is 40 seconds.', () => {
    expect(tc.calculateHours(40)).toEqual(0);
    expect(tc.calculateMinutes(40)).toEqual(0);
    expect(tc.calculateSeconds(40)).toEqual(40);
});



