import * as express from 'express';
const fileUpload = require('express-fileupload');
//const verifyToken = require('./src/middleware/auth');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(cors());

import MysqlConnection from './src/infra/db/MysqlConnection';
import EnrollStudent from './src/application/usecase/enroll-student';
import GetAllStudents from './src/application/usecase/get-all-students';
import GetStudentAuth from './src/application/usecase/get-student-auth';
import RegisterStudent, { InputDataRegisterStudent } from './src/application/usecase/register-student';
import ValidatorStudentRegistration, { InputValidatorStudentRegistration } from './src/application/usecase/validator-student-registration';
import MatriculaRepositoryDatabase from './src/infra/repository/database/MatriculaRepositoryDatabase';
import StudentRepositoryDatabase from './src/infra/repository/database/StudentRepositoryDatabase';

const mysqlConnection = new MysqlConnection('localhost', 'root', 'root', 'escolas_');

app.post('/login', async function (req: any, res: any) {
    try {
        const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
        const getStudent = new GetStudentAuth(studentRepository);
        const { email, password } = req.body;
        const student = await getStudent.execute(email);
        if (!student) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, student.getPassword());
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ studentId: student.uuid }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }

})
app.post('/enrollStudent', async function (req: any, res: any) {
    const studentRepository = new StudentRepositoryDatabase(mysqlConnection);
    const matriculaRepository = new MatriculaRepositoryDatabase(mysqlConnection);
    const enrollStudent = new EnrollStudent(studentRepository, matriculaRepository);
    enrollStudent.execute(req.body.aluno_id);
    res.json({ success: 'sucess' })
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Rodando o servidor localhost:3000");
});

