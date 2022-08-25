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

test('calculateDuration no args, empty string', () => {
    const str = tc.calculateDuration();
    expect(str).toEqual("");
});
test('calculateDuration startTime right now, 00:00:00 diff', () => {
    const rightNow = new Date();
    const str = tc.calculateDuration(rightNow);
    expect(str).toEqual("00:00:00");
});

test('calculateDuration startTime 2 minutes ago, 00:02:00 diff', () => {
    const rightNow = new Date();
    const twoMinutesAgo = new Date(rightNow.getTime() - (2 * 60 * 1000));
    const str = tc.calculateDuration(twoMinutesAgo);
    expect(str).toEqual("00:02:00");
});

test('calculateDuration startTime 2 hours, 4 minutes ago, 02:04:00 diff', () => {
    const rightNow = new Date();
    const twoHoursFourMinutesAgo = new Date(rightNow.getTime() - (4 * 60 * 1000) - (2 * 60 * 60 * 1000));
    const str = tc.calculateDuration(twoHoursFourMinutesAgo);
    expect(str).toEqual("02:04:00");
});

test('calculateDuration startTime, endTime 2 hours, 4 minutes ago, 02:04:00 diff', () => {
    const rightNow = new Date();
    const twoHoursFourMinutesAgo = new Date(rightNow.getTime() - (4 * 60 * 1000) - (2 * 60 * 60 * 1000));
    const str = tc.calculateDuration(twoHoursFourMinutesAgo, rightNow);
    expect(str).toEqual("02:04:00");
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

// new Date(1658696242133) ---  Sun Jul 24 2022 15:57:22 GMT-0500 (Central Daylight Time)
// new Date(1658696262133) ---  Sun Jul 24 2022 15:57:42 GMT-0500 (Central Daylight Time)
// new Date(1658696362133) ---  Sun Jul 24 2022 15:59:22 GMT-0500 (Central Daylight Time)
// new Date(1658697362133) ---  Sun Jul 24 2022 16:16:02 GMT-0500 (Central Daylight Time)

test('calculateCumulative 1 row in progress', () => {
    let rightNow = new Date(1658696262133);
    let times = [
        {
             startTime : new Date(1658696242133) 
        }
    ]
    const cuml = tc.calculateCumulative(0, times, rightNow);
    expect(cuml).toEqual(20000);
    expect(tc.formattedDiff(cuml / 1000)).toEqual("00:00:20");
});

test('calculateCumulative 1 row completed', () => {
    tc.state = {};
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133)
        }
    ]
    const cuml = tc.calculateCumulative(0, times);
    expect(cuml).toEqual(20000);
    expect(tc.formattedDiff(cuml / 1000)).toEqual("00:00:20");
});

test('calculateCumulative 1st continuation, 2nd is in progress', () => {
    let rightNow = new Date(1658697362133);
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133),
          continuation : true
        },
        { startTime : new Date(1658696362133) }
    ]
    // this difference: 1120000
    // == 1120 secs. 
    //expect(tl.calculateCumulative(0, times)).toEqual("00:00:20");
    const cuml = tc.calculateCumulative(1, times, rightNow);
    expect(cuml).toEqual(1120000);
    expect(tc.formattedDiff(cuml / 1000)).toEqual("00:18:40");
});

test('calculateCumulative 1st continuation, 2nd completed', () => {
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133),
          continuation : true
        },
        { startTime : new Date(1658696362133), 
           endTime : new Date(1658697362133)
        }
    ]
    // this difference: 1120000
    // == 1120 secs. 
    const cuml1 = tc.calculateCumulative(0, times);
    expect(cuml1).toEqual(20000);
    expect(tc.formattedDiff(cuml1 / 1000)).toEqual("00:00:20");

    const cuml2 = tc.calculateCumulative(1, times);
    expect(cuml2).toEqual(1120000);
    expect(tc.formattedDiff(cuml2 / 1000)).toEqual("00:18:40");
});

test('calculateCumulative 1st complete (not continuation), 2nd completed', () => {
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133),
          continuation : false 
        },
        { startTime : new Date(1658696362133), 
           endTime : new Date(1658697362133)
        }
    ]
    // this difference: 1120000
    // == 1120 secs. 
    const cuml1 = tc.calculateCumulative(0, times);
    expect(cuml1).toEqual(20000);
    expect(tc.formattedDiff(cuml1 / 1000)).toEqual("00:00:20");

    const cuml2 = tc.calculateCumulative(1, times);
    expect(cuml2).toEqual(1020000);
    expect(tc.formattedDiff(cuml2 / 1000)).toEqual("00:17:00");
});

test('calculateCumulative with an offset 1st complete (not continuation), 2nd completed', () => {
    let offsetValue  = "01:10";
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133),
          continuation : false 
        },
        { startTime : new Date(1658696362133), 
           endTime : new Date(1658697362133)
        }
    ]

    const cuml1 = tc.calculateCumulative(0, times, null, offsetValue);
    expect(cuml1).toEqual(4220000);
    expect(tc.formattedDiff(cuml1 / 1000)).toEqual("01:10:20");

    const cuml2 = tc.calculateCumulative(1, times, null, offsetValue);
    expect(cuml2).toEqual(5220000);
    expect(tc.formattedDiff(cuml2 / 1000)).toEqual("01:27:00");
});

test('calculateRemainingTime nothing worked, no target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(0, "00:00");
    expect(remainingTimeMs).toEqual(0);
});

test('calculateRemainingTime bogus input, getError', () => {
    expect(() => {tc.calculateRemainingTime(123, "farts")}).toThrow(/bogus input./);
});
test('calculateRemainingTime hh:mm:ss input, getError', () => {
    expect(() => {tc.calculateRemainingTime(123, "11:22:33")}).toThrow(/bogus input./);
});

test('calculateRemainingTime nothing worked, 10 minute target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(0, "00:10");
    expect(remainingTimeMs).toEqual(600000);
    expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:10:00");
});

test('calculateRemainingTime 10 min worked, 10 minute target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(600000, "00:10");
    expect(remainingTimeMs).toEqual(0);
    expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:00:00");
});

test('calculateRemainingTime 20 min worked, 10 minute target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(1200000, "00:10");
    expect(remainingTimeMs).toEqual(0);
    expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:00:00");
});
test('calculateRemainingTime 1 hour worked, 30 minute target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(3600000, "00:30");
    expect(remainingTimeMs).toEqual(0);
    expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:00:00");
});

test('calculateRemainingTime 1 hour worked, 1 hour target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(3600000, "01:00");
    expect(remainingTimeMs).toEqual(0);
    expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:00:00");
});

test('calculateRemainingTime 1 hour worked, 1 hour, 1 minute target', () => {
    const remainingTimeMs = tc.calculateRemainingTime(3600000, "01:01");
    expect(remainingTimeMs).toEqual(60000);
    expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:01:00");
});

test('initialEstCompletion empty offset default time target', () => {
    const str = tc.initialEstCompletion(null, "08:00");
    const nowish = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));

    expect(str).toEqual(nowish.toLocaleTimeString());
});

test('initialEstCompletion zero offset default time target', () => {
    const str = tc.initialEstCompletion("00:00", "08:00");
    const nowish = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));

    expect(str).toEqual(nowish.toLocaleTimeString());
});

test('initialEstCompletion 2 hour offset default time target', () => {
    const str = tc.initialEstCompletion("02:00", "08:00");
    const nowish = new Date(new Date().getTime() + (6 * 60 * 60 * 1000));

    expect(str).toEqual(nowish.toLocaleTimeString());
});


test('estCompletionTime null right Now, get 💩', () => {
    const str = tc.estCompletionTime();

    expect(str).toEqual('💩');
});

test('estCompletionTime null timeRemaining, get 💩', () => {
    const str = tc.estCompletionTime(new Date());

    expect(str).toEqual('💩');
});

test('estCompletionTime zero time remaining, get right now.', () => {
    const rightNow = new Date();
    const str = tc.estCompletionTime(rightNow, 0);

    expect(str).toEqual(rightNow.toLocaleTimeString());
});

test('estCompletionTime 20000 ms remaining, get correct time.', () => {
    const rightNow = new Date();
    const str = tc.estCompletionTime(rightNow, 20000);

    expect(str).toEqual(new Date(rightNow.getTime() + 20000).toLocaleTimeString());
});

