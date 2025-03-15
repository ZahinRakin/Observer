import uvicorn  # type: ignore

def main():
    uvicorn.run("backend.app:app", host="localhost", port=8000, reload=True)

if __name__ == "__main__":
    main()
