module.exports = {
    /* 회원가입시에 사용 */
    encrypt: async (password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const crypto = require('crypto');
                //salt라는 랜덤값 생성
                const secretKey = await crypto.randomBytes(64).toString('base64');
                //pbkdf2 이용해서 password와 salt를 넣고 한번 더 해싱
                await crypto.pbkdf2(password, secretKey.toString(), 1, 99, 'sha256', (err: any, derivedKey: any) => {
                    if(err) throw err;
                    const encryptPassword = derivedKey.toString('base64');
                    resolve({secretKey,encryptPassword});
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    },
    /* 로그인시에 사용 */
    encryptWithSalt: async (password: string, salt: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const crypto = require('crypto');
                //로그인시 넣은 password와 db에서 가져온 salt를 한번 더 해싱해서 비교
                crypto.pbkdf2(password, salt, 1, 99, 'sha256', (err: any, derivedKey: any) => {
                    if(err) throw err;
                    const loginPassword = derivedKey.toString('base64');
                    resolve(loginPassword);
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
}