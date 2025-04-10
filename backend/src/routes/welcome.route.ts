import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
        console.log("Welcome page accessed");
        res.send("Welcome to Stayora!");
      });


      router.get('/api/user', (req, res) => {
        console.log("Welcome api accessed");
        res.send("Welcome to Stayora!");
      });
export default router;
