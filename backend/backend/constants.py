from fastapi.security import OAuth2PasswordBearer


DB_NAME="Observer"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/user/login")