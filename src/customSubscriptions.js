function messageAddedSubscription(roomId) {
    let subscription = `
        subscription MessageAddedToRoom {
            messageAddedToRoom(id: "${roomId}") {
                id
                messages
                createdOn
                updatedAt
            }
        }
    `;
    return subscription;
};

export default messageAddedSubscription;