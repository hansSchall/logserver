import express from "express";
import { join } from "path";
import expressWs from "express-ws"

const app_ = express();
expressWs(app_);
const app = (app_ as any as expressWs.Application); // add .ws(...)

app.get("/app", (req, res) => {
    res.sendFile(join(__dirname, "../../frontend/dist/index.html"));
})
app.use("/app", express.static(join(__dirname, "../../frontend/dist")))
app.get("/", (req, res) => {
    res.redirect("/app");
});

const prevLogs = new Map<string, string[][]>();

const listener = new Set<(msg: string) => void>();

app.ws("/reporter", (ws, req) => {
    ws.on("message", (data_) => {
        const data = data_.toString();
        const msg = splitcomma(data);
        const msgType = msg.shift() || "";
        if (msgType == "log") {
            const direct = joincomma([...msg]);
            listener.forEach(_ => _(direct));
            const target = msg.shift() || "";
            if (!prevLogs.has(target))
                prevLogs.set(target, []);
            prevLogs.get(target)?.push(msg);
        } else {

        }
    })
})

app.ws("/listener", (ws, req) => {
    ws.on("message", (data_) => {
        const data = data_.toString();
        if (data.startsWith("#")) {
            if (data == "#sendall") {
                prevLogs.forEach((logs, target) => {
                    logs.forEach(msg => {
                        onMsg(joincomma([target, ...msg]));
                    })
                })
            }
        }
    })
    function onMsg(msg: string) {
        ws.send(">" + msg);
    }
    listener.add(onMsg);
    ws.on("close", () => {
        listener.delete(onMsg);
    })
})


function splitcomma(joined: string) {
    return joined.split(/(?<!\\),/g).map(_ => _.replace(/\\(?!\\)/g, "").replace(/\\\\/g, "\\"))
}

function joincomma(splitted: string[]) {
    return splitted.map(_ => _.replace(/\\/g, "\\\\").replace(/,/g, "\\,")).join(",");
}

const SERVER_INTERNAL = "log_server_internal";

const port = parseInt(process.argv[2] || "");

if (isNaN(port)) {
    console.log("Usage: node server.js [port]");
    process.exit();
} else {
    app.listen(port, () => {
        console.log(`server listening on port ${port}`);
        if (!prevLogs.has(SERVER_INTERNAL))
            prevLogs.set(SERVER_INTERNAL, []);
        prevLogs.get(SERVER_INTERNAL)?.push([...timestamp(), "Log", "server.ts", "listening on port " + port]);
    });
}

const format = new Intl.DateTimeFormat("de-de", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
})

function now() {
    return format.format(new Date());
}

function timestamp() {
    return [
        now(),
        "+" + Math.round(performance.now()),
    ]
}


prevLogs.set(SERVER_INTERNAL, [
    [...timestamp(), "Log", "server.ts", "starting"],
])