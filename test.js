import http from "http"

const s = http.createServer((req,res) =>{
  res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Token,Content-Type",
      "Access-Control-Allow-Methods": "*"
    });
  res.end(JSON.stringify({
    test:"helo"
  }))
})

s.listen(8080)

