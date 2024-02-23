import pymysql;
import pandas as pd

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='admin',
    database='testtest',
    charset='utf8mb4',
)

cursor = conn.cursor()

data = pd.read_csv('data.tsv', sep='\t')

for index, row in data.iterrows():
    id = index

    title = row['TI']
    title = title.replace("\"", "\\\"")

    authors = row['AU']

    abstract = str(row['AB'])
    abstract = abstract.replace("\"", "\\\"")
    
    doi = str(row['DI'])
    if doi != 'nan':
        url = 'https://doi.org/' + doi
    else:
        doi = 'Unknown'
        url = 'Unknown'
    
    year = row['PY']
    month = row['PD'].capitalize()

    references = str(row['CR'])
    if references == 'nan':
        references = ""
    # print(references)
    references = references.replace("\"", "\\\"")

    sql = 'INSERT INTO Articles (title, authors, doi, url, published_year, published_date, abstract, reference) ' + \
                       f'VALUES ("{title}", "{authors}", "{doi}", "{url}", "{year}", "{month}", "{abstract}", "{references}")'
    # print(sql)
    cursor.execute(sql)
    # print(references.split(sep='; '))
    # break
conn.commit()

conn.close()
