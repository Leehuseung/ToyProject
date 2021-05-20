export const stateType = {
    PENDING: 'Pending',
    PROCEEDING: 'Proceeding',
    COMPLETED: 'Completed',
    keys : ['Pending', 'Proceeding', 'Completed'],
    fromType: (type) => {
        switch (type){
            case stateType.PROCEEDING : return false;
            case stateType.COMPLETED : return true;
            case stateType.PENDING : return null;
            default:
                return undefined;
        }
    },
    getType: (status) => {
        if (status === undefined || status === null) {
            return stateType.PENDING;
        } else if (status) {
            return stateType.COMPLETED;
        } else {
            return stateType.PROCEEDING;
        }
    },
}
