import { Request, Response } from "express";
import express, { Express } from "express";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";

type EAInput = {
  id: number | string;
  data: {
    number: string;
    infoType: string;
  };
};

type EAOutput = {
  JobRunId: string | number;
  statusCode: number;
  data?: {
    result?: any;
  };
  error?: string;
};

const PORT = process.env.PORT || 8080;

const app: Express = express();
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("External adapter hello ooooo");
});

app.post("/", async (req: Request, res: Response) => {
  const EAInputData: EAInput = req.body;
  // console.log("Request data received", EAInputData);

  const url = `http://newcpmliveprice.myempowervest.com/${EAInputData.data.number}/${EAInputData.data.infoType}`;

  let responseData: EAOutput = {
    JobRunId: EAInputData.id,
    statusCode: 0,
  };
  

  try {
    const apiResponse: AxiosResponse = await axios.get(url);
    responseData.data = { result: apiResponse.data };
    responseData.statusCode = apiResponse.status;
    // console.log("App response", responseData);
    res.json(responseData);
  } catch (error : any) {
    console.log("App response", error);
    responseData.error = error.message;
    responseData.statusCode = error.response?.status || 500;
    res.json(responseData);
  }

});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
