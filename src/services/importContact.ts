import { Readable } from 'stream'
import csvParser from 'csv-parse'
import { ContactSchema, TagSchema } from '../schemas'


class ImportContactService {
 async run(contactsFileStream: Readable, tagsToSend: string[]): Promise<void> {
  const parsers = csvParser({
   delimiter: ';',
  })

  const parseCSV = contactsFileStream.pipe(parsers)

  const existentTags = await TagSchema.find({
   title: tagsToSend
  })

  const existentTagsTitles = existentTags.map(tag => tag)

  const newTagsData = tagsToSend.filter(tag => !existentTagsTitles.includes(tag)).map(tag => ({ title: tag }))
  console.log(newTagsData)

  const tagsData = tagsToSend.map(tag => ({ title: tag }))

  const createdTags = await TagSchema.create(newTagsData, {}, undefined)

  const tagsId = createdTags.map(tag => tag._id)



  parseCSV.on('data', async line => {
   const [email] = line

   await ContactSchema.create({ email, tags: tagsId })
  })

  await new Promise<void>(resolve => parseCSV.on('end', resolve))
 }
}

export default ImportContactService;