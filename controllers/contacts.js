const { NotFound } = require("http-errors");
const { Contact } = require("../models/contact");

const listContacts = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({owner: _id}, "", {skip, limit: Number(limit)}).populate("owner", "_id email subscription");
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts
      }
    })
  } catch (e) {
    next(e);
  }
  
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if(!contact){
      throw new NotFound(`Contact with id=${contactId} not found`)
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contact
      }
    })
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndRemove(contactId);
    if(!contact){
      throw new NotFound(`Contact with id=${contactId} not found`)
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contact
      }
    })
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const contact = await Contact.create({ ...req.body,  owner: _id });
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        contact
      }
    })
  } catch (e) {
    if(e.message.includes('duplicate')){
      e.status = 400
    }
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!contact){
      throw new NotFound(`Contact with id=${contactId} not found`)
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contact
      }
    })
  } catch (e) {
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const contact = await Contact.findByIdAndUpdate(contactId, { favorite }, {new: true});
    if(!contact){
      res.json({
        code: 404,
        message: "Not found"
      })
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contact
      }
    })
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
