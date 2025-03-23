const fs = require("fs");

//const readline = require("node:readline");
//const { stdin: input, stdout: output } = require("node:process");
//const rl = readline.createInterface({ input, output });

//membuat folder data jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

//membuat file contacts.json jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}
//ambil semua data di contact.json
const loadContact = ()=>{
    const file = fs.readFileSync("data/contacts.json", "utf-8");
    const contacts = JSON.parse(file);
    return contacts
}

//cari contact berdasarkan nama
const findContact = nama=>{
    const contacts = loadContact()
    const contact = contacts.find(
        contact => contact.nama.toLowerCase() == nama.toLowerCase()
    )
    return contact;
}

//menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts)=>{
  fs.writeFileSync('data/contacts.json',JSON.stringify(contacts));
}


//menambah data contact baru
const addContact = (contact) =>{
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts)
}

//cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find(contact=> contact.nama === nama);
};

//hapus kontak
const deleteContact = (nama)=>{
  const contacts = loadContact()
  const filteredContacts =contacts.filter((contact)=> contact.nama !== nama)
  saveContacts(filteredContacts);
}

const updateContacts=(contactBaru)=>{
  const contacts = loadContact()
  //Hilangkan kontak lama yang namanya = namaLama
  const filteredContacts = contacts.filter(contact=>contact.nama !== contactBaru.namaLama);
  delete contactBaru.namaLama;
  filteredContacts.push(contactBaru);
  saveContacts(filteredContacts);
}



module.exports = {loadContact, findContact,addContact,cekDuplikat,deleteContact,updateContacts};