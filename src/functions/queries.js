const NewUser = `INSERT INTO users(id)
SELECT ?
WHERE NOT EXISTS(SELECT 1 FROM users WHERE id = ?);`

const SearchUser = `SELECT DISTINCT 
id id,
userdata.tag tag,
userdata.cookies cookies,
userdata.ink ink,
userdata.active friend,
userdata.frname friendname,
userdata.url url,
cooldown.cooldaily cooldaily,
cooldown.cool1 cool1,
cooldown.cool2 cool2,
cooldown.cool3 cool3,
cooldown.cool4 cool4
FROM users
INNER JOIN userdata ON users.tag = userdata.tag
INNER JOIN cooldown ON users.tag = cooldown.tag
WHERE id = ?`;

const SearchTakoLevel = `SELECT DISTINCT 
id id,
userdata.tag tag,
userdata.active friend,
userdata.frname friendname,
userdata.url url
FROM users
INNER JOIN userdata ON users.tag = userdata.tag
WHERE id = ?`;

const SearchTako = `SELECT DISTINCT 
users.tag tag,
takoid takoid,
level level,
exp exp,
copies copies
FROM gachatakos
INNER JOIN users ON gachatakos.tag = users.tag
WHERE users.id = ? AND takoid = ?
`;

const SearchAllTako = `SELECT DISTINCT 
users.tag tag,
takoid takoid,
level level,
copies copies
FROM gachatakos
INNER JOIN users ON gachatakos.tag = users.tag
WHERE users.id = ?
`;

const CheckTotalTakos = `
SELECT DISTINCT 
users.tag tag,
COUNT(*) number
FROM gachatakos
INNER JOIN users ON gachatakos.tag = users.tag
WHERE users.id = ?
`

const AddNewTako = `INSERT INTO gachatakos(tag,takoID,level,exp,copies) VALUES(?,?,1,0,?)`

const AddTakoCopy = `UPDATE gachatakos SET copies = copies + ? WHERE tag = ? AND takoID = ?;`;

const UpdateTakoLevelExp = `UPDATE gachatakos SET exp = ?, level = ? WHERE tag = ? AND takoID = ?;`;

const EditFriend = `UPDATE userdata SET active = ?, frname = ?, url = ? WHERE (SELECT tag FROM users WHERE users.id = ?) = userdata.tag;`;

var DailyCooldown = `UPDATE cooldown SET cooldaily = ? WHERE (SELECT tag FROM users WHERE users.id = ?) = cooldown.tag;`;

var PlayCool1 = `UPDATE cooldown SET cool1 = ? WHERE (SELECT tag FROM users WHERE users.id = ?) = cooldown.tag;`;

var PlayCool2 = `UPDATE cooldown SET cool2 = ? WHERE (SELECT tag FROM users WHERE users.id = ?) = cooldown.tag;`;

var PlayCool3 = `UPDATE cooldown SET cool3 = ? WHERE (SELECT tag FROM users WHERE users.id = ?) = cooldown.tag;`;

var PlayCool4 = `UPDATE cooldown SET cool4 = ? WHERE (SELECT tag FROM users WHERE users.id = ?) = cooldown.tag;`;

module.exports = {
    NewUser,
    SearchUser,
    SearchTako,
    AddNewTako,
    AddTakoCopy,
    SearchAllTako,
    EditFriend,
    UpdateTakoLevelExp,
    SearchTakoLevel,
    PlayCool1,
    PlayCool2,
    PlayCool3,
    PlayCool4,
    DailyCooldown,
    CheckTotalTakos
}