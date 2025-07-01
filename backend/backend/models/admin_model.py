from .user_model import User


class Admin(User):
  class Settings:
    name = "admins"