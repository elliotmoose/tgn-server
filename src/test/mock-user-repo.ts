import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../repositories/user.repo';

const users: {[key : string]: User} = {};

const mockUserRepo : UserRepository = {        
        async findById(userId, select) {
            const user = users[userId];

            if(select) {
                for(let key in user) {
                    if(select.indexOf(key) == -1 && key != 'id') {
                        delete user[key];
                    }
                }
            }
            return user;
        },

        async find(match, select) {
            let outputUser;

            for(let user of Object.values(users)) {
                let isMatch = true;
                for(let key in match) {
                    if(match[key] != user[key]) {
                        isMatch = false;
                        continue;
                    }
                } 

                if(isMatch) {
                    outputUser = user;
                }
            }            

            if(select && outputUser) {
                for(let key in outputUser) {
                    if(select.indexOf(key) == -1 && key != 'id') {
                        delete outputUser[key];
                    }
                }
            }
            
            return outputUser;
        },

        async insert(userData) {
            users[`${userData.id}`] = userData;
            return userData; 
        },

        async exists(match) {
            
           return await this.find(match) !== undefined;
        },

        async retrievePasswordHashAndSalt(username: string) {
            const user = await this.find({username});

            if(!user) {
                return undefined;
            }

            const { password, passwordSalt } = user;

            return { password: password as string, passwordSalt: passwordSalt as string };
        },

        async userHasFollower(userId: string, targetUserId: string): Promise<Boolean> {
            let user = users[userId];
            if(!user) {
                return false;
            }

            return user.followers.find((id) => id.equals(targetUserId)) !== undefined;
        },
}

export default mockUserRepo;
