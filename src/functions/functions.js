function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

async function getMessages(channel, limite) {
    var ma = [];
    let lid;
    while (true) {
        const options = { limit: 100 };
        if (lid) { options.before = lid; }
        const emessages = await channel.messages.fetch(options).catch(err => console.log(err));
        if (emessages == undefined || emessages == null) { return ma; } else {
            ma = ma.concat([...emessages.values()]);
            if (emessages.size != 100 || ma.length >= limite) { return ma; }
            lid = emessages.last().id;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomnum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function weightedRandom(prob) {
    let i, sum = 0, r = Math.random();
    for (i in prob) {
        sum += prob[i];
        if (r <= sum) return i;
    }
}

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

async function OpenTakoDB() {

    const dbPath = path.resolve(__dirname, '../databases/takogacha.db');
    let takodb = await new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    return takodb;
}

function UserExistInTakoDB(takodb, userid) {

    let usersearch = `SELECT DISTINCT 
    id id     
    FROM users
    WHERE id = ${userid}`;

    let check = true;
    takodb.get(usersearch, (err, row) => {
        if (row == null || row == undefined || row == "") {
            check = false;
        } else {
            check = true;
        }
    });

    return check;
}

function InkFunction(addedInk, userid, takodb) {
    var updatenow = `UPDATE userdata SET ink = ink + ${addedInk} WHERE (SELECT tag FROM users WHERE users.id = ${userid}) = userdata.tag;`;
    takodb.run(updatenow, (err) => { if (err) { return console.log(err, `Give ink Function Error.`) } return; });
}

function CookieFunction(addedCookie, userid, takodb) {
    var updatenow = `UPDATE userdata SET cookies = cookies + ${addedCookie} WHERE (SELECT tag FROM users WHERE users.id = ${userid}) = userdata.tag;`;
    takodb.run(updatenow, (err) => { if (err) { return console.log(err, `Give cookies Function Error.`) } return; });
}

let closeDb = (db) => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

async function Cooldown(cooldownQ, cooldownValue, cooldownTimer, userid, takodb) {
    var datenow = new Date().getTime();
    var FutureDate = datenow + cooldownValue;
    let left;
    if (datenow < cooldownTimer) {
        left = Math.round((((cooldownTimer - datenow) / 1000) / 60) * 100) / 100;
        var TimeRem;
        if (left > 60) {
            TimeRem = `${Math.round((left / 60) * 100) / 100}h`
        } else if (left >= 2) {
            TimeRem = `${left}m`;
        } else {
            TimeRem = `${Math.round((left * 60) * 100) / 100}s`;
        }
        return TimeRem;
    } else {
        takodb.run(cooldownQ, [FutureDate, userid], (err) => { if (err) { return console.log(err, `Cooldown error.`) } return; });
        return false;
    }
}

async function ResetCooldown(cooldownQ, newCD, cooldownTimer, userid, takodb) {
    var datenow = new Date().getTime();
    var FutureDate = datenow + newCD;
    if (datenow > cooldownTimer) {
        takodb.run(cooldownQ, [FutureDate, userid], (err) => { if (err) { return console.log(err, `Cooldown error.`) } return; });
        return;
    }
}

module.exports = {
    getRandom,
    sleep,
    randomnum,
    weightedRandom,
    getMessages,
    InkFunction,
    CookieFunction,
    OpenTakoDB,
    UserExistInTakoDB,
    closeDb,
    ordinal_suffix_of,
    Cooldown,
    ResetCooldown
}