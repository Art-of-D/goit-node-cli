import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { default as detectEncodeLanguage } from "detect-file-encoding-and-language";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const contactsPath = path.join(path.dirname(__filename), "db/contacts.json");
const encoding = detectEncodeLanguage(contactsPath);

const readFile = async () => {
  const data = await fs.readFile(contactsPath, encoding);
  return JSON.parse(data);
};

const writeFile = (data) => {
  fs.writeFile(contactsPath, JSON.stringify(data), encoding);
};

async function listContacts() {
  return await readFile();
}

async function getContactById(contactId) {
  const list = await readFile();

  const contact = list.filter((contact) => {
    return contact.id === contactId;
  });
  if (contact.length > 0) {
    return contact[0];
  }
  return null;
}

async function removeContact(contactId) {
  const list = await readFile();

  const updatedList = list.filter((contact) => {
    return contact.id !== contactId;
  });
  writeFile(updatedList);

  if (updatedList.length < list.length) {
    return list.find((contact) => contact.id === contactId);
  } else {
    return null;
  }
}

async function addContact(name, email, phone) {
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  const list = await readFile();
  list.push(newContact);
  writeFile(list);
  return newContact;
}

export { listContacts, getContactById, removeContact, addContact };
