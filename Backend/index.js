const express = require("express");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const PORT = 8080;
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();
app.use(cors());

// const { json } = require("express");

// 파일로 관리하는 이유는 naver에
app.get("/api/data", async (req, res) => {
    try {
        // 파일을 읽어서
        // const originalFile = await fs.promises.readFile('uploads/chart.json');

        // return res.json(originalFile);
        // 임시 파일 생성
        // json 파일 양 끝에 [] 를 붙여주기 위해 만든다.
        // await fs.promises.writeFile("uploads/chart-temp.json", `[${originalFile.toString()}]`);
        res.set("Content-Type", "application/json; charset=utf-8");
        // res.set('Content-Disposition',`inline; filename="test.json"`);
        const tempFile = fs.createReadStream("uploads/chart.json");
        return tempFile.pipe(res);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
});
app.post("/api/data", async (req, res) => {
    // https://developers.naver.com/docs/datalab/search/
    try {
        const {
            startDate,
            endDate,
            timeUnit,
            device,
            gender,
            keywordGroups,
            ages,
        } = req.body;
        const request_body = {
            startDate: startDate,
            endDate: endDate,
            timeUnit: timeUnit,
            device: device === "all" ? "" : device,
            gender: gender === "all" ? "" : gender,
            ages: ages === "all" ? "" : ages,
            keywordGroups: keywordGroups,
        };

        const url = "https://openapi.naver.com/v1/datalab/search";
        const headers = {
            "Content-Type": "application/json",
            "X-Naver-Client-Id": process.env.CLIENT_ID,
            "X-Naver-Client-Secret": process.env.CLIENT_SECRET,
        };
        const result = await axios.post(url, request_body, {
            headers: headers,
            // headers
        });
        // console.log(result.data);

        fs.writeFile(
            `./uploads/chart.json`,
            JSON.stringify(result.data["results"]),
            function (error) {
                console.log(error);
                if (error) throw error;
            }
        );

        return res.json({ status: "OK" });
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
});
app.delete("/api/data", async (req, res) => {
    fs.unlink("uploads/chart.json", function (error) {
        if (error) {
            console.log(error);
            return res.json("Fail");
        }
    });

    return res.json({ status: "OK" });
});

app.listen(PORT, () => console.log(`this server ${PORT}`));
