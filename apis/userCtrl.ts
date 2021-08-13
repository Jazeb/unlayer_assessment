import * as express from "express";
import * as jwt from "jsonwebtoken";

import Tasks from "../models/tasks";

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// user login controller
const loginHandler = (req: any, res: any): void => {
  const email: string = req.body.email;
  const password: string = req.body;
  if(!email || !password)
    return res.status(400).json({ error:true, message:'Email or password missing', data:[] });

  const user = { email, password };
  
  const token = jwt.sign(JSON.stringify(user), JWT_SECRET);
  return res.status(200).json({ error:false, token });
  
}

// token auth controller
const authUserToken = (req, res, next: express.NextFunction): void => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
      jwt.verify(token, JWT_SECRET, (err: any, result: any) => {
          if (err) res.sendStatus(401);
          req.user = result;
          next();
      });
}

// create todo task controller
const createTodoHandler = (req: any, res: any): void => {
  const email: string = req.user.email;
  req.body.email = email;
  Tasks.create(req.body)
    .then(result => res.status(200).json({error:false, message: 'Task created successfully', 'data':result}))
    .catch(err => {
      console.error(err);
      return res.status(400).json({error:true, message: err, data:[]});
    }) ;
}


// update todo task controller
// remember to provide complete todo ob to update because we are using PUT request here
const updateTodoHandler = (req: any, res: any): void => {
  const { id } = req.body;
  if(!id)
    return res.status(400).json({error:true, message: 'Provide id of task'});

  delete req.body.id;

  Tasks.update(req.body, { where:{ id }})
    .then(result => res.status(200).json({error:false, message: 'Task updated successfully!', 'data':result }))
    .catch(err => {
      console.error(err);
      return res.status(400).json({error:true, message: err, data:[]});
    }) ;
}


// delete todo task controller
const deleteTodoHandler = (req: any, res: any): void => {
  const { id } = req.params;
  if(!id)
    return res.status(400).json({error:true, message: 'Provide id of task to delete'});

  Tasks.destroy({ where:{ id }})
    .then(result => res.status(200).json({error:false, message: 'Task deleted successfully!', 'data':result }))
    .catch(err => {
      console.error(err);
      return res.status(400).json({error:true, message: err, data:[]});
    }) ;
}


// get task by id controller
const getTodoHandler = (req: any, res: any): void => {
  const { id } = req.params;
  Tasks.findOne({ where: { id }})
    .then(task => res.status(200).json({ error:false, data: task }))
    .catch(err => res.status(400).json({ error:true, message: err}));
}


// get all tasks controller
const getTodosHandler = (req: any, res: any): void => {
  Tasks.findAll()
    .then(tasks => res.status(200).json({ error:false, data: tasks }))
    .catch(err => res.status(400).json({ error:true, message: err}));
}


// Routes
router.post('/login', loginHandler);
router.post('/todo',  authUserToken, createTodoHandler);
router.put('/todo',  authUserToken, updateTodoHandler);
router.delete('/todo/?id',  authUserToken, deleteTodoHandler);
router.get('/todo/:id',  authUserToken, getTodoHandler);
router.get('/todos',  authUserToken, getTodosHandler);



export default router;