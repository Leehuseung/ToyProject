export const Room = function (id, title, user_id, isAvailable, password) {
    return {
        id : id,
        title : title,
        user : user_id,
        password : password,
        isAvailable : isAvailable,
    };
}

export const User = function (id, name) {
    return {
        id: id,
        name : name
    };
}