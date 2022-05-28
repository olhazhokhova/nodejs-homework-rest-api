const express = require('express')
const contacts = require('../../models/contacts')
const router = express.Router()

router.get('/', async (req, res, next) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if(!contact){
    res.status(404).json({ message: 'Not found' })
  } else {
    res.json(contact)
  }
})

router.post('/', async (req, res, next) => {
  const {name, email, phone} = req.body;
  const contact = await contacts.addContact(name, email, phone);
  res.status(201).json(contact);
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.removeContact(contactId);
  if(!contact){
    res.status(404).json({ message: `Contact with id ${contactId} not found` })
  } else {
    res.json({ message: 'Contact deleted' })
  }
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.updateContact(contactId, req.body);

  if(!contact) {
    res.status(404).json({ message: `Contact with id ${contactId} not found` });
  } else {
    res.json(contact);
  }
  
})

module.exports = router
