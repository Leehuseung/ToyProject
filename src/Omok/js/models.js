export const Room = function (id, title, user, isAvailable, hasPassword) {
    return {
        id : id,
        title : title,
        user : user,
        isAvailable : isAvailable,
        hasPassword : hasPassword,
    };
}

export const User = function (id, name) {
    return {
        id: id,
        name : name
    };
}