const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if(!contact){
    return null;
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  const deletedContact = contacts[contactIndex];
  if(contactIndex !== -1) {
    contacts.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  }
  if(!deletedContact){
    return null;
  }
  return deletedContact;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {
    id: String(contacts.length + 1),
    name, 
    email, 
    phone
  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if(contactIndex !== -1) {
    contacts[contactIndex] = {id: contactId, ...body};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[contactIndex];
  } else {
      return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
