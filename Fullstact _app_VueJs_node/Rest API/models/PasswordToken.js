const knex = require("../database/connection")
const User = require("./User")

class PasswordToken {
    async create(email){
        let user = await User.findByEmail(email)
        if(user) {
            try {
                let token = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordTokens")
                return {status: true, token: token}

            } catch(error) {
                console.log(err);
                return {status: false, err: err}
            }
        } else {
            return {status: false, err: "O e-mail passado não existe no banco de dados !"}
        }
    }

    async validate(token) {
        try {
            let result= await knex.select().where({token:token}).table("passwordTokens")

            if(result.length> 0){
                let tk = result[0];
                if(tk.used){
                    return {status: false};
                } else {
                    return {status: true, token: tk}
                }
            } else {
                return {status: false};
            }
        }catch {
            console.log(err)
            return {status: false};
        }
    }

    async setUsed(token) {
        await knex.update({used: 1}).where({token: token}).table("passwordTokens")
    }
}

module.exports = new PasswordToken();