const History_key= "tic-tac-toe-history";

export const saveGameResult = (game) => {
const history = JSON.parse(sessionStorage.getItem(History_key) || "[]");
history.push(game);
sessionStorage.setItem(History_key, JSON.stringify(history));

}

export const getGameHistory = () => {
    const history = JSON.parse(sessionStorage.getItem(History_key) || "[]");
    return history;
}
