import { BrowserSerial } from "browser-serial";

/*
octomonk sez... 

you silly carrot head, that's not how you use this!
Usage:
   {"command":"passed",seconds:10,hue:90} 
       or... 
   {"command":"failed",seconds:20} 
       or... 
   {"command":"prod",seconds:10} 
       or... 
   {"command":"fire"} 
 seconds are optional (defaults to 10), hue ignored on failed commands
*/

export class Octomonk {

    async init() {
        this.serial = new BrowserSerial({baudRate:9600});
        await this.serial.connect();
    }

    destroy() {
        this.serial.disconnect();
        delete this.serial;
    }

    fireworks() {
        if (this.serial !== undefined) {
            this.serial.write("{\"command\":\"prod\",\"seconds\":120}\n");
        }
    }

    gameOn() {
        if (this.serial !== undefined) {
            this.serial.write("{\"command\":\"passed\",\"seconds\":20}\n")
        }
    }

    gameOff() {
        if (this.serial !== undefined) {
            this.serial.write("{\"command\":\"failed\",\"seconds\":10}\n")
        }
    }

    danger() {
        console.log("holy tinkles, telling octomonk there's danger");
        if (this.serial !== undefined) {
            this.serial.write("{\"command\":\"beep-on\"}\n")
            console.log("I done warned octomonk, yo.");
        }
    }

    noDanger() {
        console.log("telling octomonk to chill out.");
        if (this.serial !== undefined) {
            this.serial.write("{\"command\":\"beep-off\"}\n")
            console.log("I done calmed octomonk down.");
        }
    }
}
