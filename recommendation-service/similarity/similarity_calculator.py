from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from preprocessing.text_cleaner import clean_text

def compute_similarity(text1: str, text2: str) -> float:
    """
    Cleans text1 and text2, fits a local TF-IDF model on both,
    and returns their Cosine Similarity score (0.0 to 1.0).
    """
    cleaned1 = clean_text(text1)
    cleaned2 = clean_text(text2)
    
    if not cleaned1 or not cleaned2:
        return 0.0
        
    try:
        vectorizer = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b") # Handle single character words/skills
        tfidf_matrix = vectorizer.fit_transform([cleaned1, cleaned2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        return float(sim[0][0])
    except Exception:
        return 0.0

def compute_list_similarity(list1: list, list2: list) -> float:
    """
    Directly converts lists of keywords (like skills) to space-separated token strings
    and computes their TF-IDF similarity.
    """
    str1 = " ".join([str(item) for item in list1])
    str2 = " ".join([str(item) for item in list2])
    return compute_similarity(str1, str2)
