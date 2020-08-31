function addMessageToRoomCustom(roomId, message) {
    let mutation = `
        mutation AddMessageToRoom {
            addMessageToRoom(roomId: "${roomId}", message: """${message}""") {
                id
                messages
                createdOn
                updatedAt
            }
        }
    `;
    return mutation;
};

export default addMessageToRoomCustom;