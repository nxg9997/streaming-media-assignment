const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const getIndex = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(index);
  res.end();
};

const getPage2 = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(page2);
  res.end();
};

const getPage3 = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(page3);
  res.end();
};

module.exports.getIndex = getIndex;
module.exports.getPage2 = getPage2;
module.exports.getPage3 = getPage3;
