const logic = require('./logic.js');
const tc = require("../../functions/timeCalcs");

describe("logic used for Timey component", () => {
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

    test('calculateDuration no args, empty string', () => {
        const str = logic.calculateDuration();
        expect(str).toEqual("");
    });
    test('calculateDuration startTime right now, 00:00:00 diff', () => {
        const rightNow = new Date();
        const str = logic.calculateDuration(rightNow);
        expect(str).toEqual("00:00:00");
    });

    test('calculateDuration startTime 2 minutes ago, 00:02:00 diff', () => {
        const rightNow = new Date();
        const twoMinutesAgo = new Date(rightNow.getTime() - (2 * 60 * 1000));
        const str = logic.calculateDuration(twoMinutesAgo);
        expect(str).toEqual("00:02:00");
    });

    test('calculateDuration startTime 2 hours, 4 minutes ago, 02:04:00 diff', () => {
        const rightNow = new Date();
        const twoHoursFourMinutesAgo = new Date(rightNow.getTime() - (4 * 60 * 1000) - (2 * 60 * 60 * 1000));
        const str = logic.calculateDuration(twoHoursFourMinutesAgo);
        expect(str).toEqual("02:04:00");
    });

    test('calculateDuration startTime, endTime 2 hours, 4 minutes ago, 02:04:00 diff', () => {
        const rightNow = new Date();
        const twoHoursFourMinutesAgo = new Date(rightNow.getTime() - (4 * 60 * 1000) - (2 * 60 * 60 * 1000));
        const str = logic.calculateDuration(twoHoursFourMinutesAgo, rightNow);
        expect(str).toEqual("02:04:00");
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
        const cuml = logic.calculateCumulative(0, times, rightNow);
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
        const cuml = logic.calculateCumulative(0, times);
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
        const cuml = logic.calculateCumulative(1, times, rightNow);
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
        const cuml1 = logic.calculateCumulative(0, times);
        expect(cuml1).toEqual(20000);
        expect(tc.formattedDiff(cuml1 / 1000)).toEqual("00:00:20");

        const cuml2 = logic.calculateCumulative(1, times);
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
        const cuml1 = logic.calculateCumulative(0, times);
        expect(cuml1).toEqual(20000);
        expect(tc.formattedDiff(cuml1 / 1000)).toEqual("00:00:20");

        const cuml2 = logic.calculateCumulative(1, times);
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

        const cuml1 = logic.calculateCumulative(0, times, null, offsetValue);
        expect(cuml1).toEqual(4220000);
        expect(tc.formattedDiff(cuml1 / 1000)).toEqual("01:10:20");

        const cuml2 = logic.calculateCumulative(1, times, null, offsetValue);
        expect(cuml2).toEqual(5220000);
        expect(tc.formattedDiff(cuml2 / 1000)).toEqual("01:27:00");
    });


    test('calculateRemainingTime nothing worked, no target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(0, "00:00");
        expect(remainingTimeMs).toEqual(0);
    });

    test('calculateRemainingTime bogus input, getError', () => {
        expect(() => {logic.calculateRemainingTime(123, "farts")}).toThrow(/bogus input./);
    });
    test('calculateRemainingTime hh:mm:ss input, getError', () => {
        expect(() => {logic.calculateRemainingTime(123, "11:22:33")}).toThrow(/bogus input./);
    });

    test('calculateRemainingTime nothing worked, 10 minute target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(0, "00:10");
        expect(remainingTimeMs).toEqual(600000);
        expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:10:00");
    });

    test('calculateRemainingTime 10 min worked, 10 minute target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(600000, "00:10");
        expect(remainingTimeMs).toEqual(0);
        expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:00:00");
    });

    test('calculateRemainingTime 20 min worked, 10 minute target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(1200000, "00:10");
        expect(remainingTimeMs).toEqual(-(1000 * 60 * 10));
    });
    test('calculateRemainingTime 1 hour worked, 30 minute target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(3600000, "00:30");
        expect(remainingTimeMs).toEqual((-1000 * 60 * 30));
    });

    test('calculateRemainingTime 1 hour worked, 1 hour target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(3600000, "01:00");
        expect(remainingTimeMs).toEqual(0);
        expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:00:00");
    });

    test('calculateRemainingTime 1 hour worked, 1 hour, 1 minute target', () => {
        const remainingTimeMs = logic.calculateRemainingTime(3600000, "01:01");
        expect(remainingTimeMs).toEqual(60000);
        expect(tc.formattedDiff(remainingTimeMs / 1000)).toEqual("00:01:00");
    });


    test('estCompletionTime null right Now, get 💩', () => {
        const str = logic.estCompletionTime();

        expect(str).toEqual('💩');
    });

    test('estCompletionTime null timeRemaining, get 💩', () => {
        const str = logic.estCompletionTime(new Date());

        expect(str).toEqual('💩');
    });

    test('estCompletionTime zero time remaining, get right now.', () => {
        const rightNow = new Date();
        const str = logic.estCompletionTime(rightNow, 0);

        expect(str).toEqual(rightNow.toLocaleTimeString());
    });

    test('estCompletionTime 20000 ms remaining, get correct time.', () => {
        const rightNow = new Date();
        const str = logic.estCompletionTime(rightNow, 20000);

        expect(str).toEqual(new Date(rightNow.getTime() + 20000).toLocaleTimeString());
    });
});
