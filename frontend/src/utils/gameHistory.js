const History_key= "tic-tac-toe-history";

export const saveGameResult = (game) => {
const history = JSON.parse(localStorage.getItem(History_key) || "[]");
history.push(game);
localStorage.setItem(History_key, JSON.stringify(history));
console.log("saved history:", localStorage.getItem(History_key));
}

export const getGameHistory = () => {
    const history = JSON.parse(localStorage.getItem(History_key) || "[]");
    return history;
}
