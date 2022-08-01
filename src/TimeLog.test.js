//import { render, screen } from '@testing-library/react';
import TimeLog from "./TimeLog.js";

/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

test('hours calculated correctly', () => {
    let tl = new TimeLog({});

    expect(tl.calculateHours(10)).toEqual(0);
    expect(tl.calculateHours(100)).toEqual(0);
    expect(tl.calculateHours(1000)).toEqual(0);
    expect(tl.calculateHours(10000)).toEqual(2);
});

test('10 seconds minutes calculated correctly', () => {
    let tl = new TimeLog({});
    expect(tl.calculateHours(10)).toEqual(0);
    expect(tl.calculateMinutes(10)).toEqual(0);
    expect(tl.calculateSeconds(10)).toEqual(10);
});

test('60 seconds is one minute', () => {
    let tl = new TimeLog({});
    expect(tl.calculateHours(60)).toEqual(0);
    expect(tl.calculateMinutes(60)).toEqual(1);
    expect(tl.calculateSeconds(60)).toEqual(0);
});


test('3660 seconds is one hour, one minute', () => {
    let tl = new TimeLog({});
    expect(tl.calculateHours(3660)).toEqual(1);
    expect(tl.calculateMinutes(3660)).toEqual(1);
    expect(tl.calculateSeconds(3660)).toEqual(0);
});

test('40 seconds is 40 seconds.', () => {
    let tl = new TimeLog({});
    expect(tl.calculateHours(40)).toEqual(0);
    expect(tl.calculateMinutes(40)).toEqual(0);
    expect(tl.calculateSeconds(40)).toEqual(40);
});

// new Date(1658696242133) ---  Sun Jul 24 2022 15:57:22 GMT-0500 (Central Daylight Time)
// new Date(1658696262133) ---  Sun Jul 24 2022 15:57:42 GMT-0500 (Central Daylight Time)
// new Date(1658696362133) ---  Sun Jul 24 2022 15:59:22 GMT-0500 (Central Daylight Time)
// new Date(1658697362133) ---  Sun Jul 24 2022 16:16:02 GMT-0500 (Central Daylight Time)

test('calculateCumulative 1 row in progress', () => {
    let tl = new TimeLog({});
    tl.state = {rightNow : new Date(1658696262133) };
    let times = [
        {
             startTime : new Date(1658696242133) 
        }
    ]
    expect(tl.calculateCumulative(0, times)).toEqual("00:00:20");
});

test('calculateCumulative 1 row completed', () => {
    let tl = new TimeLog({});
    tl.state = {};
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133)
        }
    ]
    expect(tl.calculateCumulative(0, times)).toEqual("00:00:20");
});

test('calculateCumulative 1st continuation, 2nd is in progress', () => {
    let tl = new TimeLog({});
    tl.state = { rightNow : new Date(1658697362133) };
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
    expect(tl.calculateCumulative(1, times)).toEqual("00:18:40");
});

test('calculateCumulative 1st continuation, 2nd completed', () => {
    let tl = new TimeLog({});
    tl.state = {};
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
    expect(tl.calculateCumulative(0, times)).toEqual("00:00:20");
    expect(tl.calculateCumulative(1, times)).toEqual("00:18:40");
});

test('calculateCumulative 1st complete (not continuation), 2nd completed', () => {
    let tl = new TimeLog({});
    tl.state = {};
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
    expect(tl.calculateCumulative(0, times)).toEqual("00:00:20");
    expect(tl.calculateCumulative(1, times)).toEqual("00:17:00");
});

test('calculateCumulative with an offset 1st complete (not continuation), 2nd completed', () => {
    let tl = new TimeLog({offsetValue : "01:10"});
    tl.state = {};
    let times = [
        { startTime : new Date(1658696242133), 
          endTime : new Date(1658696262133),
          continuation : false 
        },
        { startTime : new Date(1658696362133), 
           endTime : new Date(1658697362133)
        }
    ]

    expect(tl.calculateCumulative(0, times)).toEqual("01:10:20");
    expect(tl.calculateCumulative(1, times)).toEqual("01:27:00");
});


