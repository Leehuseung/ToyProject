export const stateType = {
    PENDING: 'Pending',
    PROCEEDING: 'Proceeding',
    COMPLETED: 'Completed',
    checkType: (type) => {
        switch (type){
            case stateType.PENDING : return null;
            case stateType.PROCEEDING : return false;
            case stateType.COMPLETED : return true;
        }
    },
    checkStatus: (status) => {
        if (status === undefined || status === null) {
            return stateType.PENDING;
        } else if (status) {
            return stateType.COMPLETED;
        } else {
            return stateType.PROCEEDING;
        }
    }
}
