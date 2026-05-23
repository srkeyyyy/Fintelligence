import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();


//security middlewares
app.use(helmet());

//logging middleware
app.use(morgan("dev"));


app.use(express.json());


//cors configuration
app.use(
    cors(
        {
            origin :process.env.CLIENT_URL,
            credentials: true,
        }
    )
);


app.get("/health" , (req,res) => {
    res.status(200).json({message : "Server is healthy"});
});


export default app;



