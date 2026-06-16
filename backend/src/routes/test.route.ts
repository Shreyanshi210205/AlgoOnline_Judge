import express from "express";
import { executeCpp } from "../executors/cpp.executor";

const router = express.Router();

router.get("/cpp", async (_req, res) => {

  const result = await executeCpp(
`
#include <iostream>
using namespace std;

int main() {
    int a,b;
    cin >> a >> b;
    cout << a+b;
}
`,
    "2 3"
  );

  res.json(result);
});

export default router;