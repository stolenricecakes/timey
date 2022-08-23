const tc = require('./timeCalcs.js');

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