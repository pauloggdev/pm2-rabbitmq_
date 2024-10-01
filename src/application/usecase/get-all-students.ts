import StudentRepository from "../../domain/repository/StudentRepository";

export default class GetAllStudents{
    constructor(readonly studentRepository: StudentRepository){}
    async execute(){
        return await this.studentRepository.getAll();
    }
}