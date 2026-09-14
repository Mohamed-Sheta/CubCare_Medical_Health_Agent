import os
from src.stores.llm.enums import LanguagesAvailableEnum

class TemplateParser:
    def __init__(self, language: str = LanguagesAvailableEnum.ENGLISH.value):
        self.current_path = os.path.dirname(os.path.abspath(__file__))
        self.language = language


    def set_language(self, language: str):
        if not language:
            self.language = LanguagesAvailableEnum.ENGLISH.value  # let it as default
            return None

        language_path = os.path.join(self.current_path,"locales",language)

        if language and os.path.exists(language_path):
            self.language = language
        else:
            self.language = LanguagesAvailableEnum.ENGLISH.value


    def get(self, group: str, key: str, vars:dict={}):
        if not group or not key:
            return None

        target_language = self.language
        group_path = os.path.join(self.current_path, "locales", self.language, f"{group}.py")

        if not os.path.exists(group_path):
            target_language = LanguagesAvailableEnum.ENGLISH.value
            group_path = os.path.join(self.current_path, "locales", target_language, f"{group}.py") # default language

        if not os.path.exists(group_path):  # if there is no default language rag.py file
            return None

        # import group module
        module = __import__(f"src.stores.llm.template.locales.{target_language}.{group}", fromlist=["group"])

        if not module:
            return None

        key_attribute = getattr(module, key)  # get the needed prompt

        return key_attribute.substitute(vars)