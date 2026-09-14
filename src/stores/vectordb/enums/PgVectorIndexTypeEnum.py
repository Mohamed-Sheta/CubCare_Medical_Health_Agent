from enum import Enum

class PgVectorIndexTypeEnum(Enum):
    """
    This Class defines an enumeration class `PgVectorIndexTypeEnum` that represents different types of vector index types used in PostgreSQL.

    The two index types included in this enumeration are:
    1. `HNSW` (Hierarchical Navigable Small World): This index type is used for efficient nearest neighbor search in high-dimensional spaces. It is particularly useful for applications involving large datasets and complex queries.
    2. `IVFFLAT` (Inverted File with Flat quantization): This index type is another method for indexing high-dimensional vectors, which uses an inverted file structure combined with flat quantization to improve search performance.
    """
    HNSW = "hnsw" # like a graph-based algorithm for efficient nearest neighbor search in high-dimensional spaces.
    IVFFLAT = "ivfflat" # like gready algorithm, but with a flat quantization approach for indexing high-dimensional vectors.
