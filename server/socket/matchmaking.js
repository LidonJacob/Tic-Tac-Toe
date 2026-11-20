const waitingPlayers = [];

export const handleMatchMaking = (io, socket) => {
    if(waitingPlayers.some((player) => player.userId === socket.user._id.toString())) {
        return;
    }
}
