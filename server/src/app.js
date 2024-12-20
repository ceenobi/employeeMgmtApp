import express, { json } from "express";
import { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./middleware.js/errorHandler.js";

import authRoutes from "./routes/auth.js";
import deptRoutes from "./routes/dept.js";
import employeeRoutes from "./routes/employee.js";
import payrollRoutes from "./routes/payroll.js";

const app = express();
const httpServer = createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
  secure: true,
});

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.send("Hello express");
});

//api
app.use("/api/auth", authRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payrolls", payrollRoutes);

app.use(notFoundHandler);
// Handle all errors
app.use(errorHandler);

app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export { httpServer };
