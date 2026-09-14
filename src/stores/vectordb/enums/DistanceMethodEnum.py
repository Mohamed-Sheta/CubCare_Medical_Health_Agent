from enum import Enum

class DistanceMethodEnum(Enum):
    COSINE = "cosine"
    DOT = "dot"


class PgVectorDistanceMethodEnum(Enum):
    COSINE = "vector_cosine_ops"
    DOT = "vector_ip_ops"