const express = require('express');
const router = express.Router();
const {listContacts, getContactById, addContact, updateContact, removeContact, updateStatusContact} = require('../../controllers/contacts');
const {validate} = require('../../middlewares/validate');
const {joiSchema, favoriteJoiSchema} = require('../../models/contact');

router.get('/', listContacts);
router.post('/', validate(joiSchema), addContact);
router.get('/:contactId', getContactById);
router.put('/:contactId', validate(joiSchema), updateContact);
router.patch('/:contactId/favorite', validate(favoriteJoiSchema), updateStatusContact);
router.delete('/:contactId', removeContact);

module.exports = router