import mongoose from "mongoose"
import { Readable } from 'stream'
import { ContactSchema, TagSchema } from '../schemas'
import { ImportContactService } from "../services"

describe('Import', () => {
 beforeAll(async () => {
  if (!process.env.MONGO_URL) {
   throw new Error('MongoDb server not initialized')
  }

  await mongoose.connect(process.env.MONGO_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
  })
 })

 afterAll(async () => {
  await mongoose.connection.close()
 })

 beforeEach(async () => {
  await ContactSchema.deleteMany({})
 })

 it('should be able to import new contacts', async () => {
  const contactsFileStream = Readable.from([
   'madson@madson.com\n',
   'sarah@sarah.com\n',
   'costelinha@costela.com\n',
  ])

  const importContacts = new ImportContactService()
  const mockTagsToCreate = ['Students', 'Class A']
  await importContacts.run(contactsFileStream, mockTagsToCreate)

  const createdTags = await TagSchema.find({}).lean()

  expect(createdTags).toEqual(
   expect.arrayContaining(mockTagsToCreate.map(tag => expect.objectContaining({ title: tag })))
  )

  const createdTagsIds = createdTags.map(tag => tag._id)
  const createdContacts = await ContactSchema.find({}).lean()

  expect(createdContacts).toEqual([
   expect.objectContaining({ email: 'madson@madson.com', tags: createdTagsIds }),
   expect.objectContaining({ email: 'sarah@sarah.com', tags: createdTagsIds }),
   expect.objectContaining({ email: 'costelinha@costela.com', tags: createdTagsIds }),
  ])
 })

 it.skip('shoud not recreate tags that already exists', async () => {
  const contactsFileStream = Readable.from([
   'madson@madson.com\n',
   'sarah@sarah.com\n',
   'costelinha@costela.com\n',
  ])

  const importContacts = new ImportContactService()
  await TagSchema.create({ title: 'Students' })

  const mockTagsToCreate = ['Students', 'Class A']
  await importContacts.run(contactsFileStream, mockTagsToCreate)

  const createdTags = await TagSchema.find({}).lean()

  expect(createdTags).toEqual([
   expect.objectContaining({ title: 'Students' }),
   expect.objectContaining({ title: 'Class A' }),
  ])
 })

 it.skip('shoud not recreate contacts that already exists', async () => {
  const contactsFileStream = Readable.from([
   'madson@madson.com\n',
   'sarah@sarah.com\n',
   'costelinha@costela.com\n',
  ])

  const importContacts = new ImportContactService()
  // nao deve criar usuario caso exista
  // caso exista, apenas adicionar a tag a ele
 })
})