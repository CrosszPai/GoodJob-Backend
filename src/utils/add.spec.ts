import { add } from './add'

test('should return Hello World',()=>{
    expect(add('Hello ','World')).toBe('Hello World')
})