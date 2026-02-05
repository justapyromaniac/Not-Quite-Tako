const { OpenTakoDB, closeDb } = require('./functions/functions.js');
var CronJob = require('cron').CronJob;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {

    var job = new CronJob(
        '0 0 13 * * *',
        async function () {
            let takodb = await OpenTakoDB();
            let ResetCooldown = `UPDATE cooldown SET cooldaily = 0;`
            await takodb.run(ResetCooldown, (err, row) => { if (err) { return console.log(err, `Daily bonus error.`) } });
            console.log(`Daily Cooldown Reset`)
            await closeDb(takodb);
        },
        null,
        true,
        'America/Los_Angeles'
    );

    job.start()

};