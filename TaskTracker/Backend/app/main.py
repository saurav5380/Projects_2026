from fastapi import FastAPI

app = FastAPI(title="TaskTracker API")


@app.get("/")
def read_root() -> dict:
    return {"status": "ok"}
