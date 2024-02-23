# 用于生成搜索图的组件

import pandas as pd
import numpy as np
from typing import List
from time import time

class GraphData():
    def __init__(self, filename='./data/lda_graph_data.csv'):
        csv = pd.read_csv(filename)
        self.probs = {}
        self.data = {}
        for row in csv.itertuples(index=False):
            probs = [row.prob0, row.prob1, row.prob2, row.prob3, row.prob4, row.prob5, row.prob6, row.prob7, row.prob8, row.prob9]
            probs = [float(i) for i in probs]
            self.probs[row.id] = probs
            self.data[row.id] = row


    # �����±�Ż�ȡ������ÿ�����ĸ���
    @staticmethod
    def _get_probs(d):    
        probs = [d['prob0'], d['prob1'], d['prob2'], d['prob3'], d['prob4'], d['prob5'], d['prob6'], d['prob7'], d['prob8'], d['prob9']]
        probs = [float(i) for i in probs]
        return probs

    # �����ϵ��
    @staticmethod
    def calc_correlation(A, B):
        am = A - np.mean(A, axis=0, keepdims=True)
        bm = B - np.mean(B, axis=0, keepdims=True)
        corr = am.T @ bm /  (np.sqrt(
            np.sum(am**2, axis=0,
                   keepdims=True)).T * np.sqrt(
            np.sum(bm**2, axis=0, keepdims=True)))
        corr = float(corr)
        return corr

    # �������±���б�����ȡ���¹���ͼ������
    # ����nodes��vertices���ֱ����ͼ�ڵ��б��ͱ��б�
    def get_graph(self, article_ids: List):
        # ��ȡ�ڵ�����
        nodes = []
        for article_id in article_ids:
            article_data = self.data[article_id]
            article_type = article_data.type
            article_x = article_data.x
            article_y = article_data.y
            node = {
                'id': int(article_id),
                'x': float(article_x),
                'y': float(article_y),
                'type': int(article_type)
            }
            nodes.append(node)

        # ��ȡ������
        # time_ = 0
        vertices = []
        article_count = len(article_ids)
        # ����C(n,2)�����¶�
        for article_x in range(article_count):
            for article_y in range(article_x + 1, article_count):
                # time0 = time()
                prob_x = self.probs[article_ids[article_x]]
                prob_y = self.probs[article_ids[article_y]]
                # time_ += time() - time0
                
                # ����ƪ���µ����ϵ����Ϊ��Ȩ
                coeff = self.calc_correlation(prob_x, prob_y)
                if coeff < 0:
                    continue
                
                weight = (coeff + 1) / 2
                vertex = {
                    'node1': article_ids[article_x],
                    'node2': article_ids[article_y],
                    'weight': weight
                }
                vertices.append(vertex)
        
        return nodes, vertices

graph_data = GraphData()