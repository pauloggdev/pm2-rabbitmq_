import Student from "../entity/Student";

export default interface StudentRepository{
    get(uuid:string):Promise<Student>;
    getAll():Promise<Student[]>;
    save(student: Student): Promise<void>;
}