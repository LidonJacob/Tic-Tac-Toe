import app from "./app.js";

app.get("/", (req, res) => {
  res.send("Welcome to the Tic-Tac-Toe");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
