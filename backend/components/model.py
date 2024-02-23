import pickle

with open("bm25model.pkl", "rb") as f:
    bm25model = pickle.load(f)
