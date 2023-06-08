import express from "express";

import * as bodyParser from "body-parser";

import * as dotenv from "dotenv";
import routerAPI from "./routes/routes";
import compression from "compression";
import path from "path";

dotenv.config();

const app = express();

app.use(compression());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html as the default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res, next) => {
  if (!req.url.includes('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    return;
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


const port = process.env.PORT || 3000;

app.use('/api', routerAPI);

app.listen(port, () => {
  console.info(`[server]: Server is listening:${port}`);
});
