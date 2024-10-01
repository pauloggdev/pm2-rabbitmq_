import Student from "../../../domain/entity/Student";
import Connection from "../../db/Connection";
import StudentRepository from "../../../domain/repository/StudentRepository";

export default class StudentRepositoryDatabase implements StudentRepository {

    constructor(readonly connection: Connection) { }
    
    async get(uuid: string): Promise<Student> {
        const [student] = await this.connection.query("SELECT * FROM students WHERE uuid = ?", uuid);
        return new Student(uuid, student.nome, student.email, student.docBI);
    }
    async save(student: Student): Promise<void> {
        this.connection.query("insert into students (uuid, nome, email, docBI) values (?,?,?,?)", [
            student.uuid,
            student.nome,
            student.email,
            student.docBI
        ]);
    }
    async getAll(): Promise<Student[]> {
        const studentsData = await this.connection.query("SELECT * FROM students",[]);
        const students:Student[] = [];
        for(let student of studentsData){
            students.push(student);
        }
        return students;
    }

}