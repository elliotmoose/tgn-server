import mongoose from "mongoose";

interface Dependencies {
    UserModel: mongoose.Model<mongoose.Document, {}>
}

export default function makeUserRepo({ UserModel } : Dependencies) {
    return Object.freeze({
        findById,
        find,
        insert,
        exists
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
}