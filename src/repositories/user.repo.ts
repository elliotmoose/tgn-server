import { User } from './../domain/entities/user.entity';
import mongoose from "mongoose";

interface Dependencies {
    UserModel: mongoose.Model<mongoose.Document, {}>
}

export default function makeUserRepo({ UserModel } : Dependencies) : UserRepository {
    return Object.freeze({
        findById,
        find,
        insert,
        exists,
        retrievePasswordHashAndSalt,
        userHasFollower
    })

    async function findById(userId, select) {
        let query = UserModel.findById(userId);

        if(select) {
            query = query.select(select.join(' '));
        }

        let userDoc = await query;

        if(!userDoc) {
            return null;
        }

        const { _id: id, password, passwordSalt, ...otherUserData } = userDoc.toJSON();

        let output = {
            id,
            ...otherUserData
        }

        if(select && select.indexOf('password') != -1) {
            //reveal password
            output = {
                ...output,
                password, 
                passwordSalt
            }
        }

        return output;
    }
    
    async function find(match, select) {
        let query = UserModel.findOne(match);

        if(select) {
            query = query.select(select.join(' '));
        }

        let userDoc = await query;

        if(!userDoc) {
            return null;
        }

        const { _id: id, password, passwordSalt, ...otherUserData } = userDoc.toJSON();
        
        let output = {
            id,
            ...otherUserData
        }

        if(select && select.indexOf('password') != -1) {
            //reveal password
            output = {
                ...output,
                password, 
                passwordSalt
            }
        }

        return output;
    }

    async function insert(userData) {
        let newUser = new UserModel(userData);
        let newUserDoc = await newUser.save();

        if(!newUserDoc) {
            return null;
        }

        const { _id: id, password, passwordSalt, ...otherUserData } = newUserDoc.toJSON();
        return { _id: id, ...otherUserData };
    }

    async function exists(match) {
        let exists = await UserModel.exists(match);
        return exists;
    }

    async function retrievePasswordHashAndSalt(username : string) {
        const doc = await UserModel.findOne({username}).select('password passwordSalt');

        if(!doc) {
            return;
        }

        const { password, passwordSalt } = doc.toJSON();
        return { password, passwordSalt };
    }

    async function userHasFollower(userId: string, targetUserId: string) : Promise<Boolean> {
        const isFollowing = await UserModel.exists({_id: userId, following: {$eq: targetUserId}});
        const hasFollower = await UserModel.exists({_id: targetUserId, followers: {$eq: userId}});
        return isFollowing && hasFollower;
    }
}


export interface UserRepository {
    findById: (id: string, select?: Array<string> | undefined) => Promise<User>,
    find: (match: Object, select?: Array<string> | undefined) => Promise<User>,
    retrievePasswordHashAndSalt: (username) => Promise<{password: string, passwordSalt: string} | undefined>
    insert: (userData: User) => Promise<User>,
    exists: (match : Object) => Promise<Boolean>,
    userHasFollower: (userId: string, targetUserId: string) => Promise<Boolean>,
}
