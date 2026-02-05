const { randomnum, getRandom } = require('../functions/functions.js');
var fs = require('fs');
var path = require('path');

let cooldowns = new Map();

const hololiveMembers = [
    'tako', 'HyperClap', 'WAH', 'lightstick', 'Tokino Sora', 'ときのそら', 'Robocosan', 'ロボ子さん', 'Aki Rosenthal', 'アキ・ローゼンタール',
    'Akai Haato', '赤井はあと', 'Shirakami Fubuki', '白上フブキ', 'Natsuiro Matsuri', '夏色まつり',
    'Murasaki Shion', '紫咲シオン', 'Nakiri Ayame', '百鬼あやめ', 'Yuzuki Choco', '癒月ちょこ',
    'Oozora Subaru', '大空スバル', 'AZKi', 'Ookami Mio', '大神ミオ', 'Sakura Miko', 'さくらみこ',
    'Nekomata Okayu', '猫又おかゆ', 'Inugami Korone', '戌神ころね', 'Hoshimachi Suisei', '星街すいせい',
    'Usada Pekora', '兎田ぺこら', 'Shiranui Flare', '不知火フレア', 'Shirogane Noel', '白銀ノエル',
    'Houshou Marine', '宝鐘マリン', 'Amane Kanata', '天音かなた', 'Tsunomaki Watame', '角巻わため',
    'Tokoyami Towa', '常闇トワ', 'Himemori Luna', '姫森ルーナ', 'Yukihana Lamy', '雪花ラミィ',
    'Momosuzu Nene', '桃鈴ねね', 'Shishiro Botan', '獅白ぼたん', 'Omaru Polka', '尾丸ポルカ',
    'La+ Darknesss', 'ラプラス・ダークネス', 'Takane Lui', '鷹嶺ルイ', 'Hakui Koyori', '博衣こより',
    'Sakamata Chloe', '沙花叉クロヱ', 'Kazama Iroha', '風真いろは', 'Ayunda Risu', 'アユンダ・リス',
    'Moona Hoshinova', 'ムーナ・ホシノヴァ', 'Airani Iofifteen', 'アイラニ・イオフィフティーン',
    'Kureiji Ollie', 'クレイジー・オリー', 'Anya Melfissa', 'アーニャ・メルフィッサ', 'Pavolia Reine',
    'パヴォリア・レイネ', 'Vestia Zeta', 'ベスティア・ゼータ', 'Kaela Kovalskia', 'カエラ・コヴァルスキア',
    'Kobo Kanaeru', 'こぼ・かなえる', 'Mori Calliope', '森カリオペ', 'Takanashi Kiara', '小鳥遊キアラ',
    'Ninomae Ina’nis', '一伊那尓栖', 'Gawr Gura', 'がうる・ぐら', 'Watson Amelia', 'ワトソン・アメリア',
    'IRyS', 'Ouro Kronii', 'オーロ・クロニー', 'Nanashi Mumei', '七詩ムメイ', 'Hakos Baelz', 'ハコス・ベールズ',
    'Shiori Novella', 'シオリ・ノヴェラ', 'Koseki Bijou', '古石ビジュー', 'Nerissa Ravencroft',
    'ネリッサ・レイヴンクロフト', 'Fuwawa Abyssgard', 'フワワ・アビスガード', 'Mococo Abyssgard',
    'モココ・アビスガード', 'Elizabeth Rose Bloodflame', 'エリザベス・ローズ・ブラッドフレイム',
    'Gigi Murin', 'ジジ・ムリン', 'Cecilia Immergreen', 'セシリア・イマーグリーン', 'Raora Panthera',
    'ラオーラ・パンテーラ', 'Hiodoshi Ao', '火威青', 'Otonose Kanade', '音乃瀬奏', 'Ichijou Ririka',
    '一条莉々華', 'Juufuutei Raden', '儒烏風亭らでん', 'Todoroki Hajime', '轟はじめ', 'Isaki Riona',
    '響咲リオナ', 'Koganei Niko', '虎金妃笑虎', 'Mizumiya Su', '水宮枢', 'Rindo Chihaya', '輪堂千速',
    'Kikirara Vivi', '綺々羅々ヴィヴィ', 'Minato Aqua', '湊あくあ', 'Kiryu Coco', '桐生ココ', 'Tsukumo Sana',
    '九十九佐命', 'Ceres Fauna', 'セレス・ファウナ', 'Harusaki Nodoka', '春先のどか', 'Friend A (A-chan)'
];

const FlareTako = [
    ` 😍 ORE NO INA ❤️`, `I LOVE INAAAAA`, `INAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`,
];

module.exports = {
    data: {
        name: 'takotalks',
        description: 'Makes NQT say and post things.'
    },
    async execute(message) {
        const client = message.client;

        if (message.mentions.users.some(user => user.id === client.user.id)) {
            const filePath = path.resolve(__dirname, '../resources/takotalkslist.txt');
            const file = fs.readFileSync(filePath, 'utf8');
            const marr = file.split(`\r\n`);

            if (message.content.includes(`is this true`)) {
                const randomNumber = randomnum(1, 100);
                if (randomNumber <= 50) {
                    return message.channel.send(`No`);
                } else {
                    return message.channel.send(`Yes`);
                }
            }

            let m;
            const messageContent = message.content.toLowerCase();
            const relatedMessages = marr.filter(msg => messageContent.includes(msg.toLowerCase()));

            if (relatedMessages.length > 0) {
                //m = await getRandom(relatedMessages, 1)[0];
                m = await getRandom(marr, 1)[0];
            } else {
                m = await getRandom(marr, 1)[0];
            }

            message.channel.send(m);
        }



        if (message.content.includes(`SportScran/status/1880930499432169640`)) {
            message.channel.send(`HOOOOOOOOOOOOOOOOOOOOOOOOOLLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`);
        }

        /*
        if (message.guild.id == `753099492554702908`) {
            const now = Date.now();
            const flareCooldownAmount = 15 * 60 * 1000;

            if (cooldowns.has('flare')) {
                const flareExpirationTime = cooldowns.get('flare') + flareCooldownAmount;
                if (now < flareExpirationTime) {
                    return;
                }
            }

            cooldowns.set('flare', now);

            const flareMessage = await getRandom(FlareTako, 1)[0];
            message.channel.send(flareMessage);
        }*/


        /*if (message.channel.id == `954337573487116288`) {
            const now = Date.now();
            let cheerCooldownAmount = 80 * 1000; // 60 seconds cooldown for cheer messages
            let hololiveCooldownAmount = 80 * 1000; // 60 seconds cooldown for Hololive mentions

            if (message.content.includes('MC') || message.content.includes('mc')) {
                cheerCooldownAmount *= 5;
                hololiveCooldownAmount *= 5;
                console.log('MC message detected', cheerCooldownAmount, hololiveCooldownAmount);
                cooldowns.set('cheer', now);
                cooldowns.set('hololive', now);
            }

            const marr = [
                `THIS IS PEAK`,
                `I LOVE THIS SONG`,
                `LETSGOOOOOOOOOOOOOOOOOO`,
                `<a:TakoBASS:967630849354903643>`,
                `<a:TakoRatJAM:1027962010329174066>`,
                `AAAAAAAAAAAAAAAA`,
                `Error: NQT is way too excited`,
                `Love it!`,
                `Man I love Hololive`,
                `BANGER!`,
                'cute!',
                'amazing!',
                'WAH!',
                'INA DOKO', 
                '<a:TakoLetsGoZoom:806693124754898984><a:TakoLetsGoZoom:806693124754898984><a:TakoLetsGoZoom:806693124754898984><a:TakoLetsGoZoom:806693124754898984><a:TakoLetsGoZoom:806693124754898984>'
            ];

            let m;
            const messageContent = message.content.toLowerCase();
            const relatedMessages = marr.filter(msg => messageContent.includes(msg.toLowerCase()));

            if (relatedMessages.length > 0) {
                m = await getRandom(relatedMessages, 1)[0];
            } else {
                m = await getRandom(marr, 1)[0];
            }

            const hololiveMentioned = hololiveMembers.some(member => messageContent.includes(member.toLowerCase()));
            
            if (hololiveMentioned) {

                console.log(hololiveMentioned, messageContent);

                if (cooldowns.has('hololive')) {
                    const hololiveExpirationTime = cooldowns.get('hololive') + hololiveCooldownAmount;
                    if (now < hololiveExpirationTime) {
                        return;
                    }
                }
               
                cooldowns.set('hololive', now);
                message.channel.send(message.content);
            } else {

                if (cooldowns.has('cheer')) {
                    const cheerExpirationTime = cooldowns.get('cheer') + cheerCooldownAmount;
                    if (now < cheerExpirationTime) {
                        return;
                    }
                }

                cooldowns.set('cheer', now);
                message.channel.send(m);
            }
        }*/
    },
};