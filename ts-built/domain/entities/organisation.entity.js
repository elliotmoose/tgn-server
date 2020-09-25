"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildMakeOrganisation(_a) {
    var Ids = _a.Ids, Errors = _a.Errors, Validation = _a.Validation;
    return function makeOrganisation(_a) {
        var id = _a.id, handle = _a.handle, name = _a.name, email = _a.email, isPublic = _a.isPublic, members = _a.members, address = _a.address, contact = _a.contact, description = _a.description, website = _a.website, createdAt = _a.createdAt;
        if (!handle) {
            throw new Error("Organisation must have a handle");
        }
        return Object.freeze({
            id: id,
            handle: handle,
            name: name,
            email: email,
            isPublic: isPublic,
            members: members,
            address: address,
            contact: contact,
            description: description,
            website: website,
            createdAt: createdAt
        });
    };
}
exports.default = buildMakeOrganisation;
//# sourceMappingURL=organisation.entity.js.map