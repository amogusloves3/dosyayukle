const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const Darkmode = require('darkmode-js');
const requestIp = require('request-ip');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use("/dosyalar", express.static('./src/dosyalar'));
app.use(requestIp.mw());
app.set("views", path.join(__dirname, "src/views"));

const storage = multer.diskStorage({
  destination: './src/dosyalar/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  // fileFilter: function(req, file, cb){
  //   checkFileType(file, cb);
  // }
}).single('dosya');


// function checkFileType(file, cb){
//   const filetypes = /jpeg|jpg|png|gif|mp3|mkv|mp4|wav|ogg|apk|rar|zip|txt|vbs|dic|doc|docx|bmp|avi|mpeg|mov|pdf|exe|xls|tar|7z|psd|uot|rtf|otd|ott|flv|3pp|dat|xlsx|ppt|pttx|mdb|mbdx/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);
//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Sisteme uyarı geldi!');
//   }
// }

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  //new Darkmode().showWidget();
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: 'Dosya çok büyük!'
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Dosya seçili değil!'
        });
      } else {
        console.log(`${req.file.filename} adlı dosya yüklendi`);
        res.render('index', {
          msg: 'Dosya Yüklendi!',
          file: `src/dosyalar/${req.file.filename}`,
          url: `https://www.dosyaykl.tk/dosyalar/${req.file.filename}`
        });
      };
    };
  });
});

app.listen(port, () => console.log(`${port} Portundan başladı`));
