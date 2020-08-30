/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addMessageToRoom = /* GraphQL */ `
  mutation AddMessageToRoom($roomId: String!, $message: String!) {
    addMessageToRoom(roomId: $roomId, message: $message) {
      id
      messages
      createdOn
      updatedAt
    }
  }
`;
export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    createRoom(input: $input, condition: $condition) {
      id
      messages
      createdOn
      updatedAt
    }
  }
`;
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom(
    $input: UpdateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    updateRoom(input: $input, condition: $condition) {
      id
      messages
      createdOn
      updatedAt
    }
  }
`;
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom(
    $input: DeleteRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    deleteRoom(input: $input, condition: $condition) {
      id
      messages
      createdOn
      updatedAt
    }
  }
`;
