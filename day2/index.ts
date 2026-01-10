
import express from 'express';
const postgressurl = process.env.POSTGRESSURL ;
const port = process.env.PORT;
const app = express();
app.use(express.json());

app.get('/', (req:any, res:any) => {
	res.send('Hello, Express + TypeScript!');
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
