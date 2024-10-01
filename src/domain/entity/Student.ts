
import { v4 as uuidv4 } from 'uuid';

export default class Student{
    constructor(readonly uuid:string, readonly nome:string, readonly email:string, readonly docBI:any){}
    static create(nome:string, email:string, docBI:any):Student{
        const uuid = uuidv4();
        return new Student(uuid, nome, email, docBI)
    }
}