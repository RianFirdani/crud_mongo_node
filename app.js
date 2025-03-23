const con = require('./connection')
const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const methodOverride = require('method-override')
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const port = 3000;


// gunakan ejs
app.set("view engine", "ejs");
//third party middleware
app.use(expressLayout);
app.use(methodOverride('_method'))
//Built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//application levelmiddleware

//Konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  // res.sendFile('./index.html',{root : __dirname});
  const mahasiswa = [
    {
      nama: "rian",
      email: "bkkrian07@gmail.com",
    },
    {
      nama: "rain",
      email: "bkkrian0@gmail.com",
    },
    {
      nama: "Ame",
      email: "bkkrian@gmail.com",
    },
  ];
  res.render("index", {
    nama: "Rian",
    title: "Halaman Home ejs",
    layout: "layouts/main-layout",
    mahasiswa,
  });
});

app.get("/about", (req, res) => {
  //res.sendFile('./about.html',{root : __dirname});
  res.render("about", {
    title: "Halaman about",
    layout: "layouts/main-layout",
  });
});

app.get("/contact", async(req, res) => {
  //res.sendFile('./contact.html',{root : __dirname});
  const contacts = await con.find()
  res.render("contact", {
    title: "Halaman contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

//Halaman form tambah data contact
app.get("/contact/add-contact", (req, res) => {
  const errors = validationResult(req)
  res.render("add-contact", {
    title: "Tambah Kontak",
    layout: "layouts/main-layout",
    errors : errors.array()
  });
});

//Proses delete kontak
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Kontak berhasil di hapus!!");
    res.redirect("/contact");
  }
});

// menampilkan form ubah data
app.get("/contact/edit/:nama",async (req, res) => {
  const contact = await con.findOne({name : req.params.nama})
  const err = validationResult(req)
  res.render("edit-contact", {
    title: "Ubah data kontak",
    layout: "layouts/main-layout",
    contact,
    errors : err.array()
  });
});

app.delete("/contact",(req,res)=>{
  con.deleteOne({_id : req.body._id}).then((error,result)=>{
    req.flash("msg", "Kontak berhasil di Hapus!!");
    res.redirect("/contact");
  })
})

app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await con.findOne({name : req.body.nama})
      if (value !== req.body.namaLama && duplikat) {
        throw new Error("Nama telah terdaftar!!");
      } else {
        return true;
      }
    }),
    check("email", "Email Tidak Valid").isEmail(),
    check("noHp", "Nomor HP Tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    errors = validationResult(req);
    console.log(req.body.namaLama)
        console.log(req.body.nama)
    if (!errors.isEmpty()) {
      //return res.status(400).json({errors:errors.array()})
      res.render("edit-contact", {
        title: "Ubah data",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      con.updateOne({_id : req.body._id},{
        $set : {
          name : req.body.nama,
          email : req.body.email,
          phone : req.body.noHP
        }
      }).then((error,result)=>{
        //Kirimkan flash masssage
        req.flash("msg", "Kontak berhasil di ubah!!");
        res.redirect("/contact");
      })
    }
  }
);

app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await con.findOne({name : value})
      if (duplikat) {
        throw new Error("Nama telah terdaftar!!");
      } else {
        return true;
      }
    }),
    check("email", "Email Tidak Valid").isEmail(),
    check("noHp", "Nomor HP Tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return res.status(400).json({errors:errors.array()})
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      con.insertMany([{name : req.body.nama,email:req.body.email,phone : req.body.noHp}]).then((error,result)=>{
        req.flash("msg", "Kontak berhasil di tambahkan");
        res.redirect("/contact");
      })
    }
  }
);

app.get("/contact/:nama", async(req, res) => {
  const contact = await con.findOne({name : req.params.nama})
  res.render("detail", {
    title: "Halaman Detail contact",
    layout: "layouts/main-layout",
    contact,
  });
});

// Halaman detail contact
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

//proses data contact

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
