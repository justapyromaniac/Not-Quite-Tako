import { Client } from "discord.js";

export default (client: Client): void => {
    client.on("ready", async () => {
        if(!client.user || !client.application) {
            return;
        }

        console.log("WAH! (We Are Here!)\n(a bot made by just_a_pyro with the help of NxKarim)");
    })
}