import Student from "../../../domain/entity/Student";
import Connection from "../../db/Connection";
import StudentRepository from "../../../domain/repository/StudentRepository";

export default class StudentRepositoryDatabase implements StudentRepository {
    constructor(readonly connection: Connection) { }
    async get(uuid: string): Promise<Student> {
        const [student] = await this.connection.query("SELECT * FROM students WHERE uuid = ?", uuid);
        return new Student(uuid, student.nome, student.email, student.docBI,student.getPassword());
    }
    async getStudent(email:string):Promise<any>{
        const [student] = await this.connection.query("SELECT * FROM students WHERE email = ?", [
            email
        ]);
        if(!student) return null;
        return new Student(student.uuid, student.nome, student.email, student.docBI,student.password);
    }
    async getStudentByEmail(email:string):Promise<any>{
        const [student] = await this.connection.query("SELECT * FROM students WHERE email = ? LIMIT 1", [
            email
        ]);
        if(!student) return null;
        return new Student(student.uuid, student.nome, student.email, student.docBI,student.password);
    }
    async save(student: Student): Promise<void> {
        this.connection.query("insert into students (uuid, nome, email, docBI, password) values (?,?,?,?,?)", [
            student.uuid,
            student.nome,
            student.email,
            student.docBI,
            student.getPassword()
        ]);
    }
    async getAll(): Promise<Student[]> {
        const studentsData = await this.connection.query("SELECT * FROM students", []);
        const students: Student[] = [];
        for (let student of studentsData) {
            students.push(student);
        }
        return students;
    }

}