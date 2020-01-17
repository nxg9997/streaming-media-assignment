const fs = require('fs');
const path = require('path');

const createHeader = (res, start, end, total, mime) => {
  const chunksize = (end - start) + 1;
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': mime,
  });
};

const createStream = (res, file, start, end) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(res);
  });

  stream.on('error', (streamErr) => {
    res.end(streamErr);
  });
};

const checkErr = (res, err) => {
  if (err === 'ENOENT') {
    res.writeHead(404);
  }
  return res.end(err);
};

const createRange = (req) => {
  let { range } = req.headers;
  if (!range) {
    range = 'bytes=0-';
  }
  return range;
};

const findPositions = (stats, range) => {
  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  return { start, end, total };
};

const streamFile = (req, res, filepath, mime) => {
  const file = path.resolve(__dirname, filepath);
  fs.stat(file, (err, stats) => {
    if (err) {
      return checkErr(res, err);
    }

    const range = createRange(req);

    const positions = findPositions(stats, range);

    createHeader(res, positions.start, positions.end, positions.total, mime);

    const stream = createStream(res, file, positions.start, positions.end);

    return stream;
  });
};

const getParty = (req, res) => {
  streamFile(req, res, '../client/party.mp4', 'video/mp4');
};

const getBling = (req, res) => {
  streamFile(req, res, '../client/bling.mp3', 'audio/mpeg');
};

const getBird = (req, res) => {
  streamFile(req, res, '../client/bird.mp4', 'video/mp4');
};

module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
