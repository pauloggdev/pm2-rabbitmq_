import * as express from 'express';
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(cors());

import MysqlConnection from './src/infra/db/MysqlConnection';
import EnrollStudent from   './src/application/usecase/enroll-student';
import GetAllStudents from   './src/application/usecase/get-all-students';
import RegisterStudent, { InputDataRegisterStudent } from   './src/application/usecase/register-student';
import ValidatorStudentRegistration, { InputValidatorStudentRegistration } from   './src/application/usecase/validator-student-registration';
import MatriculaRepositoryDatabase from './src/infra/repository/database/MatriculaRepositoryDatabase';
import StudentRepositoryDatabase from './src/infra/repository/database/StudentRepositoryDatabase';

const mysqlConnection = new MysqlConnection('localhost', 'root', 'root', 'escolas_');

app.post('/enrollStudent', async function (req: any, res: any) {
    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const matriculaRepository = new MatriculaRepositoryDatabase(mysqlConnection);
    const enrollStudent  = new EnrollStudent(studentRepository, matriculaRepository);
    enrollStudent.execute(req.body.aluno_id);
    res.json({success: 'sucess'})

})
app.get('/getAllStudents', async function (req: any, res: any) {
    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const getAllStudents = new GetAllStudents(studentRepository);
    const data = await getAllStudents.execute();
    res.json(data)
})
app.post('/registerStudent', async function (req: any, res: any) {

    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const registerStudent = new RegisterStudent(studentRepository);
    const inputDataRegisterStudent:InputDataRegisterStudent ={
        nome: req.body.nome,
        email: req.body.email,
        docBI:req.files.docBI.data
    }
    registerStudent.execute(inputDataRegisterStudent);
    res.json({success: 'sucess'})
})
app.put('/validatorStudentRegistration', async function (req: any, res: any) {

    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const matriculaRepository = new MatriculaRepositoryDatabase(mysqlConnection);
    const validatorStudent = new ValidatorStudentRegistration(matriculaRepository, studentRepository);
    const inputDataValidatorStudent:InputValidatorStudentRegistration ={
        studentId:req.body.aluno_id,
        codeRegistration:req.body.code
    }
    validatorStudent.execute(inputDataValidatorStudent);
    res.json({success: 'sucess'})
})
app.listen(3000, () => {
    console.log("Rodando o servidor localhost:3000");
});

