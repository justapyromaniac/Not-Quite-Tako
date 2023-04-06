"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        console.log("WAH! (We Are Here!)\n(a bot made by just_a_pyro and NxKarim)");
    });
};