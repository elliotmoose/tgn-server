import { Ids } from './../helpers/Ids';
import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../repositories/user.repo';


interface Dependencies {
    Ids: Ids
}

const users: { [key: string]: User } = {};

const makeMockUserRepo = ({ Ids } : Dependencies) => {

    const mockUserRepo: UserRepository = {
        async findById(userId, select) {
            let user = users[userId];

            if(user) {
                let {password, passwordSalt, ...otherData} = JSON.parse(JSON.stringify(user));

                let outputUser = { id: user.id }

                if (select) {
                    for (let key in user) {
                        if (select.indexOf(key) != -1) {
                            outputUser[key] = user[key]
                        }
                    }
                }
                else {
                    let { password, passwordSalt, ...otherData } = user;
                    outputUser = otherData;
                }   

                return outputUser as User;
            }

            return null;
        },

        async find(match, select) {
            let matchedUser;
            let outputUser;

            for (let user of Object.values(users)) {
                let isMatch = true;
                for (let key in match) {
                    if (match[key] != user[key]) {
                        isMatch = false;
                        continue;
                    }
                }

                if (isMatch) {
                    matchedUser = JSON.parse(JSON.stringify(user));
                }
            }

            if (matchedUser) {
                outputUser = { id: matchedUser.id}

                if (select) {
                    for (let key in matchedUser) {
                        if (select.indexOf(key) != -1) {
                            outputUser[key] = matchedUser[key]
                        }
                    }
                }
                else {

                    
                    let { password, passwordSalt, ...otherData } = matchedUser;
                    outputUser = otherData;                    
                }
            }

            return outputUser;
        },

        async insert(userData) {            
            users[`${userData.id}`] = userData;
            let { password, passwordSalt, ...otherData } = userData;
            return otherData as User;
        },

        async exists(match) {
            return await this.find(match) !== undefined;
        },

        async retrievePasswordHashAndSalt(username: string) {
            const user = await this.find({ username }, ['password','passwordSalt']);
            
            if (!user) {
                return undefined;
            }

            const { password, passwordSalt } = user;            
            return { password: password as string, passwordSalt: passwordSalt as string };
        },

        async userHasFollower(userId: string, targetUserId: string): Promise<Boolean> {
            let user = users[userId];
            if (!user) {
                return false;
            }

            return user.followers.find((id) => Ids.equal(id, targetUserId)) !== undefined;
        },

        async clearAll() {
            for (let key of Object.keys(users)) {
                delete users[key];
            }
        }
    }

    return mockUserRepo;

}

export default makeMockUserRepo;
