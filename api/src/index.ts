import express from 'express';
const fileUpload = require('express-fileupload');
import auth from './middlewares/auth';
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(cors());

import MysqlConnection from './infra/db/MysqlConnection';
import EnrollStudent from './application/usecase/enroll-student';
import GetAllStudents from './application/usecase/get-all-students';
import GetToken from './application/usecase/get-token';
import RegisterStudent, { InputDataRegisterStudent } from './application/usecase/register-student';
import ValidatorStudentRegistration, { InputValidatorStudentRegistration } from './application/usecase/validator-student-registration';
import MatriculaRepositoryDatabase from './infra/repository/database/MatriculaRepositoryDatabase';
import StudentRepositoryDatabase from './infra/repository/database/StudentRepositoryDatabase';

const mysqlConnection = new MysqlConnection('localhost', 'root', 'root', 'escolas_');

app.post('/login', async function (req: any, res: any) {
    try {
        const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
        const getToken = new GetToken(studentRepository);
        const { email, password } = req.body;
        const token = await getToken.execute(email, password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error});
    }
})
app.post('/enrollStudent', async function (req: any, res: any) {
    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const matriculaRepository = new MatriculaRepositoryDatabase(mysqlConnection);
    const enrollStudent = new EnrollStudent(studentRepository, matriculaRepository);
    enrollStudent.execute(req.body.aluno_id);
    res.json({ success: 'sucess' });
})
app.get('/getAllStudents', async function (req: any, res: any) {
    const page = parseInt(req.query.page) || 1; 
    const search = req.query.search || null;
    console.log(search)
    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const getAllStudents = new GetAllStudents(studentRepository);
    const data = await getAllStudents.execute(page, search);
    res.json(data)
})
app.post('/registerStudent', async function (req: any, res: any) {
    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const registerStudent = new RegisterStudent(studentRepository);
    const inputDataRegisterStudent: InputDataRegisterStudent = {
        nome: req.body.nome,
        email: req.body.email,
        docBI: req.files.docBI.data,
        password: req.body.password
    }
    registerStudent.execute(inputDataRegisterStudent);
    res.json({ success: 'sucess' })
})
app.put('/validatorStudentRegistration', async function (req: any, res: any) {

    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const matriculaRepository = new MatriculaRepositoryDatabase(mysqlConnection);
    const validatorStudent = new ValidatorStudentRegistration(matriculaRepository, studentRepository);
    const inputDataValidatorStudent: InputValidatorStudentRegistration = {
        studentId: req.body.aluno_id,
        codeRegistration: req.body.code
    }
    validatorStudent.execute(inputDataValidatorStudent);
    res.json({ success: 'sucess' })
})
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Rodando o servidor localhost:${PORT}`);
});

