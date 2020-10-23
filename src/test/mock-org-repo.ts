import { OrganisationRepository } from './../repositories/organisation.repo';
import { User } from '../domain/entities/user.entity';

const organisations: {[key : string]: User} = {};

const mockOrgRepo : OrganisationRepository = {        
        // async findById(userId, select) {
        //     const user = organisations[userId];

        //     if(select) {
        //         for(let key in user) {
        //             if(select.indexOf(key) == -1 && key != 'id') {
        //                 delete user[key];
        //             }
        //         }
        //     }
        //     return user;
        // },

        // async find(match, select) {
        //     let outputUser;

        //     for(let user of Object.values(organisations)) {
        //         for(let key in match) {
        //             if(match[key] != user[key]) {
        //                 continue;
        //             }
        //         }

        //         outputUser = user;
        //     }

        //     if(select) {
        //         for(let key in outputUser) {
        //             if(select.indexOf(key) == -1 && key != 'id') {
        //                 delete outputUser[key];
        //             }
        //         }
        //     }

        //     return outputUser;
        // },

        // async insert(userData) {
            
        // },

        async exists(match) {
            let org = Object.values(organisations).find((org)=> {
                
                for(let key in match) {
                    if(org[key] != match[key]) {
                        return false;
                    }
                }
                
                return true;
            })

            return org !== undefined;
        },

        async clearAll() {
            
        }
}

export default mockOrgRepo;
