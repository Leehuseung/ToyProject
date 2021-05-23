export const Room = function (id, title, user) {
    return {
        id : id,
        title : title,
        user : user,
    };
}

export const User = function (id, name) {
    return {
        id: id,
        name : name
    };
}