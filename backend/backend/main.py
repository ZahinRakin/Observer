import uvicorn
from dotenv import load_dotenv
import os



def main():
  os.environ.clear()  # this to make sure that previous loaded obsolete variables doesn't stay.
  load_dotenv()
  uvicorn.run("backend.app:app", host="localhost", port=3000, reload=True)



if __name__ == "__main__":
  main()

