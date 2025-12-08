"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryItemWhereOwner = exports.queryItemWhereOwnerOrMember = exports.collectionWhereOwnerOrMember = exports.collectionWhereOwner = exports.workspaceWhereOwnerOrMember = exports.workspaceWhereOwner = void 0;
const workspaceWhereOwner = (userId) => {
    return {
        ownerId: userId,
    };
};
exports.workspaceWhereOwner = workspaceWhereOwner;
const workspaceWhereOwnerOrMember = (userId) => {
    return {
        OR: [
            {
                ownerId: userId,
            },
            {
                team: {
                    TeamMemberships: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        ],
    };
};
exports.workspaceWhereOwnerOrMember = workspaceWhereOwnerOrMember;
const collectionWhereOwner = (userId) => {
    return {
        workspace: Object.assign({}, (0, exports.workspaceWhereOwner)(userId)),
    };
};
exports.collectionWhereOwner = collectionWhereOwner;
const collectionWhereOwnerOrMember = (userId) => {
    return {
        workspace: Object.assign({}, (0, exports.workspaceWhereOwnerOrMember)(userId)),
    };
};
exports.collectionWhereOwnerOrMember = collectionWhereOwnerOrMember;
const queryItemWhereOwnerOrMember = (userId) => {
    return {
        collection: Object.assign({}, (0, exports.collectionWhereOwnerOrMember)(userId)),
    };
};
exports.queryItemWhereOwnerOrMember = queryItemWhereOwnerOrMember;
const queryItemWhereOwner = (userId) => {
    return {
        collection: Object.assign({}, (0, exports.collectionWhereOwner)(userId)),
    };
};
exports.queryItemWhereOwner = queryItemWhereOwner;
//# sourceMappingURL=where-clauses.js.map