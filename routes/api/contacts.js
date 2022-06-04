const express = require('express');
const router = express.Router();
const {listContacts, getContactById, addContact, updateContact, removeContact, updateStatusContact} = require('../../controllers/contacts');
const {validateContact} = require('../../middlewares/validateContact');
const {joiSchema, favoriteJoiSchema} = require('../../models/contact');

router.get('/', listContacts);
router.post('/', validateContact(joiSchema), addContact);
router.get('/:contactId', getContactById);
router.put('/:contactId', validateContact(joiSchema), updateContact);
router.patch('/:contactId/favorite', validateContact(favoriteJoiSchema), updateStatusContact);
router.delete('/:contactId', removeContact);

module.exports = router