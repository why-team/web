
function sendData() {

    const query = document.getElementById('query').value;
    const token = localStorage.getItem('token');
    const paper_results = document.getElementById("paper_results")
    // 构建要发送给后端的数据对象
    let dataToSend = new FormData();

    dataToSend.append("query", query);
    // dataToSend.append("token", token);
    dataToSend.append("token", token);

    paper_results.innerHTML = "\"" + query + "\""
    // 发送 POST 请求到后端
    fetch('http://49.232.169.105:8090/api/search', {
        method: "POST",
        body: dataToSend
    })
        .then(response => response.json())
        .then(data => {
            // 处理后端返回的数据

            const total_number = data.count;
            const datalist = data.articles;
            const token = data.token;

            localStorage.setItem("token", token);

            createHtmlElement(total_number, datalist);
            // createPagination(3);
            // console.log(datalist);
            // console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createHtmlElement(total_number, data_list)
{
    //共找到 10 篇相关论文：
    document.getElementById('search_num').innerText = `${total_number} articles`
    // 生成列表和页面
    var showplate = document.createElement("ul");
    showplate.setAttribute("id", "show_plate");
    showplate.setAttribute("class", "papers_information_ul_v1");
    var all_years = [];
    var all_words = [];
    for (let i = 0; i < total_number; i++)
    {
        var showplate_v2 = document.createElement("ul");
        showplate_v2.setAttribute("id", "show_plate_v2");
        showplate_v2.setAttribute("class", "papers_information_ul");
        //生成列表
        var li = document.createElement("li");
        //生成h3
        var a = document.createElement("a");
        a.setAttribute("href", data_list[i].url);

        a.appendChild(document.createTextNode(i+1 + ". " + data_list[i].title));
        all_words.push(data_list[i].title);

        var paper_title = document.createElement("h3");

        paper_title.appendChild(a);
        paper_title.setAttribute("class", "paper-title");

        li.appendChild(paper_title);

        //生成date和year
        var date = document.createElement("p");
        date.setAttribute("class", "date_year");
        date.innerText = data_list[i].published_date + ", " + data_list[i].published_year;
        all_years.push(data_list[i].published_year)

        li.appendChild(date);

        //生成author
        var p1 = document.createElement("p");
        p1.setAttribute("class", "author");
        p1.innerText = data_list[i].authors;

        li.appendChild(p1);

        //生成doi
        var p5 = document.createElement('p');
        p5.setAttribute("class", "doi");
        p5.innerText = data_list[i].doi;
        li.appendChild(p5);

        // 生成abstract
        var p3 = document.createElement("p");
        p3.setAttribute("class", "abstract");
        p3.innerText = data_list[i].abstract;

        li.appendChild(p3);

        showplate_v2.appendChild(li);
        showplate.appendChild(showplate_v2)

    }
    console.log(all_years);
    all_years.sort()
    let all_years_sort = [];
    for (let i = 0;i < all_years.length; i++){
        if (all_years[i] !== all_years[i-1]){
            all_years_sort.push(all_years[i]);
        }
    }
    // 统计词频
    const map = {};
    for (let i=0; i<all_words.length; i++)
    {
        const str = all_words[i];
        const array = str.split(" ");
        for (let j=0; j<array.length; j++)
        {
            const strWord = array[j];
            if (!map[strWord])
            {
                map[strWord] = 1;
            }
            else
            {
                map[strWord]++;
            }
        }
    }

    // 将字典对象转换为包含键值对的数组，并按值进行排序
    var sortedArray = Object.keys(map).sort(function(a, b) {
        return map[b] - map[a];
    }).map(function(key) {
        return { key: key, value: map[key] };
    });

    // 创建一个新的有序字典对象
    var sortedDict = {};
    sortedArray.forEach(function(item) {
        sortedDict[item.key] = item.value;
    });

    // console.log(sortedDict); // 输出按值排序后的字典对象

    // 检查无效字符并删去
    var deleteList = ["for", "of", "and", "in", "the", "A", "to", "a", "on", "an"]
    let exists;
    for (const key_2 in sortedDict) {
        exists = deleteList.includes(key_2)
        if (exists) {
            delete sortedDict[key_2]; // 使用 delete 运算符删除对象属性
        }
    }

    // 将词频插入网页中
    var con = document.getElementById("display");
    con.innerHTML = '';
    con.appendChild(showplate)
    console.log(showplate);
    var All_Years = document.getElementById("specific_years")
    All_Years.innerText = all_years_sort
    var words_fre = document.getElementById("specific_words")
    for (var key in sortedDict){
        var listItem = document.createElement("li");
        listItem.textContent = key + "——————————————" + sortedDict[key];
        words_fre.appendChild(listItem);
    }


}

// function createPagination(num_of_createPagination)
// {
//     var pagination = document.getElementById("pagination");
//     var front_page = document.createElement("a");
//     front_page.setAttribute("href", "#");
//     front_page.innerText = "front_page";
//     pagination.appendChild(front_page);
//     for (var i = 0; i < num_of_createPagination;i++)
//     {
//         var page = document.createElement("a");
//         page.setAttribute("href", "#");
//         page.innerText = ` ${i + 1} `;
//         pagination.appendChild(page);
//     }
//     var after_page = document.createElement("a");
//     after_page.setAttribute("href", "#");
//     after_page.innerText = "after_page";
//     pagination.appendChild(after_page);
// }

const button = document.getElementById('search_button');

let lastClickTime = 0;

button.addEventListener('click', () => {
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 2000);

    console.log('Clicked');
})

function transmit(){
    const queryInput = document.getElementById("searchInput").value;
    console.log(queryInput);
    window.location.href = `Search_results_2.html?query=${encodeURIComponent(queryInput)}`;
}
