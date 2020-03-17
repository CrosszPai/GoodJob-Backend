import request from 'supertest'
import app from './routes'

describe('Test root path',()=>{
  test('it should response get method',async ()=>{
      const response = await request(app)
        .get("/")
        expect(response.status).toBe(200)
  })
  test('it should return body',async ()=>{
      const response = await request(app)
                            .post('/')
                            .send({ text : 'Hello World'})
      const body = response.body
      expect(body.text).toBe("Hello World")
  })
})
