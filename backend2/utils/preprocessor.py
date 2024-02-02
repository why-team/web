from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

class Preprocessor:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stopwords = set(stopwords.words('english'))

    def tokenize(self, text):
        return word_tokenize(text)

    def lemmatize(self, token):
        return self.lemmatizer.lemmatize(token)

    def remove_stopwords(self, tokens):
        return [token for token in tokens if token not in self.stopwords]

    def preprocess(self, text):
        tokens = self.tokenize(text)
        tokens = [self.lemmatize(token.lower()) for token in tokens]
        tokens = self.remove_stopwords(tokens)
        return tokens