import os

class SummaryTemplateParser:
    def __init__(self):
        self.current_path = os.path.dirname(os.path.abspath(__file__))

    def get(self, group: str, key: str, vars:dict={}):
        if not group or not key:
            return None

        group_path = os.path.join(self.current_path, "prompts", f"{group}.py")

        if not os.path.exists(group_path):
            group_path = os.path.join(self.current_path, "prompts", f"{group}.py") # default language

        if not os.path.exists(group_path):
            return None

        # import group module
        module = __import__(f"src.stores.summary.prompts.{group}", fromlist=["group"])

        if not module:
            return None

        key_attribute = getattr(module, key)  # get the needed prompt

        return key_attribute.substitute(vars)