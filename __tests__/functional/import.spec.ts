import mongoose from "mongoose"
import { ContactSchema } from '../../src/schemas'

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
  (await ContactSchema.create({ email: 'madson@madson.com.br' }))

  const list = await ContactSchema.find()
  console.log(list)

  expect(list).toEqual(
   expect.arrayContaining([
    expect.objectContaining({
     email: 'madson@madson.com.br'
    })
   ])
  )
 })
})