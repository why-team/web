
function sendData() {

    const query = document.getElementById('query').value;

    // 构建要发送给后端的数据对象
    const dataToSend = { query };


    // 发送 POST 请求到后端
    fetch('http://localhost:3000/api/process-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            // 处理后端返回的数据

            const total_number = data.count;
            const datalist = data.articles;

            createHtmlElement(total_number, datalist);
            // createPagination(3);

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createHtmlElement(total_number, data_list)
{
    //共找到 10 篇相关论文：
    document.getElementById('search_num').innerText = `There are ${total_number} articles in total.`
    // 生成列表和页面
    var showplate = document.createElement("ul");
    showplate.setAttribute("id", "show_plate");
    for (let i = 0; i < total_number; i++)
    {
        //生成列表
        var li = document.createElement("li");
        //生成h3
        var a = document.createElement("a");
        a.setAttribute("href", data_list[i].article_url);

        a.appendChild(document.createTextNode(data_list[i].title));

        var paper_title = document.createElement("h3");

        paper_title.appendChild(a);
        paper_title.setAttribute("class", "paper-title");

        li.appendChild(paper_title);
        //生成p1
        var p1 = document.createElement("p");
        p1.setAttribute("class", "author");
        p1.innerText = data_list[i].authors;

        li.appendChild(p1);
        //生成p2
        var p2 = document.createElement("p");
        p2.setAttribute("class", "references");
        p2.innerText = data_list[i].references;

        li.appendChild(p2);
        // 生成p3
        var p3 = document.createElement("p");
        p3.setAttribute("class", "abstract");
        p3.innerText = data_list[i].abstract_text;

        li.appendChild(p3);



        //生成p4
        var p4 = document.createElement("p");
        p4.setAttribute("class", "published");
        p4.innerText = data_list[i].published;
        li.appendChild(p4);


        //生成p5

        var p5 = document.createElement('p');
        p5.setAttribute("class", "doi");
        p5.innerText = data_list[i].doi;
        li.appendChild(p5)

        showplate.appendChild(li);
    }

    var con = document.getElementById("display");
    con.innerHTML = '';
    con.appendChild(showplate)
    console.log(showplate);

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
    window.location.href = `Search_results.html?query=${encodeURIComponent(queryInput)}`;
}
