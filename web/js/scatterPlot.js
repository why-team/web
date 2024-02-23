var csvData;

// 使用XMLHttpRequest对象读取CSV文件
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        // 将CSV数据存储到变量中
        csvData = xhr.responseText;

        // 解析CSV数据并将其转换为Echarts所需的数据格式
        var lines = csvData.split("\n");
        var categories = [];
        var data = [];
        for (var i = 0; i < lines.length; i++) {
            var values = lines[i].split(",");
            data.push([values[0], values[1], values[2]]);
        }
        // console.log(data)

        // 使用Echarts生成图表
        // echarts.registerTransform(ecStat.transform.clustering);
        const chartDom = document.getElementById('scatterPlot');
        const myChart = echarts.init(chartDom);
        let option;

        option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {},
            yAxis: {},
            series: [
                {
                    symbolSize: 7,
                    encode: { tooltip: [0, 1] },
                    type: 'scatter',
                    data: data,
                    itemStyle: {
                        color: function(params) {
                            if (params.data[2] === "1.00E+00\r"){
                                return '#6a2c70'
                            }
                            if (params.data[2] === "2.00E+00\r"){
                                return "#b83b5e"
                            }
                            if (params.data[2] === "3.00E+00\r"){
                                return "#f08a5d"
                            }
                            if (params.data[2] === "4.00E+00\r"){
                                return "#f9ed69"
                            }
                            if (params.data[2] === "5.00E+00\r"){
                                return "#abedd8"
                            }
                            if (params.data[2] === "6.00E+00\r"){
                                return "#46cdcf"
                            }
                            if (params.data[2] === "7.00E+00\r"){
                                return "#3d84a8"
                            }
                            if (params.data[2] === "8.00E+00\r"){
                                return "#112d4e"
                            }

                        }
                    },
                    datasetIndex: 1
                }
            ]
        };

        option && myChart.setOption(option);
    }
};
xhr.open("GET", "/data/lda_coord.csv", true);
xhr.send();

