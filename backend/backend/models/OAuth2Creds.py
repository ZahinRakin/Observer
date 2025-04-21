from beanie import Document

class OAuthCredentials(Document):
  user_id: str
  credentials_json: str	

  class Settings:
    name = "oauth_credentials"