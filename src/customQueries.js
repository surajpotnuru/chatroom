function getMessagesQuery(roomId) {
    let query = `
        query getMessages {
            getRoom(id: "${roomId}") {
                messages
            }
        }
    `;
    return query;
};

export default getMessagesQuery;