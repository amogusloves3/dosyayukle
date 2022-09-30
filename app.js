const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const Darkmode = require('darkmode-js');
const requestIp = require('request-ip');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use("/files", express.static('./src/files'));
app.use(requestIp.mw());
app.set("views", path.join(__dirname, "src/views"));

const storage = multer.diskStorage({
  destination: './src/files/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  // fileFilter: function(req, file, cb){
  //   checkFileType(file, cb);
  // }
}).single('file');


// function checkFileType(file, cb){
//   const filetypes = /jpeg|jpg|png|gif|mp3|mkv|mp4/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);
//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Hata sadece resim!');
//   }
// }

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  //new Darkmode().showWidget();
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: 'Dosya büyük'
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Dosya seçili değil'
        });
      } else {
        console.log(`${req.file.filename} adlı dosya yüklendi`);
        res.render('index', {
          msg: 'Dosya Yüklendi!',
          file: `src/files/${req.file.filename}`,
          url: `https://hexagonal-snowy-roadway.glitch.me/files/${req.file.filename}`
        });
      };
    };
  });
});

app.listen(port, () => console.log(`${port} Portundan başladı`));
