const express = require('express');
const contacts = require('../../models/contacts');
const router = express.Router();
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().pattern(/^[0-9]+$/).required(),
})

router.get('/', async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (e) {
    next(e);
  }
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try{
    const contact = await contacts.getContactById(contactId);
    if(!contact){
      res.status(404).json({ message: `Contact with id ${contactId} not found` });
    } else {
      res.json(contact)
    }
  } catch (e) {
    next(e);
  }
  
})

router.post('/', async (req, res, next) => {
  try{
    const { error } = schema.validate(req.body);
    if(error) {
      res.status(400).json({ message: "missing required name field" });
    }
    const {name, email, phone} = req.body;
    const contact = await contacts.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (e) {
    next(e);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try{
    const contact = await contacts.removeContact(contactId);
    if(!contact){
      res.status(404).json({ message: `Contact with id ${contactId} not found` })
    } else {
      res.json({ message: 'Contact deleted' })
    }
  } catch (e) {
    next(e);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try{

    if (Object.keys(req.body).length === 0){
      res.status(400).json({ message: "missing fields" });
    }

    const { contactId } = req.params;
    const { error } = schema.validate(req.body);

    if(error) {
      res.status(400).json({ message: "missing required name field" });
    }
    const contact = await contacts.updateContact(contactId, req.body);
    if(!contact) {
      res.status(404).json({ message: `Contact with id ${contactId} not found` });
    } else {
      res.json(contact);
    }
  } catch (e) {
    next(e);
  }
})

module.exports = router
