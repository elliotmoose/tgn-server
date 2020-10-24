import chai, { assert, expect } from "chai"

export const expectThrowsAsync = async (method, expected) => {
    try {
        await method;
    } catch (error) {
        if(!error.toJSON) {
            throw error;
        }
        
        expect(error.toJSON()).to.eql(expected);
        return;
    }

    assert(false, 'Did not throw');
};