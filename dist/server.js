"use strict";
// import "reflect-metadata"
// const express = require('express')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3000, () => console.log('Server up'));
app.get('/', (req, res) => {
    res.send('Welcome to the flitter backend API');
});
// app.get('/users', (req, res) => {
//   const users = 
//   res.send()
// })
//# sourceMappingURL=server.js.map